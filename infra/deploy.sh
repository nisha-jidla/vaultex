#!/bin/bash
set -e

echo "🚀 Deploying Vaultex to AWS..."

# ── Check prerequisites ────────────────────────────────────────
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform not installed. Get it from https://terraform.io/downloads"; exit 1; }
command -v aws       >/dev/null 2>&1 || { echo "❌ AWS CLI not installed."; exit 1; }

# ── Check AWS credentials ──────────────────────────────────────
aws sts get-caller-identity > /dev/null 2>&1 || { echo "❌ AWS credentials not configured. Run: aws configure"; exit 1; }
echo "✅ AWS credentials OK"

# ── Generate SSH key if not exists ────────────────────────────
if [ ! -f ~/.ssh/vaultex ]; then
    echo "🔑 Generating SSH key..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/vaultex -N ""
    echo "✅ SSH key created at ~/.ssh/vaultex"
fi

# ── Copy tfvars if not exists ─────────────────────────────────
if [ ! -f terraform.tfvars ]; then
    cp terraform.tfvars.example terraform.tfvars
    echo "⚠️  Please edit terraform.tfvars with your app repo URL"
    echo "    Then run this script again."
    exit 0
fi

# ── Terraform init ─────────────────────────────────────────────
echo "📦 Initialising Terraform..."
terraform init

# ── Terraform plan ─────────────────────────────────────────────
echo "📋 Planning deployment..."
terraform plan -out=vaultex.tfplan

# ── Terraform apply ────────────────────────────────────────────
echo "🏗️  Applying infrastructure..."
terraform apply vaultex.tfplan

# ── Output results ─────────────────────────────────────────────
echo ""
echo "✅ Deployment complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
terraform output
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Wait 3-5 minutes for Docker to start on the server"
echo "🌍 Then open the app_url in your browser"
