"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.models";
import { connectToDB } from "../mongoose";
import { currentProfile } from "../helpers/current-user";
import { generateRandomCodes } from "../helpers/generate-barcode";
import { generateUniqueSKU } from "../helpers/generate-sku";
import History from "../models/history.models";
import { getUserDetails } from "../user-details";


interface ProductProps {
    name: string;
    brandId: string;
    categoryId: string;
    expiryDate?: Date | undefined;
    barcode?: string;
    sku?: string;
    description?: string | undefined;
    tags?: string[] | undefined;
    color?: string[] | undefined;
    size?: string[] | undefined;
    cost: number | undefined;
    minimumQuantity: number;
    prices: { name: string; quantityPerUnit: number, stock: number, price: number }[];
    taxes?: number | undefined;
    discount?: number | undefined;
    active: boolean;
}
export async function createProduct(values: ProductProps, path: string) {
    try {
        const user = await currentProfile();
        const { name, brandId, categoryId, expiryDate, barcode, sku, description, tags, color, size, cost, prices, taxes, discount, minimumQuantity, active } = values;

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
            barcode: barcode || generateRandomCodes(6, 6),
            sku: sku || generateRandomCodes(8, 8),
            description: description ?? "",
            tags: tags ?? [],
            color: color ?? [],
            size: size ?? [],
            cost: cost ?? 0,
            prices,
            taxes,
            minimumQuantity,
            discount,
            active,
            createdBy: user?._id,
            action_type: "create",
        });
        const history = new History({
            action: `Create new Product with ${values.name}`,
            user: user._id,
            details: await getUserDetails(),
        });

        await Promise.all([
            product.save(),
            history.save(),
        ])

        revalidatePath(path);
    } catch (error) {
        console.log("Error creating product", error);
        throw error;
    }
}


export async function fetchProductById(id: string){
    try {
        await connectToDB();

        const product = await Product.findById(id)
           .populate("createdBy", "username")
           .populate("brandId", "name")
           .populate("categoryId", "name");

        if (!product) {
            throw new Error("Product not found");
        }
        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.log("Error fetching product by ID", error);
        throw error;
    }
}



export async function fetchProductsWithLimit(limit: number = 100) {
    try {
        await connectToDB();

        const products = await Product.find()
            .populate("createdBy", "username")
            .limit(limit)
            .sort({ updatedAt: -1 });

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

export async function fetchProductByNameSkuOrBarcode(searchTerm: string) {
    try {
        await connectToDB();

        const regex = new RegExp(`^${searchTerm}`, 'i'); // Case-insensitive match from the beginning

        const product = await Product.findOne({
            $or: [
                { sku: regex },
                { barcode: regex }
            ]
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return JSON.parse(JSON.stringify(product));
    } catch (error) {
        console.log("Error fetching product by name, SKU, or barcode", error);
        throw error;
    }
}


export async function updateProduct(id: string, values: Partial<ProductProps>, path: string){
    try {
        await connectToDB();
        const user = await currentProfile();

        const updateValues = {
           ...values,
            modifiedBy: user._id,
            mod_flag: true,
            action_type: "update",
        };

        const product = await Product.findByIdAndUpdate(id, updateValues, { new: true });

        if (!product) {
            throw new Error("Product not found");
        }

        const history = new History({
            action: `Update Product with ${product.name}`,
            user: user._id,
            details: await getUserDetails(),
        });

        await history.save();

        revalidatePath(path);

        return JSON.parse(JSON.stringify(product));

    } catch (error) {
        console.log("Error updating product", error);
        throw error;
    }
}