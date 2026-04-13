terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── VPC ────────────────────────────────────────────────────────
resource "aws_vpc" "vaultex" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "vaultex-vpc", Project = "vaultex" }
}

# ── Internet Gateway ───────────────────────────────────────────
resource "aws_internet_gateway" "vaultex" {
  vpc_id = aws_vpc.vaultex.id
  tags   = { Name = "vaultex-igw", Project = "vaultex" }
}

# ── Public Subnet ──────────────────────────────────────────────
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.vaultex.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = { Name = "vaultex-public-subnet", Project = "vaultex" }
}

# ── Route Table ────────────────────────────────────────────────
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vaultex.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.vaultex.id
  }

  tags = { Name = "vaultex-public-rt", Project = "vaultex" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# ── Security Group ─────────────────────────────────────────────
resource "aws_security_group" "vaultex" {
  name        = "vaultex-sg"
  description = "Vaultex application security group"
  vpc_id      = aws_vpc.vaultex.id

  # HTTP
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "vaultex-sg", Project = "vaultex" }
}

# ── Key Pair ───────────────────────────────────────────────────
resource "aws_key_pair" "vaultex" {
  key_name   = "vaultex-key"
  public_key = file(var.public_key_path)
  tags       = { Project = "vaultex" }
}

# ── EC2 Instance ───────────────────────────────────────────────
resource "aws_instance" "vaultex" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.vaultex.id]
  key_name               = aws_key_pair.vaultex.key_name

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/userdata.sh", {
    app_repo = var.app_repo
  })

  tags = { Name = "vaultex-server", Project = "vaultex" }
}

# ── Elastic IP ─────────────────────────────────────────────────
resource "aws_eip" "vaultex" {
  instance = aws_instance.vaultex.id
  domain   = "vpc"
  tags     = { Name = "vaultex-eip", Project = "vaultex" }
}

# ── S3 Bucket (product images) ─────────────────────────────────
resource "aws_s3_bucket" "vaultex_assets" {
  bucket = "${var.project_name}-assets-${random_id.bucket_suffix.hex}"
  tags   = { Name = "vaultex-assets", Project = "vaultex" }
}

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_public_access_block" "vaultex_assets" {
  bucket                  = aws_s3_bucket.vaultex_assets.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
