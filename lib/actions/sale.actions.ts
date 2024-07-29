"use server"

import { currentProfile } from "../helpers/current-user";
import Sale from "../models/sales.models";
import { connectToDB } from "../mongoose";


export async function createSale(values: any){
    try {
        const {customer,sal}  = values;
        const user = await currentProfile()
        await connectToDB();
        const sale = new Sale(values);
        await sale.save();
    } catch (error) {
        console.log("Error creating sale ", error)
        throw error
    }

}