"use client";

import { useEffect, useState } from "react";
import { Box, Chip, Stack, Typography, Link as MuiLink, CircularProgress } from "@mui/material";
import GlowCard from "./GlowCard";
import Image from "next/image";
import { TProject } from "@/types/respon/project.type";
import { getMediaUrl, FB_FOLDER_LOGO, FB_FOLDER_PROJECT } from "@/constants/firebase.constant";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import TouchAppRoundedIcon from "@mui/icons-material/TouchAppRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import GitHubIcon from "@mui/icons-material/GitHub";

type TProps = {
   project: TProject;
   index: number;
   showFullDirectly?: boolean;
   isAdmin?: boolean;
};

export default function ProjectItem({ project, index, showFullDirectly = false, isAdmin = false }: TProps) {
   const [isFlipped, setIsFlipped] = useState<boolean>(false);
   const [imgLoaded, setImgLoaded] = useState<boolean>(false);

   const logoUrl = getMediaUrl(FB_FOLDER_LOGO, project.img_logo_name);
   const projectImgUrl = getMediaUrl(FB_FOLDER_PROJECT, project.img_project_name);

   useEffect(() => {
      setImgLoaded(false);
   }, [projectImgUrl]);

   const techList = Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
      ? (project.technologies as string)
           .split(",")
           .map((t) => t.trim())
           .filter(Boolean)
      : [];

   // Smart Description Parser: Joins wrapped lines and parses explicit bullets
   const parseDescription = (rawDesc: string) => {
      if (!rawDesc || !rawDesc.trim()) return { summary: "", bullets: [] as string[] };

      const rawLines = rawDesc.split("\n").map((l) => l.trim()).filter(Boolean);
      const isBulletPattern = (line: string) => /^[\s•\-\*\u2022\u25e6\u25aa\u25ab]/.test(line);

      const summaryLines: string[] = [];
      const bullets: string[] = [];
      let currentBullet = "";
      let foundFirstBullet = false;

      for (const line of rawLines) {
         if (isBulletPattern(line)) {
            foundFirstBullet = true;
            if (currentBullet) {
               bullets.push(currentBullet);
            }
            currentBullet = line.replace(/^[\s•\-\*\u2022\u25e6\u25aa\u25ab]+/, "");
         } else {
            if (!foundFirstBullet) {
               summaryLines.push(line);
            } else {
               if (currentBullet) {
                  currentBullet += " " + line;
               } else {
                  summaryLines.push(line);
               }
            }
         }
      }

      if (currentBullet) {
         bullets.push(currentBullet);
      }

      return {
         summary: summaryLines.join(" "),
         bullets: bullets,
      };
   };

   const { summary: firstLine, bullets: bulletLines } = parseDescription(project.description || "");

   const hasImage = Boolean(projectImgUrl && projectImgUrl.trim());
   const githubUrl = project.github_link?.trim() || "";
   const rawDemoUrl = (project.demo_link || project.link)?.trim() || "";
   const demoUrl = (rawDemoUrl !== githubUrl) ? rawDemoUrl : "";
   const hasGithub = Boolean(githubUrl && githubUrl.length > 0);
   const hasDemo = Boolean(demoUrl && demoUrl.length > 0);

   const subtitleChipStyle = {
      backgroundColor: "rgba(167, 139, 250, 0.12)",
      color: "#c4b5fd",
      border: "1px solid rgba(167, 139, 250, 0.35)",
      fontSize: isAdmin ? "11px" : "12px",
      fontWeight: 600,
      borderRadius: "999px",
      height: isAdmin ? "23px" : "26px",
   };

   // Typography & Layout Configuration (Compact when in Admin mode)
   const fixedConfig = isAdmin
      ? {
           padding: { xs: "14px 16px", sm: "18px 20px" },
           gap: "10px",
           logoSize: 42,
           titleSize: { xs: "17px", sm: "19px" },
           subChipSize: { height: "23px", fontSize: "11px" },
           summarySize: { xs: "13px", sm: "13.5px" },
           summaryLineHeight: 1.45,
           bulletSize: { xs: "12px", sm: "12.5px" },
           bulletLineHeight: 1.45,
           bulletMb: "3px",
           spacing: 0.8,
           minHeight: { xs: "280px", sm: "340px" },
        }
      : {
           padding: { xs: "22px 22px", sm: "28px 44px" },
           gap: "14px",
           logoSize: 52,
           titleSize: { xs: "21px", sm: "24px" },
           subChipSize: { height: "27px", fontSize: "12.5px" },
           summarySize: { xs: "14.5px", sm: "15.5px" },
           summaryLineHeight: 1.55,
           bulletSize: { xs: "13.8px", sm: "14.5px" },
           bulletLineHeight: 1.52,
           bulletMb: "4.5px",
           spacing: 1,
           minHeight: { xs: "360px", sm: "460px" },
        };

   // Render Rich Detail Card Helper Function
   const renderDetailCard = (isFlippedView = false) => (
      <Box
         onClick={hasImage ? () => setIsFlipped(!isFlipped) : undefined}
         sx={{
            borderRadius: `20px`,
            overflow: `hidden`,
            backgroundColor: "rgba(13, 17, 28, 0.94)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(167, 139, 250, 0.35)",
            p: fixedConfig.padding,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: fixedConfig.gap,
            boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
            transform: isFlippedView ? "rotateY(180deg)" : "none",
            cursor: hasImage ? "pointer" : "default",
            width: "100%",
            minHeight: fixedConfig.minHeight,
            aspectRatio: { sm: "16 / 10" },
         }}
      >
         {/* HÀNG 1 & 2: Header (Logo + Title & Subtitle Chips 1 hàng, Date Range 1 hàng) */}
         <Stack direction="row" spacing={1.5} alignItems="flex-start">
            {logoUrl && (
               <Box
                  sx={{
                     width: fixedConfig.logoSize,
                     height: fixedConfig.logoSize,
                     borderRadius: "14px",
                     overflow: "hidden",
                     flexShrink: 0,
                     border: "1px solid rgba(255, 255, 255, 0.18)",
                     boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                     position: "relative",
                  }}
               >
                  <Image
                     src={logoUrl}
                     width={fixedConfig.logoSize}
                     height={fixedConfig.logoSize}
                     style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                     alt={project.title || "Logo"}
                  />
               </Box>
            )}

            <Stack spacing={0.3} flex={1}>
               {/* HÀNG 1: Title + Subtitle chips trên cùng 1 hàng */}
               <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                  <Typography
                     variant="h3"
                     sx={{
                        fontSize: fixedConfig.titleSize,
                        fontWeight: 800,
                        color: "#ffffff",
                        lineHeight: 1.25,
                        mr: 1,
                     }}
                  >
                     {project.title}
                  </Typography>

                  {project.company_name && (
                     <Chip
                        label={project.company_name}
                        size="small"
                        sx={{
                           ...subtitleChipStyle,
                           fontSize: fixedConfig.subChipSize.fontSize,
                           height: fixedConfig.subChipSize.height,
                           px: 0.5,
                        }}
                     />
                  )}

                  {project.location && (
                     <Chip
                        label={project.location}
                        size="small"
                        sx={{
                           ...subtitleChipStyle,
                           fontSize: fixedConfig.subChipSize.fontSize,
                           height: fixedConfig.subChipSize.height,
                           px: 0.5,
                        }}
                     />
                  )}
               </Stack>

               {/* HÀNG 2: Ngày tháng (date_range) chiếm 1 hàng riêng */}
               {project.date_range && (
                  <Typography
                     sx={{
                        fontSize: fixedConfig.subChipSize.fontSize,
                        color: "rgba(255, 255, 255, 0.65)",
                        fontWeight: 500,
                     }}
                  >
                     {project.date_range}
                  </Typography>
               )}
            </Stack>
         </Stack>

         {/* NỘI DUNG CHÍNH (Tối đa 10 hàng): Căn giữa 100% chiều dọc cho mọi dự án */}
         <Stack
            spacing={fixedConfig.spacing}
            sx={{
               flex: 1,
               display: "flex",
               flexDirection: "column",
               justifyContent: "center",
               my: "auto",
               overflowY: "auto",
               pr: "4px",
               minHeight: 0,
               "&::-webkit-scrollbar": { width: "4px" },
               "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(167, 139, 250, 0.35)",
                  borderRadius: "4px",
               },
            }}
         >
            {firstLine && (
               <Typography
                  sx={{
                     fontSize: fixedConfig.summarySize,
                     lineHeight: fixedConfig.summaryLineHeight,
                     color: "rgba(255, 255, 255, 0.92)",
                     fontWeight: 400,
                  }}
               >
                  {firstLine}
               </Typography>
            )}

            {bulletLines.length > 0 && (
               <Box component="ul" sx={{ m: 0, pl: "20px", color: "rgba(255, 255, 255, 0.85)" }}>
                  {bulletLines.map((line, lIdx) => (
                     <Box
                        component="li"
                        key={lIdx}
                        sx={{
                           fontSize: fixedConfig.bulletSize,
                           lineHeight: fixedConfig.bulletLineHeight,
                           mb: fixedConfig.bulletMb,
                           color: "rgba(255, 255, 255, 0.85)",
                        }}
                     >
                        {line.replace(/^[\s•\-\*]+/, "")}
                     </Box>
                  ))}
               </Box>
            )}
         </Stack>

         {/* Bottom Row: Tech Stack Chips & Action Link Buttons */}
         <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1.2}
            pt={0.5}
         >
            {/* Tech stack chips */}
            {techList.length > 0 && (
               <Stack direction="row" flexWrap="wrap" gap={0.8}>
                  {techList.map((tech, tIdx) => (
                     <Chip
                        key={tIdx}
                        label={tech}
                        size="small"
                        sx={{
                           backgroundColor: "rgba(167, 139, 250, 0.1)",
                           border: "1px solid rgba(167, 139, 250, 0.25)",
                           color: "#e9d5ff",
                           fontSize: "13px",
                           fontWeight: 600,
                           borderRadius: "999px",
                           px: "5px",
                           py: "3px",
                        }}
                     />
                  ))}
               </Stack>
            )}

            {/* GitHub & Live Demo Action Buttons - Only render existing links */}
            {(hasGithub || hasDemo) && (
               <Stack direction="row" spacing={1.2} alignItems="center">
                  {hasGithub && (
                     <MuiLink
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                           display: "inline-flex",
                           alignItems: "center",
                           gap: "6px",
                           px: "13px",
                           py: "6px",
                           borderRadius: "9px",
                           backgroundColor: "rgba(255, 255, 255, 0.1)",
                           border: "1px solid rgba(255, 255, 255, 0.2)",
                           color: "#ffffff",
                           fontSize: "13px",
                           fontWeight: 600,
                           textDecoration: "none",
                           transition: "all 0.2s ease",
                           "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.22)",
                              transform: "translateY(-1px)",
                              color: "#ffffff",
                           },
                        }}
                     >
                        <GitHubIcon sx={{ fontSize: 17.5 }} />
                        GitHub
                     </MuiLink>
                  )}

                  {hasDemo && (
                     <MuiLink
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                           display: "inline-flex",
                           alignItems: "center",
                           gap: "6px",
                           px: "13px",
                           py: "6px",
                           borderRadius: "9px",
                           backgroundColor: "rgba(139, 92, 246, 0.25)",
                           border: "1px solid rgba(167, 139, 250, 0.5)",
                           color: "#c4b5fd",
                           fontSize: "13px",
                           fontWeight: 700,
                           textDecoration: "none",
                           boxShadow: "0 4px 12px rgba(139, 92, 246, 0.25)",
                           transition: "all 0.2s ease",
                           "&:hover": {
                              backgroundColor: "rgba(139, 92, 246, 0.4)",
                              transform: "translateY(-1px)",
                              color: "#ffffff",
                           },
                        }}
                     >
                        <LaunchRoundedIcon sx={{ fontSize: 17.5 }} />
                        Live Demo
                     </MuiLink>
                  )}
               </Stack>
            )}
         </Stack>
      </Box>
   );

   // IF PROJECT HAS NO IMAGE: Directly render detail card without flip
   if (!hasImage || showFullDirectly) {
      return renderDetailCard(false);
   }

   // MODE WITH IMAGE: Interactive 3D Card Flip Animation (Image Poster <-> Text Content)
   return (
      <Box
         sx={{
            perspective: "1200px",
            width: "100%",
         }}
      >
         <Box
            sx={{
               position: "relative",
               width: "100%",
               transition: "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
               transformStyle: "preserve-3d",
               transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
         >
            {/* FRONT FACE: Show Image Poster */}
            {!isFlipped && (
               <Box
                  onClick={() => setIsFlipped(true)}
                  sx={{
                     borderRadius: `20px`,
                     overflow: `hidden`,
                     border: "1px solid rgba(167, 139, 250, 0.35)",
                     cursor: "pointer",
                     boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                     position: "relative",
                     width: "100%",
                     minHeight: fixedConfig.minHeight,
                     aspectRatio: { sm: "16 / 10" },
                     transition: "transform 0.3s ease, border-color 0.3s ease",
                     "&:hover": {
                        borderColor: "rgba(167, 139, 250, 0.8)",
                     },
                  }}
               >
                  {/* Glassmorphic Pulse Shimmer Skeleton */}
                  {!imgLoaded && (
                     <Box
                        sx={{
                           position: "absolute",
                           top: 0,
                           left: 0,
                           width: "100%",
                           height: "100%",
                           background: "linear-gradient(90deg, rgba(20, 24, 40, 0.95) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(20, 24, 40, 0.95) 100%)",
                           backgroundSize: "200% 100%",
                           animation: "shimmerPulse 1.5s infinite linear",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           zIndex: 1,
                           "@keyframes shimmerPulse": {
                              "0%": { backgroundPosition: "-200% 0" },
                              "100%": { backgroundPosition: "200% 0" },
                           },
                        }}
                     >
                        <CircularProgress size={36} sx={{ color: "#a78bfa" }} />
                     </Box>
                  )}

                  <Image
                     src={projectImgUrl}
                     width={0}
                     height={0}
                     sizes="100vw"
                     onLoadingComplete={() => setImgLoaded(true)}
                     style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                        opacity: imgLoaded ? 1 : 0,
                        transition: "opacity 0.35s ease-in-out",
                     }}
                     alt={project.title || "Project Image"}
                     priority={true}
                  />

                  {/* Hint Badge to Flip Card */}
                  <Chip
                     icon={<TouchAppRoundedIcon sx={{ fontSize: "14px !important", color: "#ffffff !important" }} />}
                     label="Click to view details"
                     size="small"
                     sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        backgroundColor: "rgba(13, 17, 28, 0.85)",
                        backdropFilter: "blur(8px)",
                        color: "#e9d5ff",
                        fontWeight: 600,
                        fontSize: "12px",
                        border: "1px solid rgba(167, 139, 250, 0.4)",
                     }}
                  />
               </Box>
            )}

            {/* BACK FACE: Show full rich info */}
            {isFlipped && renderDetailCard(true)}
         </Box>
      </Box>
   );
 }
