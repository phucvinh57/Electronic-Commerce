bootstrap:
	docker-compose up -d --build;
	yarn install;
	yarn prisma:generate;

update:
	docker-compose down --volumes --remove-orphans;
	make bootstrap

clean:
	docker-compose down --volumes --remove-orphans;