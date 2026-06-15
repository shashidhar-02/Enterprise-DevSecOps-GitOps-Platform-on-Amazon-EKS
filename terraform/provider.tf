terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # DevSecOps Best Practice: Remote State Management
  # Uncomment this when moving to a team environment or CI/CD pipeline
  # backend "s3" {
  #   bucket         = "cravedrop-terraform-state-prod"
  #   key            = "eks/terraform.tfstate"
  #   region         = "ap-south-1" 
  #   dynamodb_table = "cravedrop-tf-lock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  # These tags will automatically apply to EVERY resource created
  # This is a major plus for cost tracking in enterprise environments
  default_tags {
    tags = {
      Project     = "CraveDrop"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}