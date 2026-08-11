"use client";

import ParticlesColors from "@/common/particles/ParticlesColors";
import { styleBoxPage } from "@/common/styles/style-blobal.mui";
import { TProject } from "@/types/respon/project.type";
import { Box, Container, Typography, useColorScheme, IconButton, Stack, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { getMediaUrl, FB_FOLDER_PROJECT } from "@/constants/firebase.constant";

type TProps = {
   dataProjects: TResonAction<TProject[] | null>;
   dataTextInPage: TResonAction<TTextInPage | null>;
};

const slideVariants = {
   enter: (direction: number) => ({
      x: direction > 0 ? 280 : -280,
      opacity: 0,
      scale: 0.97,
   }),
   center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
   },
   exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 280 : -280,
      opacity: 0,
      scale: 0.97,
   }),
};

export default function Project({ dataProjects, dataTextInPage }: TProps) {
   const { mode, setMode } = useColorScheme();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);
   const allProjects = dataProjects.data || [];

   useEffect(() => {
      if (mode !== `dark`) {
         setMode(`dark`);
      }

      // Preload all project images in background so slide navigation is 100% instant
      allProjects.forEach((proj) => {
         const imgUrl = getMediaUrl(FB_FOLDER_PROJECT, proj.img_project_name);
         if (imgUrl && typeof window !== "undefined") {
            const img = new window.Image();
            img.src = imgUrl;
         }
      });

      // Delay entrance animation until page loading overlay finishes (~1.5s)
      const timer = setTimeout(() => {
         setIsLoaded(true);
      }, 1500);

      return () => clearTimeout(timer);
   }, [mode, setMode, allProjects]);

   const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
   const [currentIndex, setCurrentIndex] = useState<number>(0);
   const [slideDirection, setSlideDirection] = useState<number>(1);

   const filteredProjects = allProjects.filter((p) => {
      if (selectedCategory === "ALL") return true;
      if (selectedCategory === "Work Experience") return !p.category || p.category === "Work Experience";
      if (selectedCategory === "Personal Projects") return p.category === "Personal Projects";
      return true;
   });

   const currentProject = filteredProjects[currentIndex];

   const handlePrev = () => {
      if (filteredProjects.length === 0) return;
      setSlideDirection(-1);
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredProjects.length - 1));
   };

   const handleNext = () => {
      if (filteredProjects.length === 0) return;
      setSlideDirection(1);
      setCurrentIndex((prev) => (prev < filteredProjects.length - 1 ? prev + 1 : 0));
   };

   const handleCategoryChange = (cat: string) => {
      setSelectedCategory(cat);
      setSlideDirection(1);
      setCurrentIndex(0);
   };

   return (
      <Box sx={styleBoxPage}>
         <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 5 } }}>
            <Box
               sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "420px 1fr" },
                  gap: { xs: 3, md: 4, lg: 5 },
                  justifyContent: "flex-start",
                  alignItems: "center",
                  minHeight: "70vh",
                  pt: { xs: 1, md: 2 },
                  pb: { xs: 4, md: 6 },
                  mt: { xs: 0, md: -3, lg: -5 },
                  pl: { xs: 0, lg: 5, xl: 7 },
               }}
            >
               {/* LEFT SIDE: Title, Description & Category Filter Tabs */}
               <Box
                  className={isLoaded ? "animate__animated animate__fadeInUp" : ""}
                  sx={{
                     opacity: isLoaded ? 1 : 0,
                     display: "flex",
                     flexDirection: "column",
                     justifyContent: "flex-start",
                     alignSelf: "flex-start",
                     pt: { xs: 0, lg: 2 },
                     pr: { xs: 0, lg: 1 },
                     width: "100%",
                     maxWidth: "420px",
                  }}
               >
                  <Typography
                     variant="h1"
                     sx={{
                        fontSize: { xs: "46px", sm: "54px", lg: "62px" },
                        fontWeight: "800",
                        color: "#ffffff",
                        lineHeight: 1.15,
                        mb: 2.5,
                        letterSpacing: "-1px",
                     }}
                  >
                     My{" "}
                     <Box
                        component="span"
                        sx={{
                           color: "#b388ff",
                           background: "linear-gradient(90deg, #a78bfa 0%, #c4b5fd 100%)",
                           WebkitBackgroundClip: "text",
                           WebkitTextFillColor: "transparent",
                        }}
                     >
                        projects
                     </Box>
                  </Typography>

                  <Typography
                     sx={{
                        color: "rgba(255, 255, 255, 0.76)",
                        fontSize: "16.5px",
                        lineHeight: 1.7,
                        mb: 3.5,
                        maxWidth: "400px",
                     }}
                  >
                     {dataTextInPage.data?.description ||
                        "I have selected and mentioned here some of my projects to share with you."}
                  </Typography>

                  {/* Category Filter Chips (All Purple Theme When Active) */}
                  <Stack direction="row" flexWrap="wrap" gap={1.2} sx={{ maxWidth: "400px" }}>
                     <Chip
                        label="All Projects"
                        onClick={() => handleCategoryChange("ALL")}
                        sx={{
                           px: 2.2,
                           py: 2.4,
                           borderRadius: "14px",
                           fontSize: "15px",
                           fontWeight: 700,
                           cursor: "pointer",
                           backgroundColor:
                              selectedCategory === "ALL" ? "#8b5cf6" : "rgba(255, 255, 255, 0.08)",
                           color: "#ffffff",
                           boxShadow: selectedCategory === "ALL" ? "0 4px 20px rgba(139, 92, 246, 0.45)" : "none",
                           transition: "all 0.25s ease",
                           "&:hover": {
                              backgroundColor:
                                 selectedCategory === "ALL" ? "#7c3aed" : "rgba(255, 255, 255, 0.18)",
                              transform: "translateY(-2px)",
                           },
                        }}
                     />
                     <Chip
                        label="💼 Work Experience"
                        onClick={() => handleCategoryChange("Work Experience")}
                        sx={{
                           px: 2.2,
                           py: 2.4,
                           borderRadius: "14px",
                           fontSize: "15px",
                           fontWeight: 700,
                           cursor: "pointer",
                           backgroundColor:
                              selectedCategory === "Work Experience"
                                 ? "#8b5cf6"
                                 : "rgba(255, 255, 255, 0.08)",
                           color: "#ffffff",
                           boxShadow:
                              selectedCategory === "Work Experience"
                                 ? "0 4px 20px rgba(139, 92, 246, 0.45)"
                                 : "none",
                           transition: "all 0.25s ease",
                           "&:hover": {
                              backgroundColor:
                                 selectedCategory === "Work Experience"
                                    ? "#7c3aed"
                                    : "rgba(255, 255, 255, 0.18)",
                               transform: "translateY(-2px)",
                           },
                        }}
                     />
                     <Chip
                        label="🚀 Personal Projects"
                        onClick={() => handleCategoryChange("Personal Projects")}
                        sx={{
                           px: 2.2,
                           py: 2.4,
                           borderRadius: "14px",
                           fontSize: "15px",
                           fontWeight: 700,
                           cursor: "pointer",
                           backgroundColor:
                              selectedCategory === "Personal Projects"
                                 ? "#8b5cf6"
                                 : "rgba(255, 255, 255, 0.08)",
                           color: "#ffffff",
                           boxShadow:
                              selectedCategory === "Personal Projects"
                                 ? "0 4px 20px rgba(139, 92, 246, 0.45)"
                                 : "none",
                           transition: "all 0.25s ease",
                           "&:hover": {
                              backgroundColor:
                                 selectedCategory === "Personal Projects"
                                    ? "#7c3aed"
                                    : "rgba(255, 255, 255, 0.18)",
                               transform: "translateY(-2px)",
                           },
                        }}
                     />
                  </Stack>
               </Box>

               {/* RIGHT SIDE: Interactive Slider Frame */}
               <Box
                  className={isLoaded ? "animate__animated animate__fadeInDown" : ""}
                  sx={{
                     opacity: isLoaded ? 1 : 0,
                     position: "relative",
                     width: "100%",
                     maxWidth: "880px",
                     ml: { xs: "auto", lg: 0 },
                  }}
               >
                  {filteredProjects.length > 0 && currentProject ? (
                     <Box
                        sx={{
                           position: "relative",
                           width: "100%",
                           "&:hover .nav-arrow": {
                              opacity: 1,
                              transform: "translateY(-50%) scale(1)",
                           },
                        }}
                     >
                        {/* Left Navigation Arrow */}
                        <IconButton
                           className="nav-arrow"
                           onClick={handlePrev}
                           sx={{
                              position: "absolute",
                              left: 12,
                              top: "50%",
                              transform: "translateY(-50%) scale(0.85)",
                              zIndex: 10,
                              opacity: 0,
                              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                              backgroundColor: "rgba(13, 17, 28, 0.75)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(255, 255, 255, 0.25)",
                              color: "#ffffff",
                              width: 32,
                              height: 32,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                              "&:hover": {
                                 backgroundColor: "#8b5cf6",
                                 borderColor: "#8b5cf6",
                                 color: "#ffffff",
                                 transform: "translateY(-50%) scale(1.15) !important",
                              },
                           }}
                        >
                           <ArrowBackIosNewRoundedIcon sx={{ fontSize: 13, ml: "2px" }} />
                        </IconButton>

                        {/* Active Slide Project Item with Directional Sliding Animation */}
                        <Box sx={{ width: "100%", overflow: "hidden", position: "relative" }}>
                           <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                              <motion.div
                                 key={currentProject._id.toString()}
                                 custom={slideDirection}
                                 variants={slideVariants}
                                 initial="enter"
                                 animate="center"
                                 exit="exit"
                                 transition={{
                                    x: { type: "spring", stiffness: 320, damping: 30 },
                                    opacity: { duration: 0.22 },
                                    scale: { duration: 0.22 },
                                 }}
                                 style={{ width: "100%" }}
                              >
                                 <ProjectItem
                                    project={currentProject}
                                    index={currentIndex}
                                 />
                              </motion.div>
                           </AnimatePresence>
                        </Box>

                        {/* Right Navigation Arrow */}
                        <IconButton
                           className="nav-arrow"
                           onClick={handleNext}
                           sx={{
                              position: "absolute",
                              right: 12,
                              top: "50%",
                              transform: "translateY(-50%) scale(0.85)",
                              zIndex: 10,
                              opacity: 0,
                              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                              backgroundColor: "rgba(13, 17, 28, 0.75)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(255, 255, 255, 0.25)",
                              color: "#ffffff",
                              width: 32,
                              height: 32,
                              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                              "&:hover": {
                                 backgroundColor: "#8b5cf6",
                                 borderColor: "#8b5cf6",
                                 color: "#ffffff",
                                 transform: "translateY(-50%) scale(1.15) !important",
                              },
                           }}
                        >
                           <ArrowForwardIosRoundedIcon sx={{ fontSize: 13 }} />
                        </IconButton>

                        {/* Slide Counter at bottom */}
                        <Typography
                           align="center"
                           sx={{
                              mt: 3,
                              color: "rgba(255, 255, 255, 0.8)",
                              fontWeight: 700,
                              fontSize: "16px",
                              letterSpacing: "2.5px",
                           }}
                        >
                           {currentIndex + 1} / {filteredProjects.length}
                        </Typography>
                     </Box>
                  ) : (
                     <Typography color="rgba(255,255,255,0.6)" align="center">
                        Không có dự án nào trong danh mục này.
                     </Typography>
                  )}
               </Box>
            </Box>
         </Container>

         {/* Bottom-Left Corner Decoration specific to Projects page */}
         <Box
            sx={{
               position: "fixed",
               bottom: 0,
               left: 0,
               zIndex: 0,
               width: { xs: "480px", md: "580px", lg: "680px" },
               height: { xs: "480px", md: "580px", lg: "680px" },
               transform: "translate(-32%, 32%)",
               pointerEvents: "none",
               mixBlendMode: "color-dodge",
               opacity: 0.85,
               filter: "hue-rotate(250deg) saturate(1.8) blur(2px)",
            }}
         >
            <Image
               src="/images/home/bg-explosion.png"
               alt="bottom-left project decoration"
               width={680}
               height={680}
               style={{ width: "100%", height: "100%", objectFit: "contain" }}
               priority
            />
         </Box>

         {/* BACKGROUND / PARTICLES*/}
         <Box
            sx={{
               position: "fixed",
               width: "100vw",
               height: "100vh",
               top: "0",
               left: "0",
               zIndex: "-1",
               "& #ParticlesTriangles": {
                  width: "100%",
                  height: "100%",
                  transform: "translateZ(0)",
               },
            }}
         >
            <ParticlesColors />
         </Box>
      </Box>
   );
}
