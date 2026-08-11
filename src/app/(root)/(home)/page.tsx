import { getTextInPageAction, getTextInPageByPageAction } from "@/actions/title-in-page.action";
import Home from "@/components/root/home/Home";
import { ROUTER } from "@/constants/router.constant";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
   const dataTextInPage = await getTextInPageByPageAction(ROUTER.HOME);
   const allTextInPage = await getTextInPageAction();
   return <Home dataTextInPage={dataTextInPage} allTextInPage={allTextInPage} />;
}
