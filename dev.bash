#!/bin/bash

# Get the localhost IP address
local_ip=$(ipconfig getifaddr en0)  # Modify "en0" to your network interface if needed
echo $local_ip
# Set the environment variable
export LOCAL_IP=$local_ip

# Run your JS app in dev mode
cd packages
cd client-impl
npm start
