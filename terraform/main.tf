resource "aws_instance" "k6_slaves" {
  count                  = var.slave_count
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = var.subnet_id
  vpc_security_group_ids = var.vpc_security_group_ids
  associate_public_ip_address = true

  instance_market_options {
    market_type = "spot"
    spot_options {
      spot_instance_type            = "one-time"
      instance_interruption_behavior = "terminate"
      max_price                      = "1.0"
    }
  }

  tags = {
    Name = "k6-slave-${count.index}"
  }
}

output "slave_ips" {
  value = aws_instance.k6_slaves[*].public_ip
}
