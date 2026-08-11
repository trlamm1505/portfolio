import { ObjectId } from "mongoose";

export type TSkill = {
   _id: ObjectId;
   title: string;
   images: string[];
};

export type TSkillCreate = Omit<TSkill, "_id">;
export type TPayloadSkill = TSkillCreate;
