"use server"

import { currentProfile } from "../helpers/current-user";
import { generateUniqueInvoiceValue } from "../helpers/generate-invoice";
import History from "../models/history.models";
import Order from "../models/order.models";
import { connectToDB } from "../mongoose";
import { getUserDetails } from "../utils";


interface OrderProps {
    accountId: string;
    customer: string;
    billingAddress: string;
    shippingAddress: string;
    description?: string;
    totalAmount: number;
    paymentMethod: string;
    taxes: number;
    shippingCharge: number;
    discount: number;
    products: { productId: string, unit: string, quantity: number, price: number }[];
}
export async function createOrder(values: OrderProps) {
    try {
        const {
            accountId,
            customer,
            billingAddress,
            shippingAddress,
            description,
            totalAmount,
            paymentMethod,
            taxes,
            shippingCharge,
            discount,
            products,
        } = values;
        console.log(products, "product")

        const user = await currentProfile();

        await connectToDB();

        const order = new Order({
            customer,
            billingAddress,
            shippingAddress,
            description: description ?? "",
            accountId,
            totalAmount,
            paymentMethod,
            taxes,
            shippingCharge,
            discount,
            products,
            createdBy: user._id,
            invoiceNo: generateUniqueInvoiceValue(),
        });
        const history = new History({
            action: "Order created",
            user: user._id,
            details: await getUserDetails(),
        })

        await Promise.all([
            order.save(),
            history.save(),
        ])

    } catch (error) {
        console.log("Error creating order", error)
        throw error
    }
}


export async function fetchAllOrders() {
    try {
        await connectToDB();
        const orders = await Order.find({})
            .populate("createdBy", "username")

        if (orders.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(orders));

    } catch (error) {
        console.log("Error fetching all orders ", error)
        throw error
    }
}
