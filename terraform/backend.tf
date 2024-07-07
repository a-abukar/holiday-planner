terraform {
  backend "s3" {
    bucket         = "my-holiday-planner-state"
    key            = "terraform/state"
    region         = "eu-west-2"
  }
}
