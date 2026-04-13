#!/bin/bash

echo "⚠️  This will DESTROY all Vaultex AWS resources!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

terraform destroy -auto-approve
echo "✅ All AWS resources destroyed."
