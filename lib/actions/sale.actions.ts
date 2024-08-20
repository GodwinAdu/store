"use server"

import { currentProfile } from "../helpers/current-user";
import { generateUniqueInvoiceValue } from "../helpers/generate-invoice";
import Account from "../models/account.models";
import History from "../models/history.models";
import Sale from "../models/sales.models";
import { connectToDB } from "../mongoose";
import { startOfDay, endOfDay } from 'date-fns';
import { calculateQuantity } from "../utils";
import Product from "../models/product.models";
import { getUserDetails } from "../user-details";

interface SaleProps {
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

export async function createSale(values: SaleProps) {
    try {
        const {
            accountId,
            customer,
            billingAddress,
            shippingAddress,
            description = "",
            totalAmount,
            paymentMethod,
            taxes,
            shippingCharge,
            discount,
            products,
        } = values;

        console.log(products, "products:");

        // Fetch the current user profile
        const user = await currentProfile();
        if (!user) throw new Error("User not found");

        // Connect to the database
        await connectToDB();

        // Fetch the account and validate existence
        const account = await Account.findById(accountId).exec();
        if (!account) throw new Error("Account not found");

        // Iterate through each product in the sale
        for (const product of products) {
            const dbProduct = await Product.findById(product.productId).exec();
            if (!dbProduct) throw new Error(`Product with ID ${product.productId} not found`);

            const totalProductQuantity = calculateQuantity(dbProduct.prices);

            // Validate product quantity
            if (product.quantity > totalProductQuantity) {
                throw new Error(`Insufficient quantity for product ID ${product.productId}. Available: ${totalProductQuantity}, Requested: ${product.quantity}`);
            }

            // Deduct the product quantity from stock
            const priceObj = dbProduct.prices.find((price) => price.name === product.unit);
            if (!priceObj) throw new Error(`Price unit "${product.unit}" not found for product ID ${product.productId}`);

            const availableStock = priceObj.quantityPerUnit * priceObj.stock;
            const requiredStock = priceObj.quantityPerUnit * product.quantity;

            if (requiredStock > availableStock) {
                throw new Error(`Insufficient stock for product ID ${product.productId}. Available: ${availableStock}, Requested: ${requiredStock}`);
            }

            // Deduct the stock
            priceObj.stock -= product.quantity;

            // Save the updated product
            await dbProduct.save();
        }

        // Create the sale
        const sale = new Sale({
            customer,
            billingAddress,
            shippingAddress,
            description,
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

        const savedSale = await sale.save();

        // Update the account with the new sale
        account.deposits.push(savedSale._id);
        account.balance += totalAmount;
        await account.save();

        // Record the action in history
        await History.create({
            action: "Sale created",
            user: user._id,
            details: await getUserDetails(),
        });

    } catch (error) {
        console.error("Error creating sale:", error);
        throw error;
    }
}



export async function fetchAllSales() {
    try {
        await connectToDB();
        const sales = await Sale.find({})
            .populate("createdBy", "username")

        if (sales.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(sales));

    } catch (error) {
        console.log("Error fetching all sales ", error)
        throw error
    }
}


export async function fetchPosTransaction() {
    try {
        await connectToDB();

        // Define the start and end of today
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        console.log('Today Start:', todayStart);
        console.log('Today End:', todayEnd);

        // Fetch sales for today
        const todaySales = await Sale.find({
            createdAt: { $gte: todayStart, $lt: todayEnd },
        }).populate('createdBy', 'username').exec();

        console.log('Sales found:', todaySales);

        if (todaySales.length === 0) {
            return [];
        }

        return JSON.parse(JSON.stringify(todaySales));

    } catch (error) {
        console.error('Error fetching today\'s sales:', error);
        throw error;
    }
};


export async function updateSalesSuspend(id: string) {
    try {
        await connectToDB();
        const sale = await Sale.findByIdAndUpdate(id, { $set: { status: 'Suspended' } }, { new: true }).exec();

        if (!sale) {
            throw new Error("Sale not found");
        }

        const account = await Account.findById(sale.accountId);
        if (!account) {
            throw new Error("Account not found");
        }
        account.balance -= sale.totalAmount;

        await account.save()

        return JSON.parse(JSON.stringify(sale));

    } catch (error) {
        console.log("Error suspending sale ", error)
        throw error
    }
}

export async function updateSalesReturn(id: string) {
    try {
        await connectToDB();
        const sale = await Sale.findByIdAndUpdate(id, { $set: { status: 'Returned' } }, { new: true }).exec();

        if (!sale) {
            throw new Error("Sale not found");
        }
        const account = await Account.findById(sale.accountId);
        if (!account) {
            throw new Error("Account not found");
        }
        account.balance -= sale.totalAmount;

        await account.save()

        return JSON.parse(JSON.stringify(sale));

    } catch (error) {
        console.log("Error returning sale ", error)
        throw error
    }
}

export async function deleteSale(id: string) {
    try {
        await connectToDB();
        await Sale.findByIdAndDelete(id).exec();

    } catch (error) {
        console.log("Error deleting sale ", error)
        throw error
    }
}