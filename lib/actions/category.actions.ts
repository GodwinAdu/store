"use server"

import { revalidatePath } from "next/cache";
import { currentProfile } from "../helpers/current-user";
import Category from "../models/category.models";
import { connectToDB } from "../mongoose";
import { generateCode } from "../helpers/generate-code";
import Product from "../models/product.models";
import History from "../models/history.models";
import { getUserDetails } from "../utils";

interface CategoryProps {
    name: string;
    active?: boolean;
}

export async function createCategory(values: CategoryProps) {
    try {
        const user = await currentProfile()
        const { name, active } = values;
        await connectToDB();
        const category = new Category({
            name,
            active,
            code: generateCode(),
            createdBy: user?._id
        });
        const history = new History({
            action:`Update Category ${values.name}`,
            user: user._id,
            details: await getUserDetails(),
        });

        await Promise.all([
            category.save(),
            history.save(),
        ])
        ;
    } catch (error) {
        console.log("Error creating category ", error)
        throw error
    }
}


export async function fetchAllCategories() {
    try {
        await connectToDB();
        const categories = await Category.find({}).populate("createdBy", "username");
        if (categories.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        console.log("Error fetching categories ", error)
        throw error
    }
}


export async function fetchCategoryById(id: string) {
    try {
        await connectToDB();
        const category = await Category.findById(id).populate("createdBy", "username");
        if (!category) {
            throw new Error("Category not found")
        }
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.log("Error fetching category ", error)
        throw error
    }
}


export async function updateCategory(id: string, values: Partial<CategoryProps>, path: string) {
    try {
        await connectToDB();
        const user = await currentProfile()
          // Add modifiedBy and mod_flag to the values object
          const updateValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
        };

        const category = await Category.findByIdAndUpdate(id, updateValues, { new: true })
        if (!category) {
            throw new Error("Category not found")
        }
        const history = new History({
            action:`Update Category ${values.name}`,
            user: user._id,
            details: await getUserDetails(),
        });

        await history.save()

        revalidatePath(path)
        return JSON.parse(JSON.stringify(category));
    } catch (error) {
        console.log("Error updating category ", error)
        throw error
    }
}



export async function deleteCategory(id: string) {
    try {
        await connectToDB();

        const products = await Product.find({ categoryId: id });

        if (products.length > 0) {
            throw new Error("Cannot delete category with associated products")
        }

        await Category.findByIdAndDelete(id);

    } catch (error) {
        console.log("Error deleting category ", error)
        throw error
    }
}