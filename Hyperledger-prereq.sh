#!/bin/bash

yes | sudo apt update
yes | sudo apt upgrade
yes | sudo apt install git
yes | sudo apt install nodejs
yes | sudo apt install npm
yes | sudo apt install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
u="$USER"
sudo usermod -a -G docker $u





