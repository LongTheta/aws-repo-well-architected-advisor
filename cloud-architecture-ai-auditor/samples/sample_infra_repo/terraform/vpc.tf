# VPC with multi-AZ subnets for production readiness

locals {
  common_tags = {
    Environment = "dev"
    Project     = "platform-infrastructure"
    CostCenter  = "platform"
  }
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags                 = merge(local.common_tags, { Name = "main" })
}

# Public subnets (one per AZ)
resource "aws_subnet" "public" {
  for_each = toset(["us-east-1a", "us-east-1b"])

  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.key == "us-east-1a" ? "10.0.1.0/24" : "10.0.2.0/24"
  availability_zone       = each.key
  map_public_ip_on_launch = true
  tags                    = merge(local.common_tags, { Name = "public-${each.key}" })
}

# Private subnets (one per AZ)
resource "aws_subnet" "private" {
  for_each = toset(["us-east-1a", "us-east-1b"])

  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.key == "us-east-1a" ? "10.0.11.0/24" : "10.0.12.0/24"
  availability_zone       = each.key
  map_public_ip_on_launch = false
  tags                    = merge(local.common_tags, { Name = "private-${each.key}" })
}

# Internet gateway for public subnets
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "main" })
}

# Route table for public subnets
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, { Name = "public" })

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}
