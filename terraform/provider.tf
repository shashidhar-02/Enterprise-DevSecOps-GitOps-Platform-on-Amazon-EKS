terraform {
  required_version = ">= 1.13.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.100.0"
    }
  }

  backend "s3" {}
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
