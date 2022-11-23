/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { envs } from "../config/envs";
import { Gender, PrismaClient, Product, Store } from "@prisma/client";
import { $log } from "@tsed/logger";
import axios from "axios";
import { ProductSize } from "@tsed/prisma";

function getRandValueOfEnum<T extends Record<string, unknown>>(anEnum: T): T[keyof T] {
    const enumValues = Object.keys(anEnum).map((n) => n as unknown as T[keyof T]);

    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
}

const db: PrismaClient = new PrismaClient();
const initUser = {
    email: "fanmu@gmail.com",
    password: "abcd1234",
    firstName: "Bình",
    lastName: "Thanh Cao"
};

async function generateSampleData() {
    try {
        /**
         * This method call will return 
         *  {
                "status": "OK",
                "user": {
                    "email": .... (String),
                    "id": .... (String),
                    "timeJoined": 1663581363027 (number)
                }
            }
         */
        const initUserResponse = await axios.post(
            `http://localhost:${envs.BACKEND_PORT}/auth/signup`,
            {
                formFields: [
                    {
                        id: "email",
                        value: initUser.email
                    },
                    {
                        id: "password",
                        value: initUser.password
                    },
                    {
                        id: "firstname",
                        value: initUser.firstName
                    },
                    {
                        id: "lastname",
                        value: initUser.lastName
                    }
                ]
            }
        );
        const userId: string = initUserResponse.data.user.id;
        console.log(initUserResponse.data);

        const storesData = [
            {
                name: "Fan MU",
                description: "<h3>MU in the cave</h3>",
                brandUrl:
                    "https://i2-vnexpress.vnecdn.net/2019/03/11/Untitled1-1552265719-7708-1552266254.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=65_6miw26bKfqJgB07VA6g"
            },
            {
                name: "Fan stocism",
                description: "<h3>Death smiles at us all. All a man can do is smile back.</h3>",
                brandUrl: "https://avatars.githubusercontent.com/u/69946748"
            }
        ];

        const stores: Store[] = [];
        const s1 = await db.store.create({ data: storesData[0] });
        stores.push(s1);
        const s2 = await db.store.create({ data: storesData[1] });
        stores.push(s2);
        const productData = [
            {
                name: "Rick & Morty T-shirt",
                coverImageUrl:
                    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/divhtybtltxjtyhhq2i5/tee-shirt-sportswear-club-pour-DDLtRZ.png",
                price: 14.5,
                genders: [Gender.MALE],
                description: "Markdown",
                storeId: stores[0].id
            },
            {
                name: "Sport T-shirt",
                coverImageUrl:
                    "https://img.freepik.com/premium-vector/red-blue-soccer-jersey-uniform-football-club-t-shirt-front-back-view_155717-597.jpg",
                genders: [Gender.MALE],
                price: 2.3,
                description: "Markdown",
                storeId: stores[0].id
            },
            {
                name: "Unisex T-Shirt",
                coverImageUrl: "https://cf.shopee.vn/file/d1973fb369dc54e73ec151da5e3be2f3",
                genders: [Gender.FEMALE, Gender.MALE, Gender.OTHER],
                price: 8.5,
                description: "Markdown",
                storeId: stores[1].id
            }
        ];

        await db.$connect();

        const products: Product[] = [];
        for (const data of productData) {
            const product = await db.product.create({ data });
            products.push(product);
        }

        for (const product of products) {
            await db.productType.createMany({
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                data: [1, 2, 3].map((_) => ({
                    size: getRandValueOfEnum(ProductSize),
                    color: "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"), // random hex color
                    quantity: Math.floor(Math.random() * 100) + 10,
                    productId: product.id
                }))
            });
        }

        const firstProductType = await db.productType.findFirst({
            where: { productId: products[0].id }
        });

        await db.cartItem.create({
            data: {
                userId: userId,
                quantity: Math.floor(Math.random() * 1) + 3,
                productId: products[0].id,
                color: firstProductType!.color,
                size: firstProductType!.size
            }
        });

        await db.rating.create({
            data: {
                userId: userId,
                comment: "Some reviews",
                star: Math.floor(Math.random() * 40 + 10) / 10,
                productId: products[0].id
            }
        });
    } catch (err) {
        $log.error({ event: "GENERATE_SEED_ERROR", message: err.message, stack: err.stack });
    }
    await db.$disconnect();
    process.exit(0);
}

generateSampleData();
