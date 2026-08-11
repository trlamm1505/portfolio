"use server";

import { responAction } from "@/helpers/function.helper";
import MongooseClient from "@/libs/mongodb.lib";
import Skills from "@/models/skills.model";
import { TSkill, TSkillCreate } from "@/types/respon/skill.type";
import { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";

export const getSkillsAction = async (): Promise<TResonAction<TSkill[] | null>> => {
   try {
      await MongooseClient();
      const skills = await Skills.find().lean();
      return responAction(true, skills as any, `successfully`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   }
};

export const createSkillAction = async (
   payload: TSkillCreate,
   finallyCb?: () => void
): Promise<TResonAction<TSkill | null>> => {
   try {
      await MongooseClient();
      const newSkill = await Skills.create(payload);
      revalidatePath(`/`);
      revalidatePath(`/about`);
      return responAction(true, newSkill as any, `Create skill successfully`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   } finally {
      if (finallyCb) {
         finallyCb();
      }
   }
};

export const updateSkillAction = async (
   payload: TSkill,
   finallyCb?: () => void
): Promise<TResonAction<any>> => {
   try {
      await MongooseClient();
      const updateResult = await Skills.updateOne({ _id: payload._id }, payload);
      revalidatePath(`/`);
      revalidatePath(`/about`);
      return responAction(true, updateResult as any, `Update skill successfully`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   } finally {
      if (finallyCb) {
         finallyCb();
      }
   }
};

export const deleteSkillAction = async (
   skillId: ObjectId
): Promise<TResonAction<null>> => {
   try {
      await MongooseClient();
      const deleteResult = await Skills.deleteOne({ _id: skillId });
      if (deleteResult.deletedCount === 0) throw new Error(`Delete failed`);
      revalidatePath(`/`);
      revalidatePath(`/about`);
      return responAction(true, null, `Delete skill successfully`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   }
};
