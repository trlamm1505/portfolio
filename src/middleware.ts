import { ROUTER } from "@/constants/router.constant";
import { getToken } from "@/libs/auth.lib";
import { NextResponse, type NextRequest } from "next/server";

function isAdminAccessAllowed(request: NextRequest): boolean {
   // 1. Check Environment Variable
   const envEnable = process.env.NEXT_PUBLIC_ENABLE_ADMIN;
   if (envEnable === "true" || envEnable === "1") return true;
   if (envEnable === "false" || envEnable === "0") return false;

   // 2. Check Hostname / Domain (Netlify, localhost, or custom admin domain)
   const host = (request.headers.get("host") || "").toLowerCase();
   const customAdminDomain = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN || "").toLowerCase();

   if (customAdminDomain && host.includes(customAdminDomain)) return true;
   if (host.includes("netlify") || host.includes("localhost") || host.includes("127.0.0.1")) return true;

   return false;
}

export async function middleware(request: NextRequest) {
   const pathname = request.nextUrl.pathname;

   // Block direct /admin access if admin is not enabled for this domain/env -> Redirect to Home
   if (pathname.startsWith("/admin")) {
      if (!isAdminAccessAllowed(request)) {
         return NextResponse.redirect(new URL("/", request.url));
      }
   }

   const arrPathProtect = [
      `${ROUTER.ADMIN.DASHBOARD}`,
      `${ROUTER.ADMIN.ABOUT}`,
      `${ROUTER.ADMIN.MY_PROJECT}`,
      `${ROUTER.ADMIN.CONTRACT}`,
      `${ROUTER.ADMIN.TEXT_IN_PAGE}`,
      `${ROUTER.ADMIN.CERTIFICATION}`,
      `${ROUTER.ADMIN.EDUCATION}`,
      `${ROUTER.ADMIN.SKILL}`,
   ];

   if (pathname === "/admin" || pathname === "/admin/") {
      const user = await getToken();
      if (user) {
         return NextResponse.redirect(new URL(`${ROUTER.ADMIN.DASHBOARD}`, request.url));
      } else {
         return NextResponse.redirect(new URL(`${ROUTER.ADMIN.AUTH.LOGIN}`, request.url));
      }
   }

   if (arrPathProtect.includes(pathname)) {
      const user = await getToken();
      if (!user) {
         return NextResponse.redirect(new URL(`${ROUTER.ADMIN.AUTH.LOGIN}`, request.url));
      }
   }

   if (pathname === ROUTER.ADMIN.AUTH.LOGIN) {
      const user = await getToken();
      if (user) {
         return NextResponse.redirect(new URL(`${ROUTER.ADMIN.DASHBOARD}`, request.url));
      }
   }

   if (pathname === ROUTER.ADMIN.AUTH.REGISTER) {
      const user = await getToken();
      if (user) {
         return NextResponse.redirect(new URL(`${ROUTER.ADMIN.DASHBOARD}`, request.url));
      }
   }
}

export const config = {
   matcher: [
      "/((?!api|logo|manifest|_next/static|_next/image|favicon.ico).*)",
   ],
};
