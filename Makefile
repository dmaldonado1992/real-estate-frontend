DOCKER_COMPOSE=docker compose

.PHONY: build up down logs ps clean

build:
	$(DOCKER_COMPOSE) build --parallel

up: build
	$(DOCKER_COMPOSE) up -d

down:
	$(DOCKER_COMPOSE) down

logs:
	$(DOCKER_COMPOSE) logs -f

ps:
	$(DOCKER_COMPOSE) ps

clean:
	rm -rf frontend/frontend/node_modules frontend/frontend/dist
