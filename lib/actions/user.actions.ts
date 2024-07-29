"use server"

import { hash } from "bcryptjs";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import { revalidatePath } from "next/cache";
import { currentProfile } from "../helpers/current-user";

interface UserProps {
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    address: string;
    country: string;
    isAdmin?: boolean;

}

export async function createUser(values: UserProps, path?: string) {
    try {
        const user = await currentProfile();
        const { username, email, password, phone, gender, country, address, isAdmin } = values;
        const hashedPassword = await hash(password, 10)
        await connectToDB();

        const existingUser = await User.findOne({ username, email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            gender,
            address,
            country,
            isAdmin: isAdmin ?? false,
            createdBy: user?._id ?? null,
            action_type: "create",
        })
        await newUser.save();

        if (path) {
            revalidatePath(path)
        }

    } catch (error) {
        console.log("Error creating user ", error)
        throw error
    }
}

export async function fetchUser(id: string) {
    try {
        await connectToDB();
        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found")
        }
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log("Error fetching user ", error)
        throw error
    }
}
export async function fetchAllUsers() {
    try {
        await connectToDB();
        const users = await User.find({});

        if (users.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.log("Error fetching users ", error)
        throw error
    }
}

export async function deleteUser(id: string) {
    try {
        await connectToDB();
        await User.findByIdAndDelete(id);
    } catch (error) {
        console.log("Error deleting user ", error)
        throw error
    }
}

export async function updateUser(id: string, values: Partial<UserProps>, path: string) {
    try {
        await connectToDB();
        const user = await User.findByIdAndUpdate(id, values, { new: true });
        if (!user) {
            throw new Error("User not found")
        }
        revalidatePath(path)
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log("Error updating user ", error)
        throw error
    }
}