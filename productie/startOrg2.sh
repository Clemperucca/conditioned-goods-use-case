#!/bin/bash

docker-compose -p fabric-2.3 up -d tlsca.DLG.com
sleep 5

mkdir $PWD/DLG/client
mkdir $PWD/DLG/msp
cp $PWD/DLG/server/tls-ca/crypto/ca-cert.pem $PWD/DLG/client/tls-ca-cert.pem

export FABRIC_CA_CLIENT_HOME=$PWD/DLG/client
export FABRIC_CA_CLIENT_TLS_CERTFILES=$PWD/DLG/client/tls-ca-cert.pem

set -x
fabric-ca-client enroll -u https://tls-ca-admin:tls-ca-adminpw@0.0.0.0:9052 -M tls-ca/admin/msp --csr.hosts '0.0.0.0,*.DLG.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name org-ca-admin --id.secret org-ca-adminpw --id.type admin -u https://0.0.0.0:9052 -M tls-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name peer1 --id.secret peer1pw --id.type peer -u https://0.0.0.0:9052 -M tls-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://org-ca-admin:org-ca-adminpw@0.0.0.0:9052 -M tls-ca/orgadmin/msp --csr.hosts '0.0.0.0,*.DLG.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://peer1:peer1pw@0.0.0.0:9052 -M tls-ca/peer1/msp --csr.hosts '0.0.0.0,*.DLG.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

mkdir -p $PWD/DLG/server/org-ca/tls
mv $PWD/DLG/client/tls-ca/orgadmin/msp/keystore/*_sk $PWD/DLG/client/tls-ca/orgadmin/msp/keystore/key.pem
cp $PWD/DLG/client/tls-ca/orgadmin/msp/signcerts/cert.pem $PWD/DLG/server/org-ca/tls/
cp $PWD/DLG/client/tls-ca/orgadmin/msp/keystore/key.pem $PWD/DLG/server/org-ca/tls/

docker-compose -p fabric-2.3 up -d orgca.DLG.com
sleep 5

set -x
fabric-ca-client enroll -u https://org-ca-admin:org-ca-adminpw@0.0.0.0:9053 -M org-ca/admin/msp --csr.hosts '0.0.0.0,*.DLG.com'
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name peer1 --id.secret peer1pw --id.type peer -u https://0.0.0.0:9053 -M org-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name org-admin --id.secret org-adminpw --id.type admin -u https://0.0.0.0:9053 -M org-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://org-admin:org-adminpw@0.0.0.0:9053 -M org-ca/orgadmin/msp --csr.hosts '0.0.0.0,*.DLG.com'
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://peer1:peer1pw@0.0.0.0:9053 -M org-ca/peer1/msp --csr.hosts '0.0.0.0,*.DLG.com'
{ set +x; } 2>/dev/null

mkdir $PWD/DLG/msp/tlscacerts
mkdir $PWD/DLG/msp/cacerts
cp $PWD/DLG/client/tls-ca-cert.pem $PWD/DLG/msp/tlscacerts/
cp $PWD/DLG/client/org-ca/peer1/msp/cacerts/0-0-0-0-9053.pem $PWD/DLG/msp/cacerts/
cp $PWD/config.yaml $PWD/DLG/msp
mv $PWD/DLG/client/tls-ca/peer1/msp/keystore/*_sk $PWD/DLG/client/tls-ca/peer1/msp/keystore/key.pem
mv $PWD/DLG/client/org-ca/peer1/msp/keystore/*_sk $PWD/DLG/client/org-ca/peer1/msp/keystore/key.pem
mkdir -p $PWD/DLG/peer1/tls

cp $PWD/DLG/client/tls-ca-cert.pem $PWD/DLG/peer1/tls/tls-ca-cert.pem
mkdir $PWD/DLG/peer1/localMsp
cp -r $PWD/DLG/client/org-ca/peer1/msp/* $PWD/DLG/peer1/localMsp/
cp $PWD/config.yaml $PWD/DLG/peer1/localMsp
cp $PWD/DLG/client/tls-ca/peer1/msp/signcerts/cert.pem $PWD/DLG/peer1/tls/DLG-peer1-tls-cert.pem
cp $PWD/DLG/client/tls-ca/peer1/msp/keystore/key.pem $PWD/DLG/peer1/tls/DLG-peer1-tls-key.pem

docker-compose -p fabric-2.3 up -d peer1.DLG.com
docker-compose -p fabric-2.3 up -d cli.peer1.DLG.com
