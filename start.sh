#!/usr/bin/env sh

set -e

BUILD=${BUILD:-0}
DEV=${DEV:-0}

PROJECT_NAME='calculator'
COMPOSE_FILE='docker-compose.yml'

echo "=====
STARTING: local
====="
docker network create public || true

docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE kill
docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE rm -f
docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE pull

if [ $BUILD = 1 ]
then
    docker-compose --project-name "$PROJECT_NAME" -f $COMPOSE_FILE build --no-cache
fi

docker-compose --project-name $PROJECT_NAME -f $COMPOSE_FILE up
