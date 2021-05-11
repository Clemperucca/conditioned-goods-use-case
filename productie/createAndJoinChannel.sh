#!/bin/bash

echo "---------- Creating Friet genesis block ----------"

export FABRIC_CFG_PATH=$PWD/
configtxgen -profile SampleNew -outputBlock Friet.genesis_block.pb -channelID Friet

echo "---------- Creating and joining orderer1 to the Friet ----------"

export ORDERER_TLS_CA=$PWD/orderingservice/client/tls-ca-cert.pem
export ORDERER_ADMIN_CERT=$PWD/orderingservice/orderer1/adminclient/client-tls-cert.pem
export ORDERER_ADMIN_KEY=$PWD/orderingservice/orderer1/adminclient/client-tls-key.pem
export ORDERDER_ADMIN_ADDRESS=0.0.0.0:7051

osnadmin channel join --channelID Friet  --config-block Friet.genesis_block.pb -o $ORDERDER_ADMIN_ADDRESS --ca-file $ORDERER_TLS_CA --client-cert $ORDERER_ADMIN_CERT --client-key $ORDERER_ADMIN_KEY
sleep 3

echo "---------- Fetching the genesis block of Friet and joining peer1.Lambweston.com ----------"

export CORE_PEER_LOCALMSPID=Lambweston
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=0.0.0.0:8054
export FABRIC_CFG_PATH=$PWD
export ORDERER_TLS_CA=$PWD/orderingservice/client/tls-ca-cert.pem
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/Lambweston/client/tls-ca-cert.pem
export CORE_PEER_MSPCONFIGPATH=$PWD/Lambweston/client/org-ca/orgadmin/msp/
export CORE_PEER_TLS_ENABLED=true
export ORDERER_ADDRESS=0.0.0.0:7050

cp $PWD/config.yaml $PWD/Lambweston/client/org-ca/orgadmin/msp/
peer channel fetch oldest -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls -c Friet $PWD/Lambweston/peer1/Friet.genesis.block
peer channel join -b $PWD/Lambweston/peer1/Friet.genesis.block

echo "---------- Fetching the genesis block of Friet and joining peer1.DLG.com ----------"

export CORE_PEER_LOCALMSPID=DLG
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=0.0.0.0:9054
export FABRIC_CFG_PATH=$PWD
export ORDERER_TLS_CA=$PWD/orderingservice/client/tls-ca-cert.pem
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/DLG/client/tls-ca-cert.pem
export CORE_PEER_MSPCONFIGPATH=$PWD/DLG/client/org-ca/orgadmin/msp/
export CORE_PEER_TLS_ENABLED=true
export ORDERER_ADDRESS=0.0.0.0:7050

cp $PWD/config.yaml $PWD/DLG/client/org-ca/orgadmin/msp/
peer channel fetch oldest -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls -c Friet $PWD/DLG/peer1/Friet.genesis.block
peer channel join -b $PWD/DLG/peer1/Friet.genesis.block
