"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.models";
import { connectToDB } from "../mongoose";

interface ProductProps {
    name: string;
    brandId: string;
    categoryId: string;
    expiryDate?: Date | undefined;
    barcode: string;
    sku: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    color?: string[] | undefined;
    size?: string[] | undefined;
    cost?: number | undefined;
    quantity: number;
    prices: { unitId: string; price: number }[];
    taxes?: { name: string; amount: number }[] | undefined;

}
export async function createProduct(values: ProductProps, path: string) {
    try {
        const { name, brandId, categoryId, expiryDate, barcode, sku, description, tags, color, size, cost, quantity, prices, taxes } = values;

        await connectToDB();

        const existingProduct = await Product.findOne({ name, brandId, categoryId });
        if (existingProduct) {
            throw new Error("Product already exists");
        }

        const product = new Product({
            name,
            brandId,
            categoryId,
            expiryDate: expiryDate ?? "",
            barcode,
            sku,
            description: description ?? "",
            tags: tags ?? "",
            color: color ?? "",
            size: size ?? "",
            cost: quantity ?? "",
            quantity,
            prices,
            taxes: taxes ?? []
        });

        await product.save();
        revalidatePath(path);
    } catch (error) {
        console.log("Error creating product", error);
        throw error;
    }
}



export async function fetchProductsWithLimit(limit: number = 100) {
    try {
        await connectToDB();

        const products = await Product.find().limit(limit).sort({ updatedAt: -1 });

        if (products.length === 0) {
            return [];
        }
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.log("Error fetching products", error);
        throw error;
    }

}

export async function fetchProductWithBrandAndCategory(brandId: string, categoryId: string) {
    try {
        await connectToDB();

        const products = await Product.find({ brandId, categoryId }).sort({ updatedAt: -1 });

        if (products.length === 0) {
            return [];
        }
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.log("Error fetching products with brand and category", error);
        throw error;
    }

}


export async function fetchProductInfinity(page: number, limit: number = 20) {
    try {
        await connectToDB();

        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        const total = await Product.countDocuments();

        return {
            products: JSON.parse(JSON.stringify(products)),
            total
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { products: [], total: 0 }; // Return an empty array and zero total in case of error
    }
}
