"use server";

import { ROUTER } from "@/constants/router.constant";
import { responAction } from "@/helpers/function.helper";
import MongooseClient from "@/libs/mongodb.lib";
import TypeProjects from "@/models/type-project.model";
import Projects from "@/models/project.model";
import {
   TPayloadEditProject,
   TPayloadProject,
   TProject,
   TTypeProject,
} from "@/types/respon/project.type";
import { ObjectId } from "mongoose";
import { revalidatePath } from "next/cache";

export const getTypeProjectsAction = async (): Promise<TResonAction<TTypeProject[] | null>> => {
   try {
      await MongooseClient();

      const projects = await TypeProjects.find().lean();

      return responAction(true, projects as any, `successfuly`);
   } catch (error: any) {
      return responAction(false, null, error.message);
   }
};

export const getProjectsAction = async (): Promise<TResonAction<TProject[] | null>> => {
   try {
      await MongooseClient();

      const projects = await Projects.find().populate('type').lean();

      return responAction(true, projects as any, `successfuly`);
   } catch (error: any) {
      console.log(error);

      return responAction(false, null, error.message);
   }
};

const resolveTypeId = async (typeInput?: string) => {
   if (!typeInput || !typeInput.trim()) {
      return undefined;
   }

   const trimmed = typeInput.trim();

   if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
      const existingById = await TypeProjects.findById(trimmed);
      if (existingById) return existingById._id;
   }

   let existingType = await TypeProjects.findOne({
      type: { $regex: new RegExp(`^${trimmed.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i") },
   });

   if (!existingType) {
      existingType = await TypeProjects.create({ type: trimmed });
   }

   return existingType._id;
};

const parseTechnologies = (tech: string[] | string | undefined): string[] => {
   if (!tech) return [];
   if (Array.isArray(tech)) return tech.map((t) => t.trim()).filter(Boolean);
   return tech.split(",").map((t) => t.trim()).filter(Boolean);
};

export const createProjectAction = async (
   payload: TPayloadProject,
   finallyCb?: () => void
): Promise<TResonAction<TProject | null>> => {
   try {
      await MongooseClient();

      const typeId = await resolveTypeId(payload.type as any);
      const technologiesArray = parseTechnologies(payload.technologies);

      const newProjects = await Projects.create({
         ...payload,
         type: typeId,
         technologies: technologiesArray,
      });

      revalidatePath(`${ROUTER.PROJECT}`);
      revalidatePath(`${ROUTER.ADMIN.MY_PROJECT}`);

      return responAction(true, newProjects as any, `Create project successfuly`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   } finally {
      if (finallyCb) {
         finallyCb();
      }
   }
};

export const updateProjectAction = async (
   payload: TPayloadEditProject,
   finallyCb?: () => void
): Promise<TResonAction<TProject[] | null>> => {
   try {
      await MongooseClient();

      const typeId = await resolveTypeId(payload.type as any);
      const technologiesArray = parseTechnologies(payload.technologies);

      const updateProjects = await Projects.updateOne(
         { _id: payload._id },
         {
            ...payload,
            type: typeId,
            technologies: technologiesArray,
         }
      );

      revalidatePath(`${ROUTER.PROJECT}`);
      revalidatePath(`${ROUTER.ADMIN.MY_PROJECT}`);

      return responAction(true, updateProjects as any, `Update project successfuly`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   } finally {
      if (finallyCb) {
         finallyCb();
      }
   }
};

export const deleteProjectAction = async (projectId: ObjectId): Promise<TResonAction<null>> => {
   try {
      await MongooseClient();

      const deleteResult = await Projects.deleteOne({ _id: projectId });
      if (deleteResult.deletedCount === 0) throw new Error(`Delete failed`);

      revalidatePath(`${ROUTER.PROJECT}`);
      revalidatePath(`${ROUTER.ADMIN.MY_PROJECT}`);

      return responAction(true, null, `Delete project successfuly`);
   } catch (error: any) {
      console.log(error);
      return responAction(false, null, error.message);
   }
};
