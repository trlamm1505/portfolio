"use server";

import { responAction } from "@/helpers/function.helper";
import { getToken } from "@/libs/auth.lib";
import MongooseClient from "@/libs/mongodb.lib";
import Users from "@/models/users.model";

export const getCurrentUserAction = async (): Promise<TResonAction<any>> => {
   try {
      await MongooseClient();
      const userId = await getToken();
      if (!userId) return responAction(false, null, "Not authenticated");

      const user = await Users.findById(userId).select("name email").lean();
      if (!user) return responAction(false, null, "User not found");

      return responAction(true, JSON.parse(JSON.stringify(user)), "User fetched successfully");
   } catch (error: any) {
      console.log("getCurrentUserAction error:", error);
      return responAction(false, null, error.message);
   }
};
