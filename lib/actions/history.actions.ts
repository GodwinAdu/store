"use server"

import History from "../models/history.models";

export async function fetchAllHistories(){
    try {
        const histories = await History.find({})
            .populate("user", "username")

        if (histories.length === 0) {
            return []
        }
        return JSON.parse(JSON.stringify(histories));

    } catch (error) {
        console.log("Error fetching histories ", error)
        throw error
    }
}