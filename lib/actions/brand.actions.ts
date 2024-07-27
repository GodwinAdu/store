"use server"

import { revalidatePath } from "next/cache";
import { currentProfile } from "../helpers/current-user";
import Brand from "../models/brand.models";
import { connectToDB } from "../mongoose";
import { generateCode } from "../helpers/generate-code";
import Product from "../models/product.models";


interface BrandProps {
    name: string;
    active?: boolean;
}
export async function createBrand(values: BrandProps) {
    try {
        const { name, active } = values
        const user = await currentProfile()
        await connectToDB();
        const existingBrand = await Brand.findOne({ name });

        if (existingBrand) {
            throw new Error("Brand already exists")
        }

        const brand = new Brand({
            name,
            active,
            code: generateCode(),
            createdBy: user?._id
        });

        await brand.save();

    } catch (error) {
        console.log("Error creating brand ", error)
        throw error
    }
}

export async function fetchAllBrands() {
    try {
        await connectToDB();
        const brands = await Brand.find({}).populate("createdBy", "username");

        if (brands.length === 0) {
            return []
        }

        return JSON.parse(JSON.stringify(brands));

    } catch (error) {
        console.log("Error fetching all brand ", error)
        throw error
    }
}


export async function fetchBrandById(id: string) {
    try {
        await connectToDB();
        const brand = await Brand.findById(id).populate("createdBy", "username");

        if (!brand) {
            throw new Error("Brand not found")
        }

        return JSON.parse(JSON.stringify(brand));

    } catch (error) {
        console.log("Error fetching brand by id ", error)
        throw error
    }
}


export async function updateBrand(id: string, values: Partial<BrandProps>, path: string) {
    try {
        await connectToDB();
        const user = await currentProfile()
        const brand = await Brand.findByIdAndUpdate(id, values, { new: true })

        if (!brand) {
            throw new Error("Brand not found")
        }

        revalidatePath(path)
        return JSON.parse(JSON.stringify(brand));

    } catch (error) {
        console.log("Error updating brand ", error)
        throw error
    }
}


export async function deleteBrand(id: string) {
    try {
        await connectToDB();
        
        const products = await Product.find({ brandId: id });

        if(products.length > 0) {
            throw new Error("Cannot delete brand with associated products")
        }

        await Brand.findByIdAndDelete(id);

    } catch (error) {
        console.log("Error deleting brand ", error)
        throw error
    }
}