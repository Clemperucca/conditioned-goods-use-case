#!/bin/bash

yes | sudo apt update
yes | sudo apt upgrade
yes | sudo apt install git
yes | sudo apt install curl
yes | sudo apt install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
u="$USER"
sudo usermod -a -G docker $u
sudo curl -sSL https://bit.ly/2ysbOFE | bash -s -- -d -s
export PATH=$PWD/bin:$PATH
git clone https://github.com/anilhelvaci/fabric-2.3-example.git
chmod 755 ./fabric-2.3-example/


