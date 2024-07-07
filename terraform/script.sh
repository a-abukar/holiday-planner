#!/bin/bash

# Redirect all output to both a file and the console for debugging
exec > >(tee -a /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

# Create a script that contains your commands
cat << 'EOF' > /home/ubuntu/setup-script.sh
#!/bin/bash

# Log output to a file for debugging
exec > >(tee -a /var/log/setup-script.log | logger -t setup-script -s 2>/dev/console) 2>&1

set -e

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $@"
}

# Update the package repository
log "Updating package repository"
sudo apt-get update -y

# Install Docker
log "Installing Docker"
sudo apt-get install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add the ubuntu user to the docker group
log "Adding ubuntu user to the docker group"
sudo usermod -aG docker ubuntu

# Install dependencies for AWS CLI
log "Installing dependencies for AWS CLI"
sudo apt-get install -y unzip curl

# Download and install AWS CLI v2
log "Downloading and installing AWS CLI v2"
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install and start the SSM agent
log "Installing and starting SSM agent"
sudo snap install amazon-ssm-agent --classic
sudo systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service
sudo systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service

# Log into ECR
log "Logging into ECR"
aws ecr get-login-password --region eu-west-2 | sudo docker login --username AWS --password-stdin 665727140634.dkr.ecr.eu-west-2.amazonaws.com

# Pull Docker image
log "Pulling Docker image"
sudo docker pull 665727140634.dkr.ecr.eu-west-2.amazonaws.com/holiday-planner:latest

# Run Docker container
log "Running Docker container"
sudo docker run -d -p 9000:9000 665727140634.dkr.ecr.eu-west-2.amazonaws.com/holiday-planner:latest

log "Setup script completed"
EOF

# Make the script executable
chmod +x /home/ubuntu/setup-script.sh

# Schedule the script to run on the next boot
sudo crontab -l > mycron
echo "@reboot /home/ubuntu/setup-script.sh" >> mycron
sudo crontab mycron
rm mycron

# Reboot the instance to apply Docker group changes
sudo reboot
