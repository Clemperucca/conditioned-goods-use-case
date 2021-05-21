#!/bin/bash

yes | sudo apt update
yes | sudo apt upgrade
yes | sudo apt install git
yes | sudo apt install curl
yes | sudo apt install nodejs
yes | sudo apt install npm
yes | sudo apt install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
u="$USER"
sudo usermod -a -G docker $u

docker pull hyperledger/fabric-tools:2.3
docker pull hyperledger/fabric-orderer:2.3
docker pull hyperledger/fabric-peer:2.3
docker pull hyperledger/fabric-javaenv:2.3
docker pull hyperledger/fabric-ccenv:2.3
docker pull hyperledger/fabric-ca
docker pull hyperledger/fabric-couchdb

docker tag Hyperledger/fabric-tools:2.3 hyperledger/fabric-tools:latest
docker tag Hyperledger/fabric-orderer:2.3 hyperledger/fabric-orderer:latest
docker tag Hyperledger/fabric-peer:2.3 hyperledger/fabric-peer:latest
docker tag Hyperledger/fabric-javaenv:2.3 hyperledger/fabric-javaenv:latest
docker tag Hyperledger/fabric-ccenv:2.3 hyperledger/fabric-ccenv:latest





