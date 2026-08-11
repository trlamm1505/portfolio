import mongoose, { Schema } from "mongoose";
import TypeProjects from "./type-project.model";

// console.log(TypeProjects.modelName);
// console.log(TypeProjects.collection.name);

const DOCUMENT_NAME = "Project";
const COLLECTION_NAME = "Projects";

// Custom validator function to check if platform array contains only one of the specified values
const projectSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      type: {
         type: Schema.ObjectId,
         ref: TypeProjects.modelName,
         required: false,
      },
      platform: {
         type: String,
         required: false,
         default: "",
      },
      company_name: {
         type: String,
         default: "",
      },
      location: {
         type: String,
         default: "",
      },
      date_range: {
         type: String,
         default: "",
      },
      category: {
         type: String,
         default: "Work Experience",
      },
      link: {
         type: String,
         default: "",
      },
      github_link: {
         type: String,
         default: "",
      },
      demo_link: {
         type: String,
         default: "",
      },
      technologies: {
         type: [String],
         default: [],
      },
      img_project_name: {
         type: String,
         required: false,
         default: "",
      },
      img_logo_name: {
         type: String,
         required: false,
         default: "",
      },
   },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

// Always clear cached model in development to prevent stale schema validation errors
if (mongoose.models[DOCUMENT_NAME]) {
   delete mongoose.models[DOCUMENT_NAME];
}

const Projects = mongoose.model(DOCUMENT_NAME, projectSchema);

export default Projects;
