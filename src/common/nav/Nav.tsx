"use client";

import { ROUTER } from "@/constants/router.constant";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { IconButton, Stack } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useResponsive from "../hooks/useResponsive";

const navData = [
   { name: "Home", path: ROUTER.HOME, icon: <HomeRoundedIcon /> },
   { name: "About", path: ROUTER.ABOUT, icon: <PersonRoundedIcon /> },
   { name: "Project", path: ROUTER.PROJECT, icon: <AssignmentIcon /> },
   { name: "Contact", path: ROUTER.CONTACT, icon: <EmailRoundedIcon /> },
];

export default function Nav() {
   const pathName = usePathname();
   const [startTransition, setStartTransition] = useState(false);
   const router = useRouter();
   const isMobile = useResponsive("down", "lg");
   return (
      <>
         {/* desktop */}
         {!isMobile && (
            <Stack
               component={"nav"}
               sx={{
                  zIndex: "3",
                  justifyContent: "center",
                  height: "100vh",
                  width: "65px",
                  position: "fixed",
                  top: "0",
                  right: "2%",
               }}
            >
               <Stack
                  sx={{
                     backgroundColor: "hsla(0, 0%, 100%, .1)",
                     borderRadius: "999999px",
                     alignItems: "center",
                     gap: "30px",
                     py: "20px",
                     backdropFilter: `blur(5px)`,
                  }}
               >
                  {navData.map((item, index) => {
                     const isActive = item.path === pathName;
                     return (
                        <IconButton
                           onClick={async () => {
                              router.push(item.path);
                           }}
                           key={index}
                           sx={{
                              color: isActive ? "#b388ff" : "hsla(0, 0%, 100%, 0.8)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                 color: "#d1c4e9",
                                 transform: "scale(1.15)",
                              },
                           }}
                        >
                           {item.icon}
                        </IconButton>
                     );
                  })}
               </Stack>
            </Stack>
         )}

         {/* mobile */}
         {isMobile && (
            <Stack
               component={"nav"}
               sx={{
                  zIndex: "3",
                  alignItems: "center",
                  width: "100vw",
                  height: "65px",
                  position: "fixed",
                  left: "0",
                  bottom: "2%",
               }}
            >
               <Stack
                  sx={{
                     height: `100%`,
                     flexDirection: `row`,
                     backgroundColor: "hsla(0, 0%, 100%, .1)",
                     borderRadius: "999999px",
                     alignItems: "center",
                     justifyContent: `center`,
                     gap: "30px",
                     px: "20px",
                     backdropFilter: `blur(5px)`,
                     width: `290px`,
                  }}
               >
                  {navData.map((item, index) => {
                     const isActive = item.path === pathName;
                     return (
                        <IconButton
                           onClick={async () => {
                              router.push(item.path);
                           }}
                           key={index}
                           sx={{
                              color: isActive ? "#b388ff" : "hsla(0, 0%, 100%, 0.8)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                 color: "#d1c4e9",
                              },
                           }}
                        >
                           {item.icon}
                        </IconButton>
                     );
                  })}
               </Stack>
            </Stack>
         )}
      </>
   );
}
