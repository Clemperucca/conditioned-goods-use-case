#!/bin/bash

docker-compose -p fabric-2.3 up -d tlsca.orderingservice.com
# -p = project name -d = detach: Detached mode: Run containers in the background 
sleep 5
mkdir $PWD/orderingservice/client
mkdir $PWD/orderingservice/msp
#creert de orderingservice client en msp folder.
cp $PWD/orderingservice/server/tls-ca/crypto/ca-cert.pem $PWD/orderingservice/client/tls-ca-cert.pem
#kopiert de certs van de server naar de client
export FABRIC_CA_CLIENT_HOME=$PWD/orderingservice/client
export FABRIC_CA_CLIENT_TLS_CERTFILES=$PWD/orderingservice/client/tls-ca-cert.pem
#maakt een local shell variable aan voor tls certs en home
set -x
#set -x enables a mode of the shell where all executed commands are printed to the terminal. In your case it's clearly used for debugging, which is a typical use case for set -x: printing every command as it is executed may help you to visualize the control flow of the script if it is not functioning as expected.
fabric-ca-client enroll -u https://tls-ca-admin:tls-ca-adminpw@0.0.0.0:7052 -M tls-ca/admin/msp --csr.hosts '0.0.0.0,*.orderingservice.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register -d --id.name org-ca-admin --id.secret org-ca-adminpw --id.type admin -u https://0.0.0.0:7052 -M tls-ca/admin/msp
#                                 Naam van register   de enrollment secret     typ geregistreerd     url string              dir van de MSP
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register -d --id.name orderer1 --id.secret orderer1pw --id.type orderer -u https://0.0.0.0:7052 -M tls-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register -d --id.name osn-admin --id.secret osn-adminpw --id.type client -u https://0.0.0.0:7052 -M tls-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://org-ca-admin:org-ca-adminpw@0.0.0.0:7052 -M tls-ca/orgadmin/msp --csr.hosts '0.0.0.0,*.orderingservice.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://orderer1:orderer1pw@0.0.0.0:7052 -M tls-ca/orderer1/msp --csr.hosts '0.0.0.0,*.orderingservice.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://osn-admin:osn-adminpw@0.0.0.0:7052 -M tls-ca/osnadmin/msp --csr.hosts '0.0.0.0,*.orderingservice.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

mkdir -p $PWD/orderingservice/server/org-ca/tls
mv $PWD/orderingservice/client/tls-ca/orgadmin/msp/keystore/*_sk $PWD/orderingservice/client/tls-ca/orgadmin/msp/keystore/key.pem
#                                                          private keys _sk
cp $PWD/orderingservice/client/tls-ca/orgadmin/msp/signcerts/cert.pem $PWD/orderingservice/server/org-ca/tls/
cp $PWD/orderingservice/client/tls-ca/orgadmin/msp/keystore/key.pem $PWD/orderingservice/server/org-ca/tls/
mv $PWD/orderingservice/client/tls-ca/osnadmin/msp/keystore/*_sk $PWD/orderingservice/client/tls-ca/osnadmin/msp/keystore/client-tls-key.pem
mv $PWD/orderingservice/client/tls-ca/osnadmin/msp/signcerts/cert.pem $PWD/orderingservice/client/tls-ca/osnadmin/msp/signcerts/client-tls-cert.pem

docker-compose -p fabric-2.3 up -d orgca.orderingservice.com
sleep 5

set -x
fabric-ca-client enroll -u https://org-ca-admin:org-ca-adminpw@0.0.0.0:7053 -M org-ca/admin/msp --csr.hosts '0.0.0.0,*.orderingservice.com'
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register -d --id.name orderer1 --id.secret orderer1pw --id.type orderer -u https://0.0.0.0:7053 -M org-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register -d --id.name org-admin --id.secret org-adminpw --id.type admin -u https://0.0.0.0:7053 -M org-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://org-admin:org-adminpw@0.0.0.0:7053 -M org-ca/orgadmin/msp --csr.hosts '0.0.0.0,*.orderingservice.com'
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://orderer1:orderer1pw@0.0.0.0:7053 -M org-ca/orderer1/msp --csr.hosts '0.0.0.0,*.orderingservice.com'
{ set +x; } 2>/dev/null


mkdir $PWD/orderingservice/msp/tlscacerts
mkdir $PWD/orderingservice/msp/cacerts
cp $PWD/orderingservice/client/tls-ca-cert.pem $PWD/orderingservice/msp/tlscacerts/
cp $PWD/orderingservice/client/org-ca/orgadmin/msp/cacerts/0-0-0-0-7053.pem $PWD/orderingservice/msp/cacerts/
cp $PWD/config.yaml $PWD/orderingservice/msp

mv $PWD/orderingservice/client/tls-ca/orderer1/msp/keystore/*_sk $PWD/orderingservice/client/tls-ca/orderer1/msp/keystore/key.pem
mv $PWD/orderingservice/client/org-ca/orderer1/msp/keystore/*_sk $PWD/orderingservice/client/org-ca/orderer1/msp/keystore/key.pem

mkdir -p $PWD/orderingservice/orderer1/tls
mkdir $PWD/orderingservice/orderer1/adminclient
mkdir $PWD/orderingservice/orderer1/localMsp
cp $PWD/orderingservice/client/tls-ca/orderer1/msp/signcerts/cert.pem $PWD/orderingservice/orderer1/tls/
cp $PWD/orderingservice/client/tls-ca/orderer1/msp/keystore/key.pem $PWD/orderingservice/orderer1/tls/
cp $PWD/orderingservice/client/tls-ca-cert.pem $PWD/orderingservice/orderer1/tls/tls-ca-cert.pem
cp $PWD/orderingservice/client/tls-ca/osnadmin/msp/signcerts/client-tls-cert.pem $PWD/orderingservice/orderer1/adminclient/
cp $PWD/orderingservice/client/tls-ca/osnadmin/msp/keystore/client-tls-key.pem $PWD/orderingservice/orderer1/adminclient/
cp -r $PWD/orderingservice/client/org-ca/orderer1/msp/* $PWD/orderingservice/orderer1/localMsp/
cp $PWD/config.yaml $PWD/orderingservice/orderer1/localMsp
cp $PWD/orderer.yaml $PWD/orderingservice/orderer1/
# config.yaml en orderer worden later er naar gekopiert

docker-compose -p fabric-2.3 up -d orderer1.orderingservice.com

