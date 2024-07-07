variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-west-2"
}

variable "vpc_id" {
  description = "The VPC ID where the EC2 instance will be deployed"
  type        = string
}

variable "subnet_id" {
  description = "The Subnet ID where the EC2 instance will be deployed"
  type        = string
}
