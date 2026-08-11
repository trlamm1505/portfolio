"use client";

import CardBody from "@/common/card/CardBody";
import CardContainer from "@/common/card/CardContainer";
import CardHeader from "@/common/card/CardHeader";
import DrawerSkillCreate from "@/common/drawers/DrawerSkillCreate";
import DrawerSkillEdit from "@/common/drawers/DrawerSkillEdit";
import { getMediaUrl, FB_FOLDER_SKILL } from "@/constants/firebase.constant";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TSkill } from "@/types/respon/skill.type";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

type TProps = {
   dataSkills: TResonAction<TSkill[] | null>;
};

export default function Skill({ dataSkills }: TProps) {
   const [dataSkillEdit, setDataSkillEdit] = useState<TSkill | null>(null);
   const [openDrawerSkillCreate, handleDrawerSkillCreate] = useDisclosure();
   const [openDrawerSkillEdit, handleDrawerSkillEdit] = useDisclosure();

   return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
         {/* Header */}
         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="h4" fontWeight="800" color="#3b1874">
                  Skills & Tech Stack
               </Typography>
               <Typography variant="body2" color="#634e8c" fontWeight="500">
                  Manage your programming languages, frameworks, deployment tools, and software icons.
               </Typography>
            </Box>
            <Button
               onClick={handleDrawerSkillCreate.open}
               variant="contained"
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
               + Create Skill
            </Button>
         </Stack>

         {/* Skills Cards Grid */}
         <Stack gap={3}>
            {dataSkills?.data?.map((skill) => {
               return (
                  <Paper
                     key={skill._id.toString()}
                     elevation={0}
                     onClick={() => {
                        setDataSkillEdit(skill);
                        handleDrawerSkillEdit.open();
                     }}
                     sx={{
                        p: 3,
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
                        <Typography sx={{ fontSize: "20px", fontWeight: "700", color: "#3b1874" }}>
                           {skill.title}
                        </Typography>
                        <Box
                           sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: "99px",
                              backgroundColor: "#f3eefc",
                              color: "#6c2bd9",
                              fontSize: "13px",
                              fontWeight: "600",
                           }}
                        >
                           Click to edit
                        </Box>
                     </Stack>

                     <Stack direction="row" alignItems="center" gap="14px" flexWrap="wrap">
                        {skill.images?.map((imgName, index) => {
                           const imageUrl = getMediaUrl(FB_FOLDER_SKILL, imgName);

                           return (
                              <Box
                                 key={index}
                                 sx={{
                                    p: 1,
                                    borderRadius: "14px",
                                    backgroundColor: "#f9f7fe",
                                    border: "1px solid #efe8fa",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "transform 0.2s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                 }}
                              >
                                 {imageUrl.includes("skillicons.dev") ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                       src={imageUrl}
                                       alt={`skill-icon-${index}`}
                                       style={{ height: "46px", width: "auto", display: "block" }}
                                    />
                                 ) : (
                                    <Image
                                       src={imageUrl}
                                       alt={`skill-icon-${index}`}
                                       width={46}
                                       height={46}
                                       style={{ objectFit: "contain", borderRadius: "10px" }}
                                    />
                                 )}
                              </Box>
                           );
                        })}
                     </Stack>
                  </Paper>
               );
            })}
         </Stack>

         <DrawerSkillCreate
            handleCloseDrawerSkillCreate={handleDrawerSkillCreate.close}
            openDrawerSkillCreate={openDrawerSkillCreate}
         />

         <DrawerSkillEdit
            dataSkillEdit={dataSkillEdit}
            handleCloseDrawerSkillEdit={handleDrawerSkillEdit.close}
            openDrawerSkillEdit={openDrawerSkillEdit}
         />
      </Box>
   );
}
