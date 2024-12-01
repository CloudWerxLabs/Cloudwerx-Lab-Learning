# Linux Guide

## Introduction
Linux is a free and open-source operating system kernel. This guide covers essential commands, system administration, and best practices for Linux usage.

## Basic Commands

### File System Navigation
```bash
pwd         # Print working directory
ls          # List directory contents
ls -la      # List detailed contents including hidden files
cd /path    # Change directory
cd ..       # Go up one directory
cd ~        # Go to home directory
```

### File Operations
```bash
touch file.txt      # Create empty file
mkdir directory     # Create directory
cp source dest      # Copy file/directory
mv source dest      # Move/rename file/directory
rm file            # Remove file
rm -r directory    # Remove directory recursively
```

### File Viewing and Editing
```bash
cat file.txt       # Display file contents
less file.txt      # View file with pagination
head file.txt      # View first 10 lines
tail file.txt      # View last 10 lines
nano file.txt      # Edit with nano
vim file.txt       # Edit with vim
```

### File Permissions
```bash
chmod 755 file     # Change file permissions
chown user file    # Change file owner
chgrp group file   # Change file group
```

## System Administration

### User Management
```bash
useradd username   # Create new user
passwd username    # Set user password
usermod -aG group user  # Add user to group
userdel username   # Delete user
```

### Package Management (Debian/Ubuntu)
```bash
apt update         # Update package list
apt upgrade        # Upgrade installed packages
apt install pkg    # Install package
apt remove pkg     # Remove package
apt search pkg     # Search for package
```

### Package Management (Red Hat/CentOS)
```bash
yum update        # Update package list
yum upgrade       # Upgrade installed packages
yum install pkg   # Install package
yum remove pkg    # Remove package
yum search pkg    # Search for package
```

### System Information
```bash
uname -a          # System information
df -h             # Disk usage
free -h           # Memory usage
top               # Process information
htop              # Interactive process viewer
```

## Network Management

### Network Commands
```bash
ifconfig          # Network interface configuration
ip addr           # IP address information
netstat -tuln     # List open ports
ss -tuln          # Socket statistics
ping host         # Test connectivity
traceroute host   # Trace packet route
```

### SSH
```bash
ssh user@host     # Connect to remote host
scp file user@host:path  # Copy file to remote host
ssh-keygen        # Generate SSH key pair
ssh-copy-id user@host    # Copy SSH key to remote host
```

## Process Management

### Process Commands
```bash
ps aux            # List all processes
kill PID          # Kill process by ID
killall process   # Kill process by name
bg               # Send process to background
fg               # Bring process to foreground
nohup command &   # Run command immune to hangups
```

## File System Management

### Disk Operations
```bash
fdisk -l          # List disk partitions
mount device path # Mount filesystem
umount path       # Unmount filesystem
df -h             # Show disk space usage
du -sh directory  # Show directory size
```

### File Search
```bash
find / -name file    # Find file by name
locate file         # Find file using database
grep pattern file   # Search for pattern in file
grep -r pattern dir # Search recursively
```

## System Services

### Systemd
```bash
systemctl start service    # Start service
systemctl stop service     # Stop service
systemctl restart service  # Restart service
systemctl status service   # Check service status
systemctl enable service   # Enable service at boot
```

## Shell Scripting

### Basic Script Structure
```bash
#!/bin/bash

# Variables
NAME="User"
echo "Hello, $NAME"

# Conditionals
if [ "$1" == "test" ]; then
    echo "Test mode"
else
    echo "Normal mode"
fi

# Loops
for i in {1..5}; do
    echo "Number: $i"
done

# Functions
function greet() {
    echo "Hello, $1"
}
```

## Security

### Firewall (UFW)
```bash
ufw enable         # Enable firewall
ufw disable        # Disable firewall
ufw allow 22       # Allow SSH port
ufw deny 80        # Deny HTTP port
ufw status         # Check firewall status
```

### System Logs
```bash
tail -f /var/log/syslog    # View system logs
journalctl                  # View systemd logs
last                       # View login history
who                        # Show who is logged in
```

## Performance Monitoring

### System Monitoring
```bash
top               # Process viewer
htop              # Interactive process viewer
iotop             # I/O monitor
vmstat            # Virtual memory stats
iostat            # I/O statistics
```

## Best Practices

### Security
1. Regular system updates
2. Strong password policy
3. Minimal required permissions
4. Regular backup strategy
5. Firewall configuration

### Performance
1. Regular monitoring
2. Resource optimization
3. Log rotation
4. Disk space management
5. Service optimization

### Maintenance
1. Regular updates
2. Log monitoring
3. Backup verification
4. Security audits
5. Performance tuning

## Additional Resources

### Documentation
- Man pages (`man command`)
- Info pages (`info command`)
- Online documentation
- Distribution wikis

### Tools
1. Screen/tmux
2. Vim/Emacs
3. Git
4. Docker
5. Shell scripting

### Learning Resources
1. Linux Documentation Project
2. Distribution documentation
3. Online tutorials
4. Community forums
5. Books and guides
