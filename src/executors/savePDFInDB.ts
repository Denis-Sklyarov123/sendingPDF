import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

import type { FileContent } from "../types/interfaces/fileContent";

// Не готов
export const savePDFInDB = async (files: FileContent[]) => {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("full"); // Имя базы данных
    const collection = database.collection("sharan.things.attachment"); // Имя коллекции

    for (const file of files) {
      const document = {
        _id: new ObjectId(file.attachmentId),
        __tid: "Sharan.Attachment",
        iForm: false,
        description: "Patient document",
        fileName: "[" + file.fileId + "]_" + file.fileName,
        date: new Date(),
        createdBy: "admin",
        created: new Date(),
        lastModifiedBy: "admin",
        lastModified: new Date(),
        __v: 0,
      };

      await collection.insertOne(document);
      console.log(
        `File ${file.fileName} was successfully saved to the database`
      );
    }
  } catch (err: any) {
    throw new Error("Error saving files to database:", err.message);
  }
};
