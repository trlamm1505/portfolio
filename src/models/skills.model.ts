import mongoose from "mongoose";

const DOCUMENT_NAME = "Skill";
const COLLECTION_NAME = "Skills";

const skillSchema = new mongoose.Schema(
   {
      title: { type: String, required: true, unique: true },
      images: { type: [String], default: [] },
   },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

const Skills =
   mongoose.models[`${DOCUMENT_NAME}`] || mongoose.model(DOCUMENT_NAME, skillSchema);

export default Skills;
