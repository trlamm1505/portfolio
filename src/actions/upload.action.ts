"use server";

import fs from "fs/promises";
import path from "path";
import { generateId } from "@/helpers/function.helper";

export const uploadLocalAction = async (formData: FormData, folder: string) => {
   try {
      const file = formData.get("file") as File;
      if (!file) throw new Error("No file provided");

      const originalname = file.name;
      const extName = originalname.substring(originalname.lastIndexOf(".") + 1);
      const mainName = `${generateId(10)}.${extName}`;

      const targetDir = path.join(process.cwd(), "public", "uploads", folder);
      await fs.mkdir(targetDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(targetDir, mainName);
      await fs.writeFile(filePath, buffer);

      return mainName;
   } catch (error: any) {
      console.error("Local upload error:", error);
      return null;
   }
};

export const deleteLocalAction = async (name: string, folder: string) => {
   try {
      const filePath = path.join(process.cwd(), "public", "uploads", folder, name);
      await fs.unlink(filePath).catch(() => {});
      return true;
   } catch (error: any) {
      console.error("Local delete error:", error);
      return false;
   }
};
