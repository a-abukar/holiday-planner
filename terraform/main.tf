provider "aws" {
  region = var.aws_region
}

resource "aws_iam_role" "ec2_role" {
  name = "holiday_planner_ec2_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "ec2_policy" {
  name   = "holiday_planner_ec2_policy"
  role   = aws_iam_role.ec2_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetAuthorizationToken"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_instance_profile" "ec2_instance_profile" {
  name = "holiday_planner_instance_profile"
  role = aws_iam_role.ec2_role.name
}

resource "aws_security_group" "ec2_security_group" {
  name        = "holiday-planner-ec2-sg"
  description = "Security group for Holiday Planner EC2 instance"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "holiday_planner_instance" {
  ami                    = "ami-07c1b39b7b3d2525d" # Use the correct AMI ID
  instance_type          = "t2.micro"
  associate_public_ip_address = true
  key_name               = "holiday-plan-key"

  iam_instance_profile   = aws_iam_instance_profile.ec2_instance_profile.name

  user_data = file("${path.module}/script.sh")

  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]
  subnet_id              = var.subnet_id

  tags = {
    Name = "holiday-planner-ec2"
  }
}

output "ec2_instance_id" {
  value = aws_instance.holiday_planner_instance.id
}

output "ec2_instance_public_ip" {
  value = aws_instance.holiday_planner_instance.public_ip
}