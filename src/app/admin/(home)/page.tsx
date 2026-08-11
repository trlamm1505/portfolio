import { ROUTER } from "@/constants/router.constant";
import { redirect } from "next/navigation";

export default function page() {
   redirect(ROUTER.ADMIN.AUTH.LOGIN);
}
