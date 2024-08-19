"use server"

import { revalidatePath } from "next/cache";
import Account from "../models/account.models";
import { connectToDB } from "../mongoose";
import { currentProfile } from "../helpers/current-user";
import History from "../models/history.models";
import { getUserDetails } from "../utils";

interface CreateAccountProps {
    accountName: string;
    balance: number;
}

export async function createAccount(values: CreateAccountProps) {
    try {
        const { accountName, balance } = values;
        const user = await currentProfile();

        await connectToDB();

        const existingAccount = await Account.findOne({ accountName });

        if (existingAccount) {
            throw new Error("Account already exists");
        }

        const account = new Account({
            accountName,
            balance,
            createdBy: user._id
        });

        const history = new History({
            action: "New Account Created",
            user: user._id,
            details: await getUserDetails(),
        });

        await Promise.all([
            account.save(),
            history.save(),
        ])

    } catch (error) {
        console.error("Error creating account", error);
        throw error;
    }
}


export async function getAllAccounts() {
    try {
        await connectToDB();

        const accounts = await Account.find({})
            .populate("createdBy", "username")
            .lean();
        if (accounts.length === 0) {
            console.log("No accounts found");
            return []; // or throw an error if you want to handle it differently
        }

        return JSON.parse(JSON.stringify(accounts));

    } catch (error) {
        console.log("Something went wrong", error);
        throw error;
    }
}


export async function getAccountById(accountId: string) {
    try {
        await connectToDB();

        const account = await Account.findById(accountId)
            .populate("createdBy", "username");
        if (!account) {
            throw new Error("Account not found");
        }

        return JSON.parse(JSON.stringify(account));

    } catch (error) {
        console.log("Something went wrong", error);
        throw error;
    }
}

export async function updateAccount(accountId: string, values: Partial<CreateAccountProps>, path: string) {
    try {
        const user = await currentProfile()
        await connectToDB();

        // Add modifiedBy and mod_flag to the values object
        const updateValues = {
            ...values,
            modifiedBy: user._id,
            mod_flag: true,
        };

        const updateAccount = await Account.findByIdAndUpdate(
            accountId,
            { $set: updateValues },
            { new: true, runValidators: true }
        );


        if (!updateAccount) {
            console.log("Account not found");
            return null;
        }
        const history = new History({
            action: `Update Account name ${values.accountName}`,
            user: user._id,
            details: await getUserDetails(),
        });
        await history.save()

        console.log("Update successful");

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updateAccount));
    } catch (error) {
        console.error("Error updating House:", error);
        throw error;
    }
}


export async function deleteAccount(accountId: string) {
    try {
        await connectToDB();
        const accountToDelete = await Account.findById(accountId);

        if (!accountToDelete) {
            throw new Error('Account not found');
        }

        if (accountToDelete.balance > 0) {
            throw new Error('Account balance is greater than 0. Cannot delete account.');
        }

        await Account.findByIdAndDelete(accountId);
        console.log(`Account with ID ${accountId} has been deleted successfully.`);

    } catch (error) {
        console.log("Unable to delete account", error);
        throw error;
    }
}