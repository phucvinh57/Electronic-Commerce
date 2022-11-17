# TMDT Assignment Backend

## Prerequisites

- yarn v1.22.19
- node v16.17.0
- docker v20.10.21
- docker-compose 1.29.2

## How to run

First, copy your `.env` file from `.env.example` template. Fill out environment variables.

For `CORS_WHITE_LIST`, you can add multiple domain name, but in case testing on local, just fill your frontend domain (such as <http://localhost:3000>).

Then, type these commands in order:

1. make bootstrap
2. yarn start

Finally, generate sample data in other terminal:

```bash
yarn seed
```

## Descriptions

All entrypoints for REST begin with `/api`. The docs of APIs is on `/docs`.

## Sign in & Sign up

- Sign in: `POST /auth/signin`

```json
{
    "formFields": [
        {
            "id": "email",
            "value": "dcmclgt@gmail.com"
        },
        {
            "id": "password",
            "value": "vinh0507"
        }
    ]
}
```

- Sign up: `POST /auth/signup`:

```json
{
    "formFields": [
        {
            "id": "email",
            "value": "dcmclgt@gmail.com"
        },
        {
            "id": "password",
            "value": "vinh0507"
        },
        {
            "id": "firstname",
            "value": "Vinh"
        },
        {
            "id": "lastname",
            "value": "Nguyen"
        }
    ]
}
```

## Implemented API for figma pages

- [x] Register - 1
- [x] Register - 2
- [x] Catalog - 1
- [x] Catalog - 2
- [x] Catalog - 4
- [x] User Account - 1
- [x] Cart - Checkout_1
- [ ] Cart - Checkout_2
- [ ] Stores (all)
