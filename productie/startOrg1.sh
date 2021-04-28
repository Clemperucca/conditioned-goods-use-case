#!/bin/bash

docker-compose -p fabric-2.3 up -d tlsca.Lambweston.com
sleep 5

mkdir $PWD/Lambweston/client
mkdir $PWD/Lambweston/msp
cp $PWD/Lambweston/server/tls-ca/crypto/ca-cert.pem $PWD/Lambweston/client/tls-ca-cert.pem

export FABRIC_CA_CLIENT_HOME=$PWD/Lambweston/client
export FABRIC_CA_CLIENT_TLS_CERTFILES=$PWD/Lambweston/client/tls-ca-cert.pem

set -x
fabric-ca-client enroll -u https://tls-ca-admin:tls-ca-adminpw@0.0.0.0:8052 -M tls-ca/admin/msp --csr.hosts '0.0.0.0,*.Lambweston.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name org-ca-admin --id.secret org-ca-adminpw --id.type admin -u https://0.0.0.0:8052 -M tls-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name peer1 --id.secret peer1pw --id.type peer -u https://0.0.0.0:8052 -M tls-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://org-ca-admin:org-ca-adminpw@0.0.0.0:8052 -M tls-ca/orgadmin/msp --csr.hosts '0.0.0.0,*.Lambweston.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://peer1:peer1pw@0.0.0.0:8052 -M tls-ca/peer1/msp --csr.hosts '0.0.0.0,*.Lambweston.com' --enrollment.profile tls
{ set +x; } 2>/dev/null

mkdir -p $PWD/Lambweston/server/org-ca/tls
mv $PWD/Lambweston/client/tls-ca/orgadmin/msp/keystore/*_sk $PWD/Lambweston/client/tls-ca/orgadmin/msp/keystore/key.pem
cp $PWD/Lambweston/client/tls-ca/orgadmin/msp/signcerts/cert.pem $PWD/Lambweston/server/org-ca/tls/
cp $PWD/Lambweston/client/tls-ca/orgadmin/msp/keystore/key.pem $PWD/Lambweston/server/org-ca/tls/

docker-compose -p fabric-2.3 up -d orgca.Lambweston.com
sleep 5

set -x
fabric-ca-client enroll -u https://org-ca-admin:org-ca-adminpw@0.0.0.0:8053 -M org-ca/admin/msp --csr.hosts '0.0.0.0,*.Lambweston.com'
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name peer1 --id.secret peer1pw --id.type peer -u https://0.0.0.0:8053 -M org-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client register --id.name org-admin --id.secret org-adminpw --id.type admin -u https://0.0.0.0:8053 -M org-ca/admin/msp
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://org-admin:org-adminpw@0.0.0.0:8053 -M org-ca/orgadmin/msp --csr.hosts '0.0.0.0,*.Lambweston.com'
{ set +x; } 2>/dev/null

set -x
fabric-ca-client enroll -u https://peer1:peer1pw@0.0.0.0:8053 -M org-ca/peer1/msp --csr.hosts '0.0.0.0,*.Lambweston.com'
{ set +x; } 2>/dev/null

mkdir $PWD/Lambweston/msp/tlscacerts
mkdir $PWD/Lambweston/msp/cacerts
cp $PWD/Lambweston/client/tls-ca-cert.pem $PWD/Lambweston/msp/tlscacerts/
cp $PWD/config.yaml $PWD/Lambweston/msp/
cp $PWD/Lambweston/client/org-ca/peer1/msp/cacerts/0-0-0-0-8053.pem $PWD/Lambweston/msp/cacerts/
mv $PWD/Lambweston/client/tls-ca/peer1/msp/keystore/*_sk $PWD/Lambweston/client/tls-ca/peer1/msp/keystore/key.pem
mv $PWD/Lambweston/client/org-ca/peer1/msp/keystore/*_sk $PWD/Lambweston/client/org-ca/peer1/msp/keystore/key.pem
mkdir -p $PWD/Lambweston/peer1/tls

cp $PWD/Lambweston/client/tls-ca-cert.pem $PWD/Lambweston/peer1/tls/tls-ca-cert.pem
mkdir $PWD/Lambweston/peer1/localMsp
cp -r $PWD/Lambweston/client/org-ca/peer1/msp/* $PWD/Lambweston/peer1/localMsp/
cp $PWD/config.yaml $PWD/Lambweston/peer1/localMsp
cp $PWD/Lambweston/client/tls-ca/peer1/msp/signcerts/cert.pem $PWD/Lambweston/peer1/tls/Lambweston-peer1-tls-cert.pem
cp $PWD/Lambweston/client/tls-ca/peer1/msp/keystore/key.pem $PWD/Lambweston/peer1/tls/Lambweston-peer1-tls-key.pem

docker-compose -p fabric-2.3 up -d peer1.Lambweston.com
docker-compose -p fabric-2.3 up -d cli.peer1.Lambweston.com
