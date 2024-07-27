"use server"

import { cookies } from "next/headers";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken"
import { fetchUser } from "../actions/user.actions";

export async function currentProfile() {
    const cookiesStore = cookies();
    const tokenValue = cookiesStore.get("token");

    try {

        if (!tokenValue || !tokenValue.value) {
            return null;
        };

        const decode: string | JwtPayload = await jwt.verify(tokenValue.value, process.env.TOKEN_SECRET!);

        // Check if the token has expired
        if (!decode) {
            return null;
        }

        const user = await fetchUser(decode?.id!);

        if (!user) {
            return null;
        }

        return user;

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return;
        };

        console.error("Error decoding token", error);
        return;
    }
}