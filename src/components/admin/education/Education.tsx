"use client";

import DrawerEducationCreate from "@/common/drawers/DrawerEducationCreate";
import DrawerEducationEdit from "@/common/drawers/DrawerEducationEdit";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TEducation } from "@/types/respon/education.type";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";

type TProps = {
   dataEducations: TResonAction<TEducation[] | null>;
};

export default function Education({ dataEducations }: TProps) {
   const [dataEducationEdit, setDataEducationEdit] = useState<TEducation | null>(null);
   const [openDrawerEducationCreate, handleDrawerEducationCreate] = useDisclosure();
   const [openDrawerEducationEdit, handleDrawerEducationEdit] = useDisclosure();

   return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
         {/* Header */}
         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="h4" fontWeight="800" color="#3b1874">
                  Education & Experience
               </Typography>
               <Typography variant="body2" color="#634e8c" fontWeight="500">
                  Manage your academic degrees, university background, timeline years, and achievements.
               </Typography>
            </Box>
            <Button
               onClick={handleDrawerEducationCreate.open}
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
               + Create Education
            </Button>
         </Stack>

         {/* Items List */}
         <Stack gap={3}>
            {dataEducations.data?.map((education) => {
               return (
                  <Paper
                     key={education._id.toString()}
                     elevation={0}
                     onClick={() => {
                        handleDrawerEducationEdit.open();
                        setDataEducationEdit(education);
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
                        <Stack direction="row" alignItems="center" gap={1.5}>
                           <Box
                              sx={{
                                 p: 1.2,
                                 borderRadius: "12px",
                                 backgroundColor: "#f3eefc",
                                 color: "#8b5cf6",
                                 display: "flex",
                                 alignItems: "center",
                              }}
                           >
                              <SchoolRoundedIcon />
                           </Box>
                           <Typography variant="h6" fontWeight="800" color="#3b1874">
                              {education.title}
                           </Typography>
                        </Stack>

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



                     <Typography variant="body1" color="#634e8c" fontWeight="500" sx={{ lineHeight: 1.6 }}>
                        {education.description}
                     </Typography>
                  </Paper>
               );
            })}
         </Stack>

         <DrawerEducationCreate
            handleCloseDrawerEducationCreate={handleDrawerEducationCreate.close}
            openDrawerEducationCreate={openDrawerEducationCreate}
         />
         {dataEducationEdit && (
            <DrawerEducationEdit
               dataEducationEdit={dataEducationEdit}
               handleCloseDrawerEducationEdit={handleDrawerEducationEdit.close}
               openDrawerEducationEdit={openDrawerEducationEdit}
            />
         )}
      </Box>
   );
}
