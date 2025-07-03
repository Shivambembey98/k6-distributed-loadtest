terraform {
  backend "s3" {
    bucket         = "k6-distributed"
    key            = "terraform.tfstate"
    region         = "ap-south-1"
  }
}