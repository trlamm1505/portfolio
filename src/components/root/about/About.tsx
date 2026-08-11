"use client";

import ParticlesTriangles from "@/common/particles/ParticlesTriangles";
import { styleBoxPage } from "@/common/styles/style-blobal.mui";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import { Box, Container, useColorScheme } from "@mui/material";
import { useEffect, useState } from "react";
import Left from "./Left";
import Right from "./Right";
import { TEducation } from "@/types/respon/education.type";
import { TCertification } from "@/types/respon/certification.type";

import { TSkill } from "@/types/respon/skill.type";

const basePath = `/images/about/`;

type TProps = {
   responInfoGitHubAction: TResonAction<TInfoGitHub>;
   dataTextInPage: TResonAction<TTextInPage | null>;
   dataEducations: TResonAction<TEducation[] | null>;
   dataCertification: TResonAction<TCertification[] | null>;
   dataSkills?: TResonAction<TSkill[] | null>;
};

export default function About({
   responInfoGitHubAction,
   dataTextInPage,
   dataEducations,
   dataCertification,
   dataSkills,
}: TProps) {
   const { data } = responInfoGitHubAction;
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

   return (
      <Box sx={styleBoxPage}>
         <Container>
            <Box
               sx={{
                  display: `grid`,
                  gridTemplateColumns: {
                     xs: `1fr`,
                     lg: `48% 52%`,
                  },
                  gap: {
                     xs: `2.5rem`,
                     lg: `3rem`,
                  },
                  alignItems: `start`,
               }}
            >
               {/* LEFT SIDE: animate__fadeInLeft */}
               <Box
                  className={isLoaded ? "animate__animated animate__fadeInLeft" : ""}
                  sx={{
                     opacity: isLoaded ? 1 : 0,
                     gridColumn: `1`,
                     pr: `20px`,
                     minWidth: `0`,
                     minHeight: `0`,
                  }}
               >
                  <Left data={data} dataTextInPage={dataTextInPage} />
               </Box>

               {/* RIGHT SIDE: animate__fadeInRight */}
               <Box
                  className={isLoaded ? "animate__animated animate__fadeInRight" : ""}
                  sx={{
                     opacity: isLoaded ? 1 : 0,
                     gridColumn: {
                        xs: `1`,
                        lg: `2`,
                     },
                  }}
               >
                  <Right
                     dataEducations={dataEducations}
                     dataCertification={dataCertification}
                     dataSkills={dataSkills}
                  />
               </Box>
            </Box>
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
               "& #ParticlesTriangles": {
                  width: "100%",
                  height: "100%",
                  transform: "translateZ(0)",
               },
            }}
         >
            <ParticlesTriangles />
         </Box>
      </Box>
   );
}
