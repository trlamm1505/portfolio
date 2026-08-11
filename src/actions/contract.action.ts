"use server";

import { responAction } from "@/helpers/function.helper";
import MongooseClient from "@/libs/mongodb.lib";
import Contracts from "@/models/contract.model";
import { TContract } from "@/types/respon/contract.type";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

type TSendMailAction = {
   value: {
      name: string;
      email: string;
      subject?: string;
      message: string;
   };
   emailMe: string;
};

export const sendMailAction = async ({ value, emailMe }: TSendMailAction): Promise<TResonAction<any>> => {
   try {
      await MongooseClient();

      // 1. Save contact message into MongoDB Contracts collection
      const newContract = await Contracts.create({
         name: value.name,
         email: value.email,
         subject: value.subject || "",
         message: value.message,
      });

      revalidatePath("/admin/contract");

      // 2. Send email via Nodemailer if APP_PASSWORD_GOOGLE is configured
      if (process.env.APP_PASSWORD_GOOGLE && emailMe) {
         try {
            let transporter = nodemailer.createTransport({
               service: "gmail",
               auth: {
                  user: emailMe,
                  pass: process.env.APP_PASSWORD_GOOGLE,
               },
            });
            let infoMail = {
               from: emailMe,
               to: emailMe,
               subject: `Portfolio Contact - ${value.name} (${value.subject || value.email})`,
               html: `
               <p><strong>Name: </strong><span>${value.name}</span></p>
               <p><strong>Email: </strong><span>${value.email}</span></p>
               <p><strong>Subject: </strong><span>${value.subject || "N/A"}</span></p>
               <p><strong>Message: </strong><span>${value.message}</span></p>
               `,
            };
            await transporter.sendMail(infoMail);
         } catch (mailError) {
            console.log("Nodemailer mail warning:", mailError);
         }
      }

      return responAction(true, JSON.parse(JSON.stringify(newContract)), "Submitted message successfully");
   } catch (error: any) {
      console.log("sendMailAction error:", error);
      return responAction(false, null, error.message);
   }
};

export const getContractsAction = async (): Promise<TResonAction<TContract[] | null>> => {
   try {
      await MongooseClient();
      const contracts = await Contracts.find().sort({ createdAt: -1 }).lean();
      return responAction(true, JSON.parse(JSON.stringify(contracts)), "Fetch contracts successfully");
   } catch (error: any) {
      console.log("getContractsAction error:", error);
      return responAction(false, null, error.message);
   }
};

export const deleteContractAction = async (id: string): Promise<TResonAction<null>> => {
   try {
      await MongooseClient();
      const deleteResult = await Contracts.deleteOne({ _id: id });
      if (deleteResult.deletedCount === 0) throw new Error("Delete contract failed");
      revalidatePath("/admin/contract");
      return responAction(true, null, "Delete contract successfully");
   } catch (error: any) {
      console.log("deleteContractAction error:", error);
      return responAction(false, null, error.message);
   }
};
