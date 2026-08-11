"use client";

import DrawerCertificationCreate from "@/common/drawers/DrawerCertificationCreate";
import DrawerCertificationEdit from "@/common/drawers/DrawerCertificationEdit";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TCertification } from "@/types/respon/certification.type";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import { Box, Button, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";

type TProps = {
   dataCertification: TResonAction<TCertification[] | null>;
};

export default function Certification({ dataCertification }: TProps) {
   const [dataCertificationEdit, setDataCertificationEdit] = useState<TCertification | null>(null);
   const [openDrawerCertificationCreate, handleDrawerCertificationCreate] = useDisclosure();
   const [openDrawerCertificationEdit, handleDrawerCertificationEdit] = useDisclosure();

   return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
         {/* Header */}
         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="h4" fontWeight="800" color="#3b1874">
                  Certifications
               </Typography>
               <Typography variant="body2" color="#634e8c" fontWeight="500">
                  Manage your professional certificates, badges, dates, and verification links.
               </Typography>
            </Box>
            <Button
               onClick={handleDrawerCertificationCreate.open}
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
               + Create Certification
            </Button>
         </Stack>

         {/* Items Grid */}
         <Stack gap={3}>
            {dataCertification?.data?.map((cert) => {
               return (
                  <Paper
                     key={cert._id.toString()}
                     elevation={0}
                     onClick={() => {
                        handleDrawerCertificationEdit.open();
                        setDataCertificationEdit(cert);
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
                                 backgroundColor: "#fffbeb",
                                 color: "#f59e0b",
                                 display: "flex",
                                 alignItems: "center",
                              }}
                           >
                              <WorkspacePremiumRoundedIcon />
                           </Box>
                           <Typography variant="h6" fontWeight="800" color="#3b1874">
                              {cert.title}
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

                     <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" mt={1}>
                        <Chip
                           label={`Issued Date: ${dayjs(cert.date).format("DD/MM/YYYY")}`}
                           sx={{
                              backgroundColor: "#f3eefc",
                              color: "#6c2bd9",
                              fontWeight: "600",
                              borderRadius: "10px",
                           }}
                        />

                        {cert.link && (
                           <Button
                              size="small"
                              component="a"
                              href={cert.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              endIcon={<LaunchRoundedIcon sx={{ fontSize: 16 }} />}
                              sx={{
                                 color: "#8b5cf6",
                                 textTransform: "none",
                                 fontWeight: "600",
                                 "&:hover": { textDecoration: "underline" },
                              }}
                           >
                              View Credential
                           </Button>
                        )}
                     </Stack>
                  </Paper>
               );
            })}
         </Stack>

         <DrawerCertificationCreate
            handleCloseDrawerCertificationCreate={handleDrawerCertificationCreate.close}
            openDrawerCertificationCreate={openDrawerCertificationCreate}
         />
         <DrawerCertificationEdit
            dataCertificationEdit={dataCertificationEdit}
            handleCloseDrawerCertificationEdit={handleDrawerCertificationEdit.close}
            openDrawerCertificationEdit={openDrawerCertificationEdit}
         />
      </Box>
   );
}
