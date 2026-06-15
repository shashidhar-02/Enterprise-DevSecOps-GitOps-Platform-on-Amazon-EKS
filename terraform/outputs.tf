# ==============================================================
# CraveDrop EKS Cluster - Outputs
# ==============================================================

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_certificate_authority" {
  description = "EKS cluster CA certificate (base64)"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

# Added: Crucial for setting up IAM Roles for Service Accounts (IRSA) later
output "oidc_provider_arn" {
  description = "The ARN of the OIDC Provider for the EKS cluster"
  value       = module.eks.oidc_provider_arn
}

output "vpc_id" {
  description = "VPC ID where the cluster is deployed"
  value       = module.vpc.vpc_id
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}

# Added: Helpful if you need to attach external databases or VPNs to the cluster
output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

# ==============================================================
# Helper Commands
# ==============================================================
# After successful 'terraform apply', run this command to configure your local kubeconfig:
# aws eks update-kubeconfig --region $(terraform output -raw region) --name $(terraform output -raw cluster_name)