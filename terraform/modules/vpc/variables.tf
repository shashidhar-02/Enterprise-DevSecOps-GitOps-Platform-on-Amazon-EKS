variable "name" {
  type = string
}

variable "cidr_block" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
