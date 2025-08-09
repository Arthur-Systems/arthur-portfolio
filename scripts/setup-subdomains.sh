#!/bin/bash

# Setup local subdomains for development
echo "Setting up local subdomains..."

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    HOSTS_FILE="/etc/hosts"
else
    HOSTS_FILE="/etc/hosts"
fi

# Check if entries already exist
if grep -q "photo.localhost" $HOSTS_FILE; then
    echo "Subdomain entries already exist in $HOSTS_FILE"
else
    echo "Adding subdomain entries to $HOSTS_FILE..."
    echo "" | sudo tee -a $HOSTS_FILE
    echo "# Local subdomains for development" | sudo tee -a $HOSTS_FILE
    echo "127.0.0.1 photo.localhost" | sudo tee -a $HOSTS_FILE
    echo "127.0.0.1 video.localhost" | sudo tee -a $HOSTS_FILE
    echo "127.0.0.1 tech.localhost" | sudo tee -a $HOSTS_FILE
    echo "Subdomain entries added successfully!"
fi

echo ""
echo "You can now access your subdomains at:"
echo "  📸 Photography: http://photo.localhost:3000"
echo "  🎬 Video: http://video.localhost:3000"
echo "  💻 Technology: http://tech.localhost:3000"
echo ""
echo "Make sure your development server is running with: npm run dev" 