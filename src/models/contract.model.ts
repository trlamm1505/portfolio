import mongoose from "mongoose";

const DOCUMENT_NAME = "Contract";
const COLLECTION_NAME = "Contracts";

const contractSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true },
      subject: { type: String, default: "" },
      message: { type: String, required: true },
   },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

const Contracts =
   mongoose.models[`${DOCUMENT_NAME}`] || mongoose.model(DOCUMENT_NAME, contractSchema);

export default Contracts;
