"use client";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTER } from "@/constants/router.constant";
import { useEffect, useState } from "react";
import { getProjectsAction } from "@/actions/project.action";
import { getSkillsAction } from "@/actions/skill.action";
import { getCertificationAction } from "@/actions/certification.action";
import { getContractsAction } from "@/actions/contract.action";
import { getCurrentUserAction } from "@/actions/user.action";

export default function Dashboard() {
   const router = useRouter();
   const [userName, setUserName] = useState<string>("Admin");
   const [stats, setStats] = useState({
      projects: 0,
      skills: 0,
      certifications: 0,
      contracts: 0,
   });

   useEffect(() => {
      const loadStatsAndUser = async () => {
         const [p, s, c, m, u] = await Promise.all([
            getProjectsAction(),
            getSkillsAction(),
            getCertificationAction(),
            getContractsAction(),
            getCurrentUserAction(),
         ]);
         setStats({
            projects: p.status && p.data ? p.data.length : 0,
            skills: s.status && s.data ? s.data.length : 0,
            certifications: c.status && c.data ? c.data.length : 0,
            contracts: m.status && m.data ? m.data.length : 0,
         });
         if (u.status && u.data?.name) {
            setUserName(u.data.name);
         }
      };
      loadStatsAndUser();
   }, []);

   const statCards = [
      {
         title: "Total Projects",
         count: stats.projects,
         icon: <AssignmentIcon sx={{ fontSize: 30, color: "#8b5cf6" }} />,
         path: ROUTER.ADMIN.MY_PROJECT,
         color: "#f3eefc",
      },
      {
         title: "Skills & Tech",
         count: stats.skills,
         icon: <CodeRoundedIcon sx={{ fontSize: 30, color: "#10b981" }} />,
         path: ROUTER.ADMIN.SKILL,
         color: "#ecfdf5",
      },
      {
         title: "Certifications",
         count: stats.certifications,
         icon: <WorkspacePremiumRoundedIcon sx={{ fontSize: 30, color: "#f59e0b" }} />,
         path: ROUTER.ADMIN.CERTIFICATION,
         color: "#fffbeb",
      },
      {
         title: "Contact Messages",
         count: stats.contracts,
         icon: <EmailRoundedIcon sx={{ fontSize: 30, color: "#06b6d4" }} />,
         path: ROUTER.ADMIN.CONTRACT,
         color: "#ecfeff",
      },
   ];

   return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
         {/* Welcome Banner */}
         <Paper
            elevation={0}
            sx={{
               p: { xs: 3, sm: 4 },
               mb: 4,
               borderRadius: "24px",
               background: "linear-gradient(135deg, #eaddfc 0%, #ffffff 100%)",
               border: "1px solid #dcd0f7",
               boxShadow: "0 10px 30px rgba(139, 92, 246, 0.08)",
            }}
         >
            <Typography variant="h4" fontWeight="800" color="#3b1874" gutterBottom>
               Welcome back, {userName} 👋
            </Typography>
            <Typography variant="body1" color="#634e8c" maxWidth="600px" fontWeight="500">
               Manage your portfolio content, projects, skills, certifications, and customer messages seamlessly in real-time.
            </Typography>
         </Paper>

         {/* Stat Cards Grid */}
         <Grid container spacing={3} mb={4}>
            {statCards.map((card, idx) => (
               <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Paper
                     elevation={0}
                     onClick={() => router.push(card.path)}
                     sx={{
                        p: 3,
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #e7ddfa",
                        boxShadow: "0 4px 15px rgba(139, 92, 246, 0.04)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                           backgroundColor: "#ffffff",
                           borderColor: "#8b5cf6",
                           transform: "translateY(-4px)",
                           boxShadow: "0 12px 30px rgba(139, 92, 246, 0.15)",
                        },
                     }}
                  >
                     <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box
                           sx={{
                              p: 1.5,
                              borderRadius: "14px",
                              backgroundColor: card.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                           }}
                        >
                           {card.icon}
                        </Box>
                        <Typography variant="h3" fontWeight="800" color="#221638">
                           {card.count}
                        </Typography>
                     </Stack>
                     <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="#634e8c" fontWeight="600">
                           {card.title}
                        </Typography>
                        <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: "#8b5cf6" }} />
                     </Stack>
                  </Paper>
               </Grid>
            ))}
         </Grid>

         {/* Quick Navigation Panel */}
         <Paper
            elevation={0}
            sx={{
               p: 3.5,
               borderRadius: "20px",
               backgroundColor: "#ffffff",
               border: "1px solid #e7ddfa",
               boxShadow: "0 4px 15px rgba(139, 92, 246, 0.04)",
            }}
         >
            <Typography variant="h6" fontWeight="800" color="#3b1874" mb={2.5}>
               Quick Actions
            </Typography>
            <Grid container spacing={2}>
               <Grid item xs={12} sm={4}>
                  <Button
                     fullWidth
                     variant="outlined"
                     onClick={() => router.push(ROUTER.ADMIN.MY_PROJECT)}
                     sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        borderColor: "#d4c2fc",
                        backgroundColor: "#f3eefc",
                        color: "#6c2bd9",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "15px",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: "#8b5cf6", backgroundColor: "#8b5cf6", color: "#ffffff" },
                     }}
                  >
                     + Add New Project
                  </Button>
               </Grid>
               <Grid item xs={12} sm={4}>
                  <Button
                     fullWidth
                     variant="outlined"
                     onClick={() => router.push(ROUTER.ADMIN.SKILL)}
                     sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        borderColor: "#d4c2fc",
                        backgroundColor: "#f3eefc",
                        color: "#6c2bd9",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "15px",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: "#8b5cf6", backgroundColor: "#8b5cf6", color: "#ffffff" },
                     }}
                  >
                     + Add New Skill
                  </Button>
               </Grid>
               <Grid item xs={12} sm={4}>
                  <Button
                     fullWidth
                     variant="outlined"
                     onClick={() => router.push(ROUTER.ADMIN.TEXT_IN_PAGE)}
                     sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        borderColor: "#d4c2fc",
                        backgroundColor: "#f3eefc",
                        color: "#6c2bd9",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "15px",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: "#8b5cf6", backgroundColor: "#8b5cf6", color: "#ffffff" },
                     }}
                  >
                     Edit Page Texts
                  </Button>
               </Grid>
            </Grid>
         </Paper>
      </Box>
   );
}
