bootstrap:
	docker-compose up -d;
	yarn install;
	yarn prisma:generate;

update:
	docker-compose down --volumes --remove-orphans;
	make bootstrap