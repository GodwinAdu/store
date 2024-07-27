"use server"

import { revalidatePath } from "next/cache";
import { generateCode } from "../helpers/generate-code";
import Unit from "../models/unit.models";
import { connectToDB } from "../mongoose";
import { currentProfile } from "../helpers/current-user";


interface UnitProps {
    name: string;
    active?: boolean;
}
export async function createUnit(value: UnitProps) {
    try {
        const user = await currentProfile();
        await connectToDB();
        const existingUnit = await Unit.findOne({ name: value.name });

        if (existingUnit) {
            throw new Error("Unit already exists");
        }

        const unit = new Unit({ ...value, createdBy: user?._id, code: generateCode() });
        await unit.save();

    } catch (error) {
        console.log("Error creating unit ", error);
        throw error;
    }
}


export async function fetchAllUnits() {
    try {
        await connectToDB();
        const units = await Unit.find({}).populate("createdBy", "username");;

        if (units.length === 0) {
            return [];
        }

        return JSON.parse(JSON.stringify(units));

    } catch (error) {
        console.log("Error fetching all units ", error);
        throw error;
    }
}

export async function fetchUnitById(id: string) {
    try {
        await connectToDB();
        const unit = await Unit.findById(id).populate("createdBy", "username");;

        if (!unit) {
            throw new Error("Unit not found");
        }

        return JSON.parse(JSON.stringify(unit));

    } catch (error) {
        console.log("Error fetching unit by id ", error);
        throw error;
    }
}


export async function updateUnit(id: string, values: Partial<UnitProps>, path: string) {
    try {
        await connectToDB();
        const unit = await Unit.findByIdAndUpdate(id, values, { new: true });

        if (!unit) {
            throw new Error("Unit not found");
        }

        revalidatePath(path)

        return JSON.parse(JSON.stringify(unit));

    } catch (error) {
        console.log("Error updating unit ", error);
        throw error;
    }
}


export async function deleteUnit(id: string) {
    try {
        await connectToDB();
        await Unit.findByIdAndDelete(id);

    } catch (error) {
        console.log("Error deleting unit ", error);
        throw error;
    }
}