"use server"

import { cookies } from "next/headers";
import { connectToDB } from "../mongoose";
import User from "../models/user.models";
import { compare } from "bcryptjs";
import jwt from 'jsonwebtoken';

interface LoginProps {
    email: string;
    password: string;
}

export async function loginUser({ email, password }: LoginProps) {
    await connectToDB();
    const cookieStore = cookies();
    try {
        const user = await User.findOne({ email })
        if (!user) {
            console.log("User doesn't exist")
            return null
        };

        const tokenData = {
            id: user?._id,
            username: user?.username,
            email: user?.email,
            role: user?.isAdmin
        };

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            console.log("password is invalid");
            return
        } else {
            console.log("student is login")
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

        cookieStore.set("token", token,
            {
                httpOnly: true,
                // maxAge: 60 ,
            }
        );


        return JSON.parse(JSON.stringify(user));

    } catch (error: any) {
        console.log("Unable to login student", error);
        throw error
    }
}
