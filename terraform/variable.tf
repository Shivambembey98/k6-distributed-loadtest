variable "aws_region" {
  default = "ap-south-1"
}

variable "instance_type" {
  default = "c5.4xlarge"
}

variable "key_name" {
  default = "load_test"
}

variable "ami_id" {
  default = "ami-01b2a6b77ed7c26ce"
}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of VPC security group IDs"
  default     = ["sg-055bef90bd270c38a"]
}

variable "subnet_id" {
  default = "subnet-0ef6c765988deee0c"
}

variable "slave_count" {
  default = 1
}
