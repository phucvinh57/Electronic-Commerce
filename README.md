# TMDT Assignment Backend

## How to run

First, copy your `.env` file from `.env.example` template. Fill out your mongodb username, password and modify `MONGO_DATABASE_URL` (just modify `<username>` and `<password>`).

For `CORS_WHITE_LIST`, you can add multiple domain name, but in case testing on local, just fill your frontend domain.

Then, type these commands in order:

1. make bootstrap
2. yarn start

## Descriptions

All entrypoints for REST begin with `/api`. The docs of APIs is on `/docs`.
