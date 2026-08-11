"use client";

import { letterVariant, sentenceVariant } from "@/common/framer-motion/animationVariants";
import ParticlesLinks from "@/common/particles/ParticlesLinks";
import { styleBoxPage } from "@/common/styles/style-blobal.mui";
import { URL_CV } from "@/constants/app.constant";
import { effectText } from "@/helpers/motion.helper";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import { Box, Button, Container, Stack, Typography, useColorScheme } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTextInPageAction } from "@/actions/title-in-page.action";

const basePath = `/images/home/`;

type TProps = {
   dataTextInPage: TResonAction<TTextInPage | null>;
   allTextInPage?: TResonAction<TTextInPage[] | null>;
};

export default function Home({ dataTextInPage, allTextInPage }: TProps) {
   const { mode, setMode } = useColorScheme();
   const [dynamicCvUrl, setDynamicCvUrl] = useState<string>(URL_CV);

   useEffect(() => {
      if (mode !== `dark`) {
         setMode(`dark`);
      }

      // 1. Try resolving CV URL from initial server props
      const initialItems = allTextInPage?.data || [];
      const initialCvItem = initialItems.find(
         (i) =>
            i.title.toLowerCase().includes("cv") ||
            i.title.toLowerCase().includes("resume") ||
            i.page.toLowerCase().includes("cv")
      );
      if (initialCvItem && initialCvItem.description?.trim()) {
         setDynamicCvUrl(initialCvItem.description.trim());
      }

      // 2. Fetch latest from database to ensure fresh link
      getTextInPageAction().then((res) => {
         if (res.status && res.data) {
            const items = res.data;
            const cvItem = items.find(
               (i) =>
                  i.title.toLowerCase().includes("cv") ||
                  i.title.toLowerCase().includes("resume") ||
                  i.page.toLowerCase().includes("cv")
            );
            if (cvItem && cvItem.description?.trim()) {
               setDynamicCvUrl(cvItem.description.trim());
            }
         }
      });
   }, [mode, setMode, allTextInPage]);

   const handleDownloadCv = () => {
      window.open(dynamicCvUrl, "_blank");
   };

   console.log(dataTextInPage);

   return (
      <Box sx={{ ...styleBoxPage, pt: `90px` }}>
         <Container>
            <Stack
               sx={{
                  alignItems: "center",
                  textAlign: "center",
               }}
            >
               <Typography variant="h1">
                  {effectText(`Hi, I am`, {
                     overflow: `hidden`,
                     whiteSpace: `pre`,
                     fontSize: "1.5rem",
                     lineHeight: "2",
                     color: "rgba(255, 255, 255, 0.85)",
                     fontWeight: "500",
                     fontFamily: `var(--font-sora)`,
                     marginRight: `10px`,
                  })}
                  <motion.span
                     style={{
                        WebkitTextFillColor: "transparent",
                        fontSize: "1.5rem",
                        lineHeight: "2",
                        fontWeight: "800",
                        background:
                           "linear-gradient(90deg, #e040fb 0%, #b388ff 50%, #ffffff 100%) 0% 0% / 200% text",
                        filter: "drop-shadow(0px 2px 10px rgba(224, 64, 251, 0.6))",
                     }}
                     animate={{
                        backgroundPosition: ["0%", "100%"],
                     }}
                     transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "reverse",
                     }}
                  >
                     TRAN QUOC LAM
                  </motion.span>
               </Typography>

               {(() => {
                  const rawTitle = dataTextInPage.data?.title || "Front End - Back End / Web & Mobile Developer";
                  const hasSlash = rawTitle.includes("/");
                  let line1 = "";
                  let line2 = "";

                  if (hasSlash) {
                     line1 = rawTitle.split("/")[0].trim();
                     line2 = rawTitle.split("/")[1]?.trim() || "";
                  } else if (rawTitle.includes("Web")) {
                     const idx = rawTitle.indexOf("Web");
                     line1 = rawTitle.substring(0, idx).trim();
                     line2 = rawTitle.substring(idx).trim();
                  } else {
                     line1 = rawTitle;
                  }

                  return (
                     <Typography
                        variant="h2"
                        sx={{
                           color: "#ffffff",
                           filter:
                              "drop-shadow(0px 3px 12px rgba(0, 0, 0, 0.8)) drop-shadow(0px 0px 20px rgba(179, 136, 255, 0.45))",
                        }}
                     >
                        {effectText(line1, {
                           overflow: `hidden`,
                           marginTop: "1.25rem",
                           fontSize: "52px",
                           lineHeight: "1.25",
                           fontWeight: "700",
                           color: "#ffffff",
                        })}

                        {line2 && <br />}

                        {line2 &&
                           effectText(line2, {
                              overflow: `hidden`,
                              marginTop: "1.25rem",
                              fontSize: "52px",
                              lineHeight: "1.25",
                              fontWeight: "700",
                              color: "#ffffff",
                           })}
                     </Typography>
                  );
               })()}

               {effectText(dataTextInPage.data?.description || ``, {
                  overflow: `hidden`,
                  marginTop: "2rem",
                  lineHeight: "1.8",
                  fontSize: "19px",
                  fontWeight: "300",
                  maxWidth: "46rem",
                  color: "hsla(0,0%,100%,.85)",
                  filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.8))",
               })}

               <Button
                  onClick={handleDownloadCv}
                  variant="contained"
                  size="large"
                  sx={{
                     "mt": "3rem",
                     "px": "34px",
                     "py": "14px",
                     "height": "56px",
                     "fontSize": "18px",
                     "fontWeight": "600",
                     "filter": "drop-shadow(0px 4px 15px rgba(179, 136, 255, 0.5))",
                     "borderRadius": "999999px",
                     "textTransform": "capitalize",
                     "color": "white",
                     "transition": "all 0.3s ease-in-out",
                     "background":
                        "linear-gradient(60deg, #7c4dff 0%, #b388ff 50%, #d1c4e9 100%)",
                     "&:active": {
                        transform: "translateY(1px)",
                     },
                     "&:hover": {
                        background:
                           "linear-gradient(60deg, #651fff 0%, #7c4dff 50%, #b388ff 100%)",
                        transform: "scale(1.05)",
                     },
                  }}
               >
                  <Box
                     component="span"
                     sx={{
                        display: "inline-block",
                        transition: "all 0.3s ease-in-out",
                        animation: "text-pulse-scale 2s ease-in-out infinite",
                     }}
                  >
                     Download CV
                  </Box>
                  <DownloadRoundedIcon
                     sx={{
                        ml: "12px",
                        fontSize: "26px",
                        animation: "slide-top-bottom 2s ease-in-out infinite",
                     }}
                  />
               </Button>

               <motion.div
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                     duration: 1.0,
                     ease: [0.22, 1, 0.36, 1],
                     delay: 1.8,
                  }}
               >
                  <Box
                     sx={{
                        "mt": "1.75rem",
                        "position": "relative",
                        "&:hover svg": {
                           animation: "slide-left-right 1s forwards",
                        },
                     }}
                  >
                     <Image
                        src={`${basePath}circle-star.svg`}
                        width={200}
                        height={203}
                        alt="circle-start.svg"
                        priority={true}
                     />
                     <Link
                        href={"/project"}
                        style={{
                           position: "absolute",
                           top: "0",
                           left: "0",
                           width: "100%",
                           height: "100%",
                           display: "flex",
                           justifyContent: "center",
                           alignItems: "center",
                        }}
                     >
                        <Image
                           src={`${basePath}rounded-text.png`}
                           width={150}
                           height={155}
                           alt="rounded-text.png"
                           priority={true}
                           style={{
                              animation: "spin 5s linear infinite",
                              position: "absolute",
                           }}
                        />

                        <KeyboardDoubleArrowRightRoundedIcon
                           sx={{
                              color: "white",
                              fontSize: "52px",
                           }}
                        />
                     </Link>
                  </Box>
               </motion.div>
            </Stack>
         </Container>

         {/* BACKGROUND / PARTICLES*/}
         <Box
            sx={{
               "position": "fixed",
               "width": "100vw",
               "height": "100vh",
               "top": "0",
               "left": "0",
               "zIndex": "-1",
               "& #ParticlesLinks": {
                  width: "100%",
                  height: "100%",
                  transform: "translateZ(0)",
               },
            }}
         >
            <Image
               fill
               src={`${basePath}bg-explosion.png`}
               alt={`bg-explosion.png`}
               priority
               style={{
                  verticalAlign: "middle",
                  position: "absolute",
                  objectFit: "cover",
                  transform: "scale(1.15) translateY(-20px)",
                  opacity: ".65",
                  mixBlendMode: "color-dodge",
                  filter: "hue-rotate(220deg) saturate(1.4) blur(4px)",
               }}
            />

            {/* PARTICLES */}
            <ParticlesLinks />
         </Box>
      </Box>
   );
}
