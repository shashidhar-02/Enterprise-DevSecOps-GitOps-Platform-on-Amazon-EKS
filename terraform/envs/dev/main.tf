module "vpc" {
  source     = "../../modules/vpc"
  name       = "cloudmart-dev-vpc"
  cidr_block = "10.10.0.0/16"
}
