import { PaymentMethod } from "@tsed/prisma";
import { Enum, Nullable, Required } from "@tsed/schema";

export class CreateOrderDto {
    @Required()
    address: string;

    @Required()
    phone: string;

    @Required()
    @Enum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @Nullable(String)
    favourCode?: string | null;
}
