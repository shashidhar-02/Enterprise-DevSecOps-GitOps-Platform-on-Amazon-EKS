# ==============================================================
# CraveDrop Infrastructure Variables
# ==============================================================

variable "aws_region" {
  description = "AWS region to deploy the EKS cluster"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Choose dev, staging or prod."
  }
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "cravedrop-eks"
}

variable "cluster_version" {
  description = "Kubernetes version for EKS"
  type        = string
  default     = "1.35"
}

variable "admin_principal_arns" {
  description = "Explicit IAM roles allowed to bootstrap and administer the cluster"
  type        = list(string)
  validation {
    condition     = length(var.admin_principal_arns) > 0 && alltrue([for arn in var.admin_principal_arns : can(regex("^arn:aws:iam::[0-9]{12}:role/.+$", arn))])
    error_message = "Provide at least one administrator IAM role ARN."
  }
}

variable "enable_public_endpoint" {
  description = "Opt in to restricted public API access; private access remains enabled"
  type        = bool
  default     = false
}

variable "public_access_cidrs" {
  description = "Trusted operator CIDRs; required when public API access is enabled"
  type        = list(string)
  default     = []
  validation {
    condition     = (!var.enable_public_endpoint || length(var.public_access_cidrs) > 0) && alltrue([for cidr in var.public_access_cidrs : can(cidrhost(cidr, 0)) && !contains(["0.0.0.0/0", "::/0"], cidr)])
    error_message = "Public access requires explicit CIDRs and cannot allow the entire internet."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}
