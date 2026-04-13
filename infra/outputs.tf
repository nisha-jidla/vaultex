output "public_ip" {
  description = "Vaultex public IP address"
  value       = aws_eip.vaultex.public_ip
}

output "public_dns" {
  description = "Vaultex public DNS"
  value       = aws_instance.vaultex.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to server"
  value       = "ssh -i ~/.ssh/vaultex ubuntu@${aws_eip.vaultex.public_ip}"
}

output "app_url" {
  description = "Vaultex app URL"
  value       = "http://${aws_eip.vaultex.public_ip}"
}

output "s3_bucket" {
  description = "S3 bucket for assets"
  value       = aws_s3_bucket.vaultex_assets.bucket
}
