"use client";

import { getMediaUrl, FB_FOLDER_SKILL } from "@/constants/firebase.constant";
import { TCertification } from "@/types/respon/certification.type";
import { TEducation } from "@/types/respon/education.type";
import { TSkill } from "@/types/respon/skill.type";
import { Box, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import Certification from "./Certification";
import Education from "./Education";

type TProps = {
   dataEducations: TResonAction<TEducation[] | null>;
   dataCertification: TResonAction<TCertification[] | null>;
   dataSkills?: TResonAction<TSkill[] | null>;
};

const tabs = [
   { title: "Skills" },
   { title: "Education" },
   { title: "Certifications" },
];

export default function Right({
   dataEducations,
   dataCertification,
   dataSkills,
}: TProps) {
   const [status, setStatus] = useState(0);

   const skillsList = dataSkills?.data || [];

   return (
      <>
         <Stack
            sx={{
               width: `100%`,
               flexDirection: `row`,
               alignItems: `center`,
               gap: `40px`,
               flexWrap: `wrap`,
               borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
               pb: `0px`,
            }}
         >
            {tabs.map((tab, index) => {
               const isActive = status === index;
               return (
                  <Typography
                     key={index}
                     onClick={() => setStatus(index)}
                     sx={{
                        fontSize: `20px`,
                        fontWeight: isActive ? `600` : `500`,
                        cursor: `pointer`,
                        color: isActive ? `#b388ff` : `rgba(255, 255, 255, 0.7)`,
                        position: `relative`,
                        transition: `all 0.25s ease`,
                        pb: `10px`,
                        mb: `-1px`,
                        borderBottom: isActive ? `3px solid #b388ff` : `3px solid transparent`,
                        "&:hover": {
                           color: `#b388ff`,
                        },
                     }}
                  >
                     {tab.title}
                  </Typography>
               );
            })}
         </Stack>

         <Box
            sx={{
               mt: `24px`,
            }}
         >
            {/* Skills Tab */}
            {status === 0 && (
               <Stack gap={`20px`}>
                  {skillsList.length === 0 ? (
                     <Typography sx={{ color: "hsla(0,0%,100%,.6)", fontSize: "16px" }}>
                        No skills added yet.
                     </Typography>
                  ) : (
                     skillsList.map((skillItem) => (
                        <Box key={skillItem._id.toString()}>
                           <Typography
                              sx={{
                                 color: "hsla(0,0%,100%,.6)",
                                 fontSize: `16px`,
                                 fontWeight: `600`,
                              }}
                           >
                              {skillItem.title}
                           </Typography>
                           <Stack
                              sx={{
                                 flexWrap: `wrap`,
                                 mt: `12px`,
                                 flexDirection: `row`,
                                 alignItems: `center`,
                                 gap: `15px`,
                              }}
                           >
                              {skillItem.images?.map((imgName, idx) => {
                                 const imageUrl = getMediaUrl(FB_FOLDER_SKILL, imgName);

                                 if (imageUrl.includes("skillicons.dev")) {
                                    return (
                                       <Box
                                          key={idx}
                                          sx={{
                                             height: "48px",
                                             display: "inline-block",
                                             position: "relative",
                                             transition: "transform 0.2s ease-in-out",
                                             "&:hover": {
                                                transform: "scale(1.03)",
                                             },
                                          }}
                                       >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                             src={imageUrl}
                                             alt="skill-icons"
                                             style={{
                                                height: "48px",
                                                width: "auto",
                                                maxHeight: "48px",
                                                display: "block",
                                             }}
                                          />
                                       </Box>
                                    );
                                 }

                                 return (
                                    <Box
                                       key={idx}
                                       sx={{
                                          width: "50px",
                                          height: "50px",
                                          position: "relative",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          borderRadius: "11px",
                                          overflow: "hidden",
                                          transition: "all 0.2s ease-in-out",
                                          "&:hover": {
                                             transform: "scale(1.15)",
                                          },
                                       }}
                                    >
                                       <Image
                                          src={imageUrl}
                                          alt={imgName}
                                          width={50}
                                          height={50}
                                          style={{
                                             objectFit: "cover",
                                             width: "100%",
                                             height: "100%",
                                             borderRadius: "11px",
                                          }}
                                       />
                                    </Box>
                                 );
                              })}
                           </Stack>
                        </Box>
                     ))
                  )}
               </Stack>
            )}

            {/* Education Tab */}
            {status === 1 && <Education dataEducations={dataEducations} />}

            {/* Certification Tab */}
            {status === 2 && <Certification dataCertification={dataCertification} />}
         </Box>
      </>
   );
}
