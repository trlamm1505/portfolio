import { HEIGHT_HEADER, WIDTH_NAV } from "@/constants/app.constant";
import { Avatar, Box, Chip, Drawer, IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useResponsive from "../hooks/useResponsive";
import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";
import Logo from "../logo/Logo";
import NavAdmin from "../nav/NavAdmin";
import { getCurrentUserAction } from "@/actions/user.action";

export default function HeaderAdmin() {
   const [open, setOpen] = useState(false);
   const [userName, setUserName] = useState<string>("Admin");
   const isMobile = useResponsive("down", "lg");

   useEffect(() => {
      const fetchUser = async () => {
         const u = await getCurrentUserAction();
         if (u.status && u.data?.name) {
            setUserName(u.data.name);
         }
      };
      fetchUser();
   }, []);

   const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
   };

   return (
      <>
         <Box
            sx={{
               display: `flex`,
               alignItems: `center`,
               justifyContent: `space-between`,
               padding: `8px 24px`,
               height: HEIGHT_HEADER,
               position: `fixed`,
               zIndex: `2`,
               top: `0`,
               right: `0`,
               width: {
                  xs: `100vw`,
                  lg: `calc(100vw - ${WIDTH_NAV})`,
               },
               backgroundColor: `rgba(255, 255, 255, 0.85)`,
               borderBottom: `1px solid #e5d8fa`,
               backdropFilter: `blur(12px)`,
               boxShadow: `0 4px 20px rgba(139, 92, 246, 0.05)`,
            }}
            component={`header`}
         >
            {/* LEFT */}
            {isMobile ? (
               <IconButton
                  sx={{
                     display: `inline-flex`,
                     alignItems: `center`,
                     justifyContent: `center`,
                     boxSizing: `border-box`,
                     color: "#5b21b6",
                  }}
                  onClick={toggleDrawer(true)}
               >
                  <DragHandleRoundedIcon />
               </IconButton>
            ) : (
               <Box />
            )}

            {isMobile ? <Logo color="#3b1874" /> : <Box />}

            <Stack sx={{ flexDirection: `row`, alignItems: `center`, gap: `14px` }}>
               <Chip
                  avatar={
                     <Avatar sx={{ bgcolor: "#8b5cf6", color: "#ffffff", fontWeight: 700 }}>
                        {userName.charAt(0).toUpperCase()}
                     </Avatar>
                  }
                  label={userName}
                  variant="outlined"
                  sx={{
                     backgroundColor: "#f3eefc",
                     borderColor: "#d4c2fc",
                     color: "#5b21b6",
                     fontWeight: 600,
                     py: 2,
                     px: 0.5,
                  }}
               />
            </Stack>
         </Box>
         <Drawer open={open} onClose={toggleDrawer(false)} sx={{ backdropFilter: `blur(5px)` }}>
            <NavAdmin />
         </Drawer>
      </>
   );
}
