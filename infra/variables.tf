variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-2"  # London — closest to Scotland
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "vaultex"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"  # 2 vCPU, 4GB RAM — enough for all services
}

variable "ami_id" {
  description = "Ubuntu 22.04 LTS AMI for eu-west-2"
  type        = string
  default     = "ami-0505148b3591e4c07"  # Ubuntu 22.04 LTS London
}

variable "public_key_path" {
  description = "Path to your SSH public key"
  type        = string
  default     = "~/.ssh/vaultex.pub"
}

variable "app_repo" {
  description = "Git repo URL for Vaultex app"
  type        = string
  default     = "https://github.com/YOUR_USERNAME/vaultex.git"
}
