"use client";

import { logoutAction } from "@/actions/logout.action";
import { HEIGHT_HEADER, WIDTH_NAV } from "@/constants/app.constant";
import { LIST_NAV } from "@/constants/nav.constant";
import { ROUTER } from "@/constants/router.constant";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Divider, List, ListItemButton, ListItemIcon, ListItemText, Stack } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { toast } from "react-toastify";
import Logo from "../logo/Logo";
import ListItemNav from "./ListItemNav";

export default function NavAdmin() {
   const router = useRouter();
   const pathname = usePathname();

   const handleLogout = async () => {
      const result = await logoutAction();

      if (result.status) {
         router.push(ROUTER.ADMIN.AUTH.LOGIN);
      } else {
         toast.error(result.message);
      }
   };

   return (
      <Stack
         sx={{
            width: WIDTH_NAV,
            height: `100%`,
            backgroundColor: `#ffffff`,
            borderRight: `1px solid #e5d8fa`,
            boxShadow: `4px 0 20px rgba(139, 92, 246, 0.03)`,
         }}
      >
         <Stack
            sx={{
               height: HEIGHT_HEADER,
               width: `100%`,
               alignItems: `center`,
               justifyContent: `center`,
               borderBottom: `1px solid #e5d8fa`,
            }}
         >
            <Logo color="#3b1874" />
         </Stack>

         {/* LIST NAV */}
         <List sx={{ overflowY: `auto`, px: 1.5, py: 2 }}>
            <ListItemButton
               selected={pathname === ROUTER.ADMIN.DASHBOARD}
               onClick={() => {
                  router.push(ROUTER.ADMIN.DASHBOARD);
               }}
               sx={{
                  borderRadius: "12px",
                  mb: 0.8,
                  transition: "all 0.2s ease",
                  color: "#4c3a6b",
                  "&.Mui-selected": {
                     backgroundColor: "#ebdffa",
                     color: "#6c2bd9",
                     borderLeft: "4px solid #8b5cf6",
                     "& .MuiListItemIcon-root": { color: "#8b5cf6" },
                     "& .MuiListItemText-primary": { color: "#5b21b6", fontWeight: 700 },
                  },
                  "&:hover": {
                     backgroundColor: "#f3eefc",
                  },
               }}
            >
               <ListItemIcon sx={{ minWidth: 38, color: "#7c689c" }}>
                  <GridViewRoundedIcon />
               </ListItemIcon>
               <ListItemText primary={`Dashboard`} primaryTypographyProps={{ fontSize: "14px", fontWeight: 500 }} />
            </ListItemButton>

            {LIST_NAV.map((item, index) => {
               return (
                  <Fragment key={index}>
                     <ListItemNav item={item} pl={2} />
                  </Fragment>
               );
            })}
         </List>

         {/* FOOTER NAV */}
         <List sx={{ mt: `auto`, flexShrink: `0`, p: 1.5 }}>
            <Divider sx={{ borderColor: `#e5d8fa`, mb: 1 }} />
            <ListItemButton
               onClick={handleLogout}
               sx={{
                  borderRadius: "12px",
                  color: "#ef4444",
                  "&:hover": {
                     backgroundColor: "#fee2e2",
                  },
               }}
            >
               <ListItemIcon sx={{ minWidth: 38, color: "#ef4444" }}>
                  <LogoutRoundedIcon />
               </ListItemIcon>
               <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: "14px", fontWeight: 600 }} />
            </ListItemButton>
         </List>
      </Stack>
   );
}
