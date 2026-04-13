#!/bin/bash
set -e

echo "🚀 Starting Vaultex deployment..."

# ── Update system ──────────────────────────────────────────────
apt-get update -y
apt-get upgrade -y

# ── Install Docker ─────────────────────────────────────────────
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    unzip

# Add Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Add Docker repo
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# ── Start Docker ───────────────────────────────────────────────
systemctl start docker
systemctl enable docker

# ── Install Docker Compose standalone ─────────────────────────
curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 \
    -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# ── Add ubuntu user to docker group ───────────────────────────
usermod -aG docker ubuntu

# ── Clone Vaultex repo ─────────────────────────────────────────
cd /home/ubuntu
git clone ${app_repo} vaultex || echo "Repo clone failed - deploy manually"

if [ -d "vaultex" ]; then
    cd vaultex
    # Start all services
    docker-compose up -d --build
    echo "✅ Vaultex deployed successfully!"
else
    echo "⚠️  Repo not found. SSH in and deploy manually."
fi

echo "✅ Server setup complete!"
echo "📌 Run: docker-compose up -d from /home/ubuntu/vaultex"
