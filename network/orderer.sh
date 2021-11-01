#!/bin/bash
GLOBAL_ENV_LOCATION=$PWD/.env
source $GLOBAL_ENV_LOCATION

set -ev

# ORG 3
docker stack deploy -c "$ORDERER2_COMPOSE_PATH" hlf_orderer
