"use server"

import Account from "../models/account.models";
import Sale from "../models/sales.models";
import { connectToDB } from "../mongoose";


export async function calculateSalesForMonth(){
    try {
        await connectToDB();

        // Assuming sales are stored in a collection named "sales"
        const sales = await Sale.find({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            }
        });

        const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        return totalSales;

    } catch (error) {
        console.log("Error calculating sales for month:", error);
        throw error;
    }
}


export async function calculateSalesWithoutThisMonth(){
    try {
        await connectToDB();

        // Assuming sales are stored in a collection named "sales"
        const sales = await Sale.find({
            createdAt: {
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
        });

        const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

        return totalSales;

    } catch (error) {
        console.log("Error calculating sales without this month:", error);
        throw error;
    }
}


export async function calculateTotalRevenue(){
    try {
        await connectToDB();

        // Assuming sales are stored in a collection named "sales"
        const account = await Account.find({});

        const totalRevenue = account.reduce((acc, balance) => acc + balance.balance, 0);

        return totalRevenue;

    } catch (error) {
        console.log("Error calculating total revenue:", error);
        throw error;
    }
}