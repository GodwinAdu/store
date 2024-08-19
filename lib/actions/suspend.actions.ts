"use server"

import { currentProfile } from "../helpers/current-user";
import History from "../models/history.models";
import Suspend from "../models/suspend.model";
import { getUserDetails } from "../utils";


interface SuspendProps {
    products: { productId: string, unit: string, quantity: number, price: number }[];
    message?: string;

}
export async function createSuspend(values: SuspendProps) {
    try {
        const user = await currentProfile()
        const { products, message } = values;
        const newSuspend = new Suspend({
            products,
            description: message,
            createdBy: user?._id,
        });

        await newSuspend.save();
        await History.create({
            action: "Sale created",
            user: user._id,
            details: await getUserDetails(),
        });


    } catch (error) {
        console.log("Error suspending customer account:", error);
        throw error;
    }

}