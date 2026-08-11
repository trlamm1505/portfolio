import { ObjectId } from "mongoose";

export type TTypeProject = {
   _id: ObjectId;
   type: string;
};

export type TProject = {
   _id: ObjectId;
   title: string;
   description: string;
   type?: { _id: ObjectId; type: string };
   platform?: string;
   company_name?: string;
   location?: string;
   date_range?: string;
   category?: string;
   link?: string;
   github_link?: string;
   demo_link?: string;
   technologies?: string[];
   img_project_name: string;
   img_logo_name: string;
   createdAt: string;
   updatedAt: string;
   __v: number;
};

export type TPayloadProject = {
   title: string;
   description: string;
   type?: string;
   platform?: string;
   company_name?: string;
   location?: string;
   date_range?: string;
   category?: string;
   link?: string;
   github_link?: string;
   demo_link?: string;
   technologies?: string[] | string;
   img_project_name: string;
   img_logo_name: string;
};

export type TPayloadEditProject = {
   _id: ObjectId;
   title: string;
   description: string;
   type?: string;
   platform?: string;
   company_name?: string;
   location?: string;
   date_range?: string;
   category?: string;
   link?: string;
   github_link?: string;
   demo_link?: string;
   technologies?: string[] | string;
   img_project_name: string;
   img_logo_name: string;
};
