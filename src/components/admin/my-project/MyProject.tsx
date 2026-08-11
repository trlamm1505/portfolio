"use client";

import DrawerMyProjectCreate from "@/common/drawers/DrawerMyProjectCreate";
import DrawerMyProjectEdit from "@/common/drawers/DrawerMyProjectEdit";
import ProjectItem from "@/components/root/project/ProjectItem";
import { useDisclosure } from "@/hooks/useDisclosure";
import { TProject, TTypeProject } from "@/types/respon/project.type";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";

type TProps = {
   dataProjects: TResonAction<TProject[] | null>;
   dataTypeProjects: TResonAction<TTypeProject[] | null>;
};

export default function MyProject({ dataProjects, dataTypeProjects }: TProps) {
   const [openDrawerMyProjectCreate, handleDrawerMyProjectCreate] = useDisclosure();
   const [openDrawerMyProjectEdit, handleDrawerMyProjectEdit] = useDisclosure();
   const [dataMyProjectEdit, setDataMyProjectEdit] = useState<TProject | null>(null);

   const allProjects = dataProjects.data || [];
   const workProjects = allProjects.filter(
      (p) => !p.category || p.category === "Work Experience"
   );
   const personalProjects = allProjects.filter(
      (p) => p.category === "Personal Projects"
   );

   const renderAdminCard = (project: TProject, index: number) => (
      <Box
         key={project._id.toString()}
         sx={{
            position: "relative",
            width: "100%",
            minWidth: 0,
            transition: "all 0.3s ease",
            "&:hover .admin-edit-badge": {
               opacity: 1,
               transform: "translateY(0) scale(1)",
            },
         }}
      >
         {/* Hover Edit Action Button */}
         <Button
            className="admin-edit-badge"
            onClick={(e) => {
               e.stopPropagation();
               setDataMyProjectEdit(project);
               handleDrawerMyProjectEdit.open();
            }}
            startIcon={<EditRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
               position: "absolute",
               top: 14,
               right: 14,
               zIndex: 20,
               opacity: 0,
               transform: "translateY(-6px) scale(0.92)",
               transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
               background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
               color: "#ffffff",
               fontWeight: "700",
               fontSize: "13px",
               textTransform: "none",
               borderRadius: "12px",
               px: 2,
               py: 0.8,
               boxShadow: "0 8px 25px rgba(139, 92, 246, 0.5)",
               border: "1px solid rgba(255, 255, 255, 0.3)",
               cursor: "pointer",
               "&:hover": {
                  background: "linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)",
                  transform: "scale(1.05) !important",
                  boxShadow: "0 10px 30px rgba(124, 58, 237, 0.7)",
               },
            }}
         >
            Edit Project
         </Button>

         {/* Compact Admin Card View with 3D Flip */}
         <ProjectItem project={project} index={index} isAdmin={true} />
      </Box>
   );

   return (
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: "100%", overflowX: "hidden" }}>
         {/* Header */}
         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
               <Typography variant="h4" fontWeight="800" color="#3b1874">
                  My Projects
               </Typography>
               <Typography variant="body2" color="#634e8c" fontWeight="500">
                  Manage your Work Experience and Personal Projects. Hover over any card to edit.
               </Typography>
            </Box>
            <Button
               onClick={handleDrawerMyProjectCreate.open}
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
               + Create Project
            </Button>
         </Stack>

         {/* SECTION 1: Work Experience */}
         <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="700" color="#221638" mb={2}>
               💼 Work Experience ({workProjects.length})
            </Typography>
            <Box
               sx={{
                  display: `grid`,
                  gridTemplateColumns: {
                     xs: `1fr`,
                     lg: `repeat(2, 1fr)`,
                  },
                  gap: `24px`,
                  width: "100%",
               }}
            >
               {workProjects.map((project, index) => renderAdminCard(project, index))}
            </Box>
         </Box>

         {/* SECTION 2: Personal Projects */}
         <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="700" color="#221638" mb={2}>
               🚀 Personal Projects ({personalProjects.length})
            </Typography>
            <Box
               sx={{
                  display: `grid`,
                  gridTemplateColumns: {
                     xs: `1fr`,
                     lg: `repeat(2, 1fr)`,
                  },
                  gap: `24px`,
                  width: "100%",
               }}
            >
               {personalProjects.map((project, index) => renderAdminCard(project, index))}
            </Box>
         </Box>

         <DrawerMyProjectCreate
            handleCloseDrawerMyProjectCreate={handleDrawerMyProjectCreate.close}
            openDrawerMyProjectCreate={openDrawerMyProjectCreate}
            dataTypeProjects={dataTypeProjects}
         />
         {dataMyProjectEdit && (
            <DrawerMyProjectEdit
               handleCloseDrawerMyProjectEdit={handleDrawerMyProjectEdit.close}
               openDrawerMyProjectEdit={openDrawerMyProjectEdit}
               dataMyProjectEdit={dataMyProjectEdit}
               dataTypeProjects={dataTypeProjects}
            />
         )}
      </Box>
   );
}
