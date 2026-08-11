"use client";

import { TTextInPage } from "@/types/respon/text-in-page.type";
import { Box, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import CountUp from "react-countup";

type TProps = {
   data: TInfoGitHub;
   dataTextInPage: TResonAction<TTextInPage | null>;
};

export default function Left({ data, dataTextInPage }: TProps) {
   const daysDiff = dayjs().diff(data.created_at, "days");
   const yearsDiff = dayjs().diff(data.created_at, "years");
   const totalRepo = data.public_repos;
   const rawTitle = dataTextInPage.data?.title || "About / me.";
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
      <>
         <Typography
            variant="h1"
            sx={{
               fontSize: `64px`,
               fontWeight: `700`,
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

         <Typography
            sx={{
               color: "rgba(255, 255, 255, 0.75)",
               fontSize: `18px`,
               lineHeight: `1.8`,
               mt: `32px`,
            }}
         >
            {dataTextInPage.data?.description}
         </Typography>

         <Stack
            sx={{
               mt: `60px`,
               flexDirection: `row`,
               alignItems: `stretch`,
               justifyContent: `space-between`,
               flexWrap: `wrap`,
               rowGap: `20px`,
            }}
         >
            {/* YEAR */}
            <Stack gap={`.5rem`}>
               <Typography
                  sx={{
                     color: `#b388ff`,
                     fontSize: `2.75rem`,
                     lineHeight: `3rem`,
                     fontWeight: `800`,
                  }}
               >
                  <CountUp start={0} end={yearsDiff} duration={5} /> +
               </Typography>

               <Typography
                  sx={{
                     fontSize: `.85rem`,
                     letterSpacing: `1px`,
                     lineHeight: `1.4`,
                     fontWeight: `500`,
                     color: `rgba(255, 255, 255, 0.7)`,
                  }}
               >
                  YEARS OF <br /> EXPERIENCE
               </Typography>
            </Stack>

            {/* DIVIDER */}
            <Box>
               <Divider orientation={`vertical`} sx={{ height: `100%` }} />
            </Box>

            {/* DAY */}
            <Stack gap={`.5rem`}>
               <Typography
                  sx={{
                     color: `#b388ff`,
                     fontSize: `2.75rem`,
                     lineHeight: `3rem`,
                     fontWeight: `800`,
                  }}
               >
                  <CountUp start={0} end={daysDiff} duration={5} /> +
               </Typography>

               <Typography
                  sx={{
                     fontSize: `.85rem`,
                     letterSpacing: `1px`,
                     lineHeight: `1.4`,
                     fontWeight: `500`,
                     color: `rgba(255, 255, 255, 0.7)`,
                  }}
               >
                  DAYS OF <br /> EXPERIENCE
               </Typography>
            </Stack>

            {/* DIVIDER */}
            <Box>
               <Divider orientation={`vertical`} sx={{ height: `100%` }} />
            </Box>

            {/* REPO */}
            <Stack gap={`.5rem`}>
               <Typography
                  sx={{
                     color: `#b388ff`,
                     fontSize: `2.75rem`,
                     lineHeight: `3rem`,
                     fontWeight: `800`,
                  }}
               >
                  <CountUp start={0} end={totalRepo} duration={5} /> +
               </Typography>

               <Typography
                  sx={{
                     fontSize: `.85rem`,
                     letterSpacing: `1px`,
                     lineHeight: `1.4`,
                     fontWeight: `500`,
                     color: `rgba(255, 255, 255, 0.7)`,
                  }}
               >
                  TOTAL <br /> REPOSITORIES
               </Typography>
            </Stack>
         </Stack>
      </>
   );
}
