bootstrap:
	docker-compose up -d --build;
	yarn install;
	yarn prisma:generate;

update:
	make clean;
	make bootstrap

clean:
	docker-compose down --volumes --remove-orphans;