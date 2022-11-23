import { PaymentMethod } from "@tsed/prisma";
import { Enum, Min, Name, Nullable, Required } from "@tsed/schema";

export class CreateOrderDto {
    @Required()
    address: string;

    @Required()
    phone: string;

    @Required()
    @Enum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @Required()
    @Name("order_code_ghn")
    orderCodeGHN: string;

    @Required()
    @Min(0)
    @Name("ship_cost")
    shippingFee: number;

    @Nullable(String)
    favourCode?: string | null;
}
