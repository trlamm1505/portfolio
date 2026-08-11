"use client";

import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DrawerTextInPageCreate from "@/common/drawers/DrawerTextInPageCreate";
import DrawerTextInPageEdit from "@/common/drawers/DrawerTextInPageEdit";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography, Grid, Link as MuiLink } from "@mui/material";
import { useState } from "react";
import { URL_FACEBOOK, URL_GITHUB, URL_LINKEDIN, URL_CV } from "@/constants/app.constant";

type TProps = {
   dataTextInPage: TResonAction<TTextInPage[] | null>;
};

export default function TextInPage({ dataTextInPage }: TProps) {
   const [dataTextInPageEdit, setDataTextInPageEdit] = useState<TTextInPage | null>(null);
   const [openDrawerTextInPageEdit, handleDrawerTextInPageEdit] = useDisclosure();
   const [openDrawerTextInPageCreate, handleDrawerTextInPageCreate] = useDisclosure();

   const allItems = dataTextInPage.data || [];
   const socialItems = allItems.filter(
      (item) =>
         item.page.toLowerCase() === "social" ||
         item.page.toLowerCase() === "link" ||
         item.page.toLowerCase() === "header" ||
         item.title.toLowerCase().includes("github") ||
         item.title.toLowerCase().includes("facebook") ||
         item.title.toLowerCase().includes("linkedin") ||
         item.title.toLowerCase().includes("cv") ||
         item.title.toLowerCase().includes("resume")
   );

   const defaultSocials = [
      {
         _id: "default-github",
         title: "GitHub Profile",
         page: "social",
         description: URL_GITHUB,
      },
      {
         _id: "default-facebook",
         title: "Facebook Profile",
         page: "social",
         description: URL_FACEBOOK,
      },
      {
         _id: "default-linkedin",
         title: "LinkedIn Profile",
         page: "social",
         description: URL_LINKEDIN,
      },
      {
         _id: "default-cv",
         title: "CV / Resume Drive",
         page: "social",
         description: URL_CV,
      },
   ];

   const getSocialIcon = (title: string, page: string) => {
      const lower = (title + " " + page).toLowerCase();
      if (lower.includes("github")) return <GitHubIcon sx={{ fontSize: 26, color: "#181717" }} />;
      if (lower.includes("facebook")) return <FacebookIcon sx={{ fontSize: 26, color: "#1877f2" }} />;
      if (lower.includes("linkedin")) return <LinkedInIcon sx={{ fontSize: 26, color: "#0a66c2" }} />;
      if (lower.includes("cv") || lower.includes("resume") || lower.includes("drive"))
         return <DescriptionRoundedIcon sx={{ fontSize: 26, color: "#ea4335" }} />;
      return <LinkRoundedIcon sx={{ fontSize: 26, color: "#8b5cf6" }} />;
   };

   return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
         {/* Header */}
         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="h4" fontWeight="800" color="#3b1874">
                  Text & Social Links Management
               </Typography>
               <Typography variant="body2" color="#634e8c" fontWeight="500">
                  Manage portfolio page titles, descriptions, and dynamic social media links (GitHub, Facebook, LinkedIn, CV).
               </Typography>
            </Box>
            <Button
               onClick={handleDrawerTextInPageCreate.open}
               variant="contained"
               startIcon={<AddRoundedIcon />}
               sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: "14px",
                  background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
                  color: "#ffffff",
                  fontWeight: "700",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(139, 92, 246, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                     background: "linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)",
                     boxShadow: "0 8px 25px rgba(139, 92, 246, 0.5)",
                     transform: "translateY(-1px)",
                  },
               }}
            >
               + Create New Link / Text
            </Button>
         </Stack>

         {/* SECTION 1: Social Media & External Links Panel */}
         <Paper
            elevation={0}
            sx={{
               p: 3.5,
               mb: 4,
               borderRadius: "24px",
               backgroundColor: "#ffffff",
               border: "1px solid #e7ddfa",
               boxShadow: "0 6px 24px rgba(139, 92, 246, 0.06)",
            }}
         >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
               <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                     sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "12px",
                        backgroundColor: "#f3eefc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8b5cf6",
                     }}
                  >
                     <LinkRoundedIcon />
                  </Box>
                  <Box>
                     <Typography variant="h6" fontWeight="800" color="#3b1874">
                        🌐 Social Media & External Links
                     </Typography>
                     <Typography variant="body2" color="#634e8c">
                        View and update your public social URLs dynamically.
                     </Typography>
                  </Box>
               </Stack>

               <Button
                  onClick={handleDrawerTextInPageCreate.open}
                  size="small"
                  variant="outlined"
                  sx={{
                     borderRadius: "10px",
                     borderColor: "#d4c2fc",
                     color: "#7c3aed",
                     fontWeight: 700,
                     textTransform: "none",
                     "&:hover": { borderColor: "#8b5cf6", backgroundColor: "#fcfaff" },
                  }}
               >
                  + Add Social Link
               </Button>
            </Stack>

            <Grid container spacing={2.5}>
               {(socialItems.length > 0 ? socialItems : defaultSocials).map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item._id.toString()}>
                     <Paper
                        elevation={0}
                        sx={{
                           p: 2.5,
                           borderRadius: "18px",
                           backgroundColor: "#faf8ff",
                           border: "1px solid #ebdffd",
                           transition: "all 0.25s ease",
                           "&:hover": {
                              borderColor: "#8b5cf6",
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.12)",
                           },
                        }}
                     >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                           <Box
                              sx={{
                                 width: 44,
                                 height: 44,
                                 borderRadius: "12px",
                                 backgroundColor: "#ffffff",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                 border: "1px solid #f0e6ff",
                              }}
                           >
                              {getSocialIcon(item.title, item.page)}
                           </Box>

                           <IconButton
                              size="small"
                              onClick={() => {
                                 if (item._id.toString().startsWith("default-")) {
                                    handleDrawerTextInPageCreate.open();
                                 } else {
                                    setDataTextInPageEdit(item as TTextInPage);
                                    handleDrawerTextInPageEdit.open();
                                 }
                              }}
                              sx={{
                                 backgroundColor: "#ffffff",
                                 color: "#8b5cf6",
                                 border: "1px solid #ebdffd",
                                 "&:hover": { backgroundColor: "#8b5cf6", color: "#ffffff" },
                              }}
                              title="Edit Link"
                           >
                              <EditRoundedIcon fontSize="small" />
                           </IconButton>
                        </Stack>

                        <Typography variant="subtitle1" fontWeight="800" color="#3b1874" noWrap mb={0.5}>
                           {item.title}
                        </Typography>

                        <MuiLink
                           href={item.description}
                           target="_blank"
                           rel="noopener noreferrer"
                           underline="none"
                           sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              fontSize: "13px",
                              color: "#6c2bd9",
                              fontWeight: 600,
                              wordBreak: "break-all",
                              "&:hover": { color: "#7c3aed" },
                           }}
                        >
                           <Typography
                              variant="body2"
                              sx={{
                                 fontSize: "12.5px",
                                 color: "#6c2bd9",
                                 fontWeight: 600,
                                 overflow: "hidden",
                                 textOverflow: "ellipsis",
                                 whiteSpace: "nowrap",
                                 maxWidth: "180px",
                              }}
                           >
                              {item.description}
                           </Typography>
                           <OpenInNewRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                        </MuiLink>
                     </Paper>
                  </Grid>
               ))}
            </Grid>
         </Paper>

         {/* SECTION 2: Page Titles & Descriptions List */}
         <Typography variant="h6" fontWeight="800" color="#3b1874" mb={2}>
            📄 Page Content & Descriptions ({allItems.length})
         </Typography>

         <Stack gap={3}>
            {allItems.map((textInPage) => {
               return (
                  <Paper
                     key={textInPage._id.toString()}
                     elevation={0}
                     onClick={() => {
                        handleDrawerTextInPageEdit.open();
                        setDataTextInPageEdit(textInPage);
                     }}
                     sx={{
                        p: 3.5,
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e7ddfa",
                        boxShadow: "0 4px 20px rgba(139, 92, 246, 0.04)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                           borderColor: "#8b5cf6",
                           boxShadow: "0 10px 30px rgba(139, 92, 246, 0.12)",
                           transform: "translateY(-2px)",
                        },
                     }}
                  >
                     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Chip
                           label={`Page Route: ${textInPage.page}`}
                           sx={{
                              backgroundColor: "#f3eefc",
                              color: "#6c2bd9",
                              fontWeight: "700",
                              borderRadius: "10px",
                              fontSize: "14px",
                              px: 1,
                           }}
                        />
                        <IconButton
                           size="small"
                           sx={{
                              backgroundColor: "#f3eefc",
                              color: "#8b5cf6",
                              "&:hover": { backgroundColor: "#8b5cf6", color: "#ffffff" },
                           }}
                        >
                           <EditRoundedIcon fontSize="small" />
                        </IconButton>
                     </Stack>

                     <Typography variant="h6" fontWeight="800" color="#3b1874" gutterBottom>
                        {textInPage.title}
                     </Typography>

                     <Typography variant="body1" color="#634e8c" fontWeight="500" sx={{ lineHeight: 1.6 }}>
                        {textInPage.description}
                     </Typography>
                  </Paper>
               );
            })}
         </Stack>

         <DrawerTextInPageCreate
            handleCloseDrawerTextInPageCreate={handleDrawerTextInPageCreate.close}
            openDrawerTextInPageCreate={openDrawerTextInPageCreate}
         />
         {dataTextInPageEdit && (
            <DrawerTextInPageEdit
               dataTextInPageEdit={dataTextInPageEdit}
               handleCloseDrawerTextInPageEdit={handleDrawerTextInPageEdit.close}
               openDrawerTextInPageEdit={openDrawerTextInPageEdit}
            />
         )}
      </Box>
   );
}
