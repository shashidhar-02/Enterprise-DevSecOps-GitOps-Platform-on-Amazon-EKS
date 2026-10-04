# ==============================================================
# CraveDrop EKS Cluster - Auto Mode
# ==============================================================

data "aws_availability_zones" "available" {
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

locals {
  azs = slice(data.aws_availability_zones.available.names, 0, 3)

  # Enterprise Standard: Centralized Tagging
  tags = {
    Project     = "CraveDrop"
    Environment = var.environment # e.g., "dev" or "prod"
    ManagedBy   = "Terraform"
  }
}

# ---- VPC ----
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.21.0"

  name = "${var.cluster_name}-vpc"
  cidr = var.vpc_cidr

  azs             = local.azs
  private_subnets = [for k, v in local.azs : cidrsubnet(var.vpc_cidr, 4, k)]
  public_subnets  = [for k, v in local.azs : cidrsubnet(var.vpc_cidr, 8, k + 48)]

  enable_nat_gateway     = true
  single_nat_gateway     = var.environment != "prod"
  one_nat_gateway_per_az = var.environment == "prod"

  # DevSecOps: Enable VPC Flow Logs for network traffic auditing
  enable_flow_log                                 = true
  create_flow_log_cloudwatch_log_group            = true
  create_flow_log_cloudwatch_iam_role             = true
  flow_log_cloudwatch_log_group_retention_in_days = 90
  flow_log_cloudwatch_log_group_kms_key_id        = aws_kms_key.logs.arn

  # Tags required for EKS Auto Mode to discover subnets
  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1
  }

  tags = local.tags
}

# ---- EKS Cluster (Auto Mode) ----
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.37.2"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  # Auto Mode — EKS manages node groups, kube-proxy, CoreDNS, etc.
  cluster_compute_config = {
    enabled    = true
    node_pools = ["general-purpose", "system"]
  }
  # Auto Mode uses EKS-managed node security groups, not the legacy node-group SG.
  create_node_security_group = false

  # Networking
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  cluster_endpoint_public_access       = var.enable_public_endpoint
  cluster_endpoint_public_access_cidrs = var.enable_public_endpoint ? var.public_access_cidrs : ["127.0.0.1/32"]
  cluster_endpoint_private_access      = true

  # Auth mode required for Auto Mode
  authentication_mode = "API"

  # Enable OIDC for IAM Roles for Service Accounts (IRSA)
  # Crucial if pods need to access AWS resources like S3 or SQS later
  enable_irsa = true

  # Security: envelope encryption for secrets at rest
  cluster_encryption_config = {
    resources = ["secrets"]
  }

  # Security: enable logging
  cluster_enabled_log_types = [
    "api",
    "audit",
    "authenticator",
    "controllerManager",
    "scheduler"
  ]
  cloudwatch_log_group_retention_in_days = 90
  cloudwatch_log_group_kms_key_id        = aws_kms_key.logs.arn

  enable_cluster_creator_admin_permissions = false
  access_entries = { for index, arn in var.admin_principal_arns : "admin-${index}" => {
    principal_arn = arn
    policy_associations = {
      administrator = {
        policy_arn   = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
        access_scope = { type = "cluster" }
      }
    }
  } }

  tags = local.tags
}

data "aws_caller_identity" "current" {}

resource "aws_kms_key" "logs" {
  description             = "CraveDrop CloudWatch log encryption"
  enable_key_rotation     = true
  deletion_window_in_days = 30
  policy = jsonencode({ Version = "2012-10-17", Statement = [
    { Sid = "AccountAdministration", Effect = "Allow", Principal = { AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root" }, Action = "kms:*", Resource = "*" },
    { Sid    = "CloudWatchLogs", Effect = "Allow", Principal = { Service = "logs.${var.aws_region}.amazonaws.com" },
      Action = ["kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey"], Resource = "*",
    Condition = { ArnLike = { "kms:EncryptionContext:aws:logs:arn" = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:*" } } }
  ] })
}
