import { uploadLocalAction, deleteLocalAction } from "@/actions/upload.action";
import { toast } from "react-toastify";

export const uploadWithFirebase = async (file: File, folder: string) => {
   try {
      const formData = new FormData();
      formData.append("file", file);

      const resultName = await uploadLocalAction(formData, folder);
      if (!resultName) {
         throw new Error("Upload failed");
      }
      return resultName;
   } catch (error: any) {
      toast.error(error.message || "Upload failed");
      return null;
   }
};

export const deleteWithFirebase = async (name: string, folder: string) => {
   try {
      return await deleteLocalAction(name, folder);
   } catch (error: any) {
      toast.error(error.message || "Delete failed");
      return false;
   }
};
