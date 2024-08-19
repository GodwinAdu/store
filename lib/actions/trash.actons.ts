"use server"

import { Model } from "mongoose";
import Trash from "../models/trash.models";

export async function deleteDocument<T extends Document>(Model: Model<T>, documentId: string): Promise<void> {
    try {
      const document = await Model.findById(documentId);
      if (!document) {
        throw new Error('Document not found');
      }
  
      const trashEntry = new Trash({
        collectionName: Model.collection.name,
        document: document.toObject()
      });
  
      await trashEntry.save();
      await Model.findByIdAndDelete(documentId);
  
      console.log('Document moved to trash');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }