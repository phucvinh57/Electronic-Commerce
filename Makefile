bootstrap:
	docker-compose up -d --build;
	yarn install;
	yarn prisma:gen;

update:
	make clean;
	make bootstrap

refresh:
	docker-compose down --volumes --remove-orphans;
	docker-compose up -d --build;

clean:
	docker-compose down --volumes --remove-orphans;