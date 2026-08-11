"use client";

import { useEffect, useState } from "react";
import { ROUTER } from "@/constants/router.constant";
import { URL_FACEBOOK, URL_GITHUB, URL_LINKEDIN } from "@/constants/app.constant";
import { getTextInPageAction } from "@/actions/title-in-page.action";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import KitesurfingIcon from "@mui/icons-material/Kitesurfing";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Box, Container, IconButton, Stack } from "@mui/material";
import Link from "next/link";
import Logo from "../logo/Logo";

export default function Header() {
   const [socialLinks, setSocialLinks] = useState({
      github: URL_GITHUB,
      facebook: URL_FACEBOOK,
      linkedin: URL_LINKEDIN,
   });
   const [showAdminIcon, setShowAdminIcon] = useState<boolean>(true);

   useEffect(() => {
      // 1. Check environment variable & domain for Admin Icon visibility
      const envEnable = process.env.NEXT_PUBLIC_ENABLE_ADMIN;
      if (envEnable === "false" || envEnable === "0") {
         setShowAdminIcon(false);
      } else if (envEnable === "true" || envEnable === "1") {
         setShowAdminIcon(true);
      } else if (typeof window !== "undefined") {
         const hostname = window.location.hostname.toLowerCase();
         const customAdminDomain = (process.env.NEXT_PUBLIC_ADMIN_DOMAIN || "").toLowerCase();

         const isAllowedDomain =
            hostname.includes("localhost") ||
            hostname.includes("127.0.0.1") ||
            hostname.includes("netlify") ||
            (customAdminDomain && hostname.includes(customAdminDomain));

         setShowAdminIcon(Boolean(isAllowedDomain));
      }

      // 2. Fetch dynamic social links from database
      getTextInPageAction().then((res) => {
         if (res.status && res.data) {
            const items = res.data;
            const gh = items.find((i) => i.title.toLowerCase().includes("github"))?.description;
            const fb = items.find((i) => i.title.toLowerCase().includes("facebook"))?.description;
            const li = items.find((i) => i.title.toLowerCase().includes("linkedin"))?.description;

            setSocialLinks({
               github: gh?.trim() || URL_GITHUB,
               facebook: fb?.trim() || URL_FACEBOOK,
               linkedin: li?.trim() || URL_LINKEDIN,
            });
         }
      });
   }, []);

   return (
      <Box
         sx={{
            position: `fixed`,
            zIndex: `4`,
            width: `100%`,
         }}
      >
         <Container>
            <Stack
               sx={{
                  flexDirection: "row",
                  height: "90px",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <Logo color="#ffffff" dotColor="#8b5cf6" />
               <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <Link
                     target="_blank"
                     rel="noopener noreferrer"
                     href={socialLinks.github}
                  >
                     <IconButton sx={{ "& svg": { fontSize: "32px" } }}>
                        <GitHubIcon />
                     </IconButton>
                  </Link>
                  <Link
                     target="_blank"
                     rel="noopener noreferrer"
                     href={socialLinks.facebook}
                  >
                     <IconButton sx={{ "& svg": { fontSize: "32px" } }}>
                        <FacebookIcon />
                     </IconButton>
                  </Link>
                  <Link
                     target="_blank"
                     rel="noopener noreferrer"
                     href={socialLinks.linkedin}
                  >
                     <IconButton sx={{ "& svg": { fontSize: "32px" } }}>
                        <LinkedInIcon />
                     </IconButton>
                  </Link>

                  {/* 4th Icon: Admin Access (Rendered ONLY on Netlify, Localhost, or when NEXT_PUBLIC_ENABLE_ADMIN=true) */}
                  {showAdminIcon && (
                     <Link href={ROUTER.ADMIN.AUTH.LOGIN}>
                        <IconButton sx={{ "& svg": { fontSize: "32px" } }}>
                           <KitesurfingIcon />
                        </IconButton>
                     </Link>
                  )}
               </Box>
            </Stack>
         </Container>
      </Box>
   );
}
