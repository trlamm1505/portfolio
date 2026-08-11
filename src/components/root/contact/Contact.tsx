"use client";

import { Box, Container, Typography, useColorScheme } from "@mui/material";
import FormContact from "./FormContact";
import { styleBoxPage } from "@/common/styles/style-blobal.mui";
import { useEffect, useState } from "react";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import Image from "next/image";

type TProps = {
   dataTextInPage: TResonAction<TTextInPage | null>;
};

export default function Contact({ dataTextInPage }: TProps) {
   const { mode, setMode } = useColorScheme();
   const [isLoaded, setIsLoaded] = useState<boolean>(false);

   useEffect(() => {
      if (mode !== `dark`) {
         setMode(`dark`);
      }

      // Delay entrance animation until page loading overlay finishes (~1.5s)
      const timer = setTimeout(() => {
         setIsLoaded(true);
      }, 1500);

      return () => clearTimeout(timer);
   }, [mode, setMode]);

   const rawTitle = dataTextInPage.data?.title || "Contact / me.";
   const hasSlash = rawTitle.includes("/");
   let titlePart1 = "";
   let titlePart2 = "";
   if (hasSlash) {
      titlePart1 = rawTitle.split("/")[0];
      titlePart2 = rawTitle.split("/")[1];
   } else {
      const lastSpace = rawTitle.lastIndexOf(" ");
      if (lastSpace !== -1) {
         titlePart1 = rawTitle.substring(0, lastSpace);
         titlePart2 = rawTitle.substring(lastSpace + 1);
      } else {
         titlePart1 = rawTitle;
         titlePart2 = "";
      }
   }

   return (
      <Box sx={styleBoxPage}>
         <Container>
            {/* text & form */}
            <Box
               sx={{
                  maxWidth: `700px`,
                  mx: `auto`,
               }}
            >
               {/* Title: animate__fadeInDown */}
               <Typography
                  variant="h1"
                  className={isLoaded ? "animate__animated animate__fadeInDown" : ""}
                  sx={{
                     opacity: isLoaded ? 1 : 0,
                     fontSize: `54px`,
                     fontWeight: `600`,
                     textAlign: `center`,
                     mb: `50px`,
                  }}
               >
                  {titlePart1}{" "}
                  {titlePart2 && (
                     <Box
                        sx={{
                           color: `#b388ff`,
                        }}
                        component={`span`}
                     >
                        {titlePart2}
                     </Box>
                  )}
               </Typography>

               {/* Form container: animate__fadeInUp */}
               <Box
                  className={isLoaded ? "animate__animated animate__fadeInUp" : ""}
                  sx={{
                     opacity: isLoaded ? 1 : 0,
                  }}
               >
                  <FormContact dataTextInPage={dataTextInPage}/>
               </Box>
            </Box>
         </Container>

         {/* Top-Right Corner Splatter Image for Contact Page */}
         <Box
            sx={{
               position: "fixed",
               top: 0,
               right: 0,
               zIndex: 0,
               width: "420px",
               height: "420px",
               transform: "scaleX(-1)",
               pointerEvents: "none",
               mixBlendMode: "color-dodge",
               opacity: 0.9,
               filter: "hue-rotate(250deg) saturate(2) contrast(300%) brightness(1.3)",
               maskImage: "linear-gradient(225deg, black 35%, transparent 75%)",
               WebkitMaskImage: "linear-gradient(225deg, black 35%, transparent 75%)",
            }}
         >
            <Image
               src="/images/layout/top-left.png"
               alt="top-right contact decoration"
               width={450}
               height={450}
               style={{ width: "100%", height: "auto" }}
               priority
            />
         </Box>

         {/* Bottom-Left Corner Decoration for Contact Page */}
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
               alt="bottom-left contact decoration"
               width={680}
               height={680}
               style={{ width: "100%", height: "100%", objectFit: "contain" }}
               priority
            />
         </Box>
      </Box>
   );
}
