import { TCertification } from "@/types/respon/certification.type";
import { Box, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";

type TProps = {
   dataCertification: TResonAction<TCertification[] | null>;
};

export default function Certification({ dataCertification }: TProps) {
   const certifications = [...(dataCertification.data || [])].sort((a, b) => {
      const timeA = dayjs(a.date).isValid() ? dayjs(a.date).valueOf() : 0;
      const timeB = dayjs(b.date).isValid() ? dayjs(b.date).valueOf() : 0;
      return timeB - timeA;
   });

   return (
      <Stack gap={`20px`}>
         {certifications.length === 0 ? (
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
               No certifications added yet.
            </Typography>
         ) : (
            certifications.map((cert) => {
               // Check if title has multiline or separator for issuer
               const rawTitle = cert.title || "";
               const lines = rawTitle.split("\n").map((l) => l.trim()).filter(Boolean);

               let mainTitle = lines[0] || rawTitle;
               let issuerName = lines[1] || "";

               // Fallback: If no newline, check for " - " or " – "
               if (!issuerName && mainTitle.includes(" – ")) {
                  const parts = mainTitle.split(" – ");
                  mainTitle = parts[0];
                  issuerName = parts.slice(1).join(" – ");
               } else if (!issuerName && mainTitle.includes(" - ")) {
                  const parts = mainTitle.split(" - ");
                  mainTitle = parts[0];
                  issuerName = parts.slice(1).join(" - ");
               }

               // Format date or display string
               const formattedDate = cert.date
                  ? dayjs(cert.date).isValid()
                     ? dayjs(cert.date).format("MM/YYYY")
                     : String(cert.date)
                  : "";

               return (
                  <Box
                     key={cert._id.toString()}
                     component="a"
                     href={cert.link || "#"}
                     target="_blank"
                     rel="noopener noreferrer"
                     sx={{
                        display: `block`,
                        p: `24px`,
                        borderRadius: `16px`,
                        backgroundColor: `rgba(255, 255, 255, 0.04)`,
                        border: `1px solid rgba(255, 255, 255, 0.08)`,
                        backdropFilter: `blur(10px)`,
                        textDecoration: `none`,
                        transition: `all 0.3s ease`,
                        cursor: `pointer`,
                        "&:hover": {
                           backgroundColor: `rgba(255, 255, 255, 0.08)`,
                           borderColor: `rgba(179, 136, 255, 0.4)`,
                           transform: `translateY(-2px)`,
                           boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
                        },
                     }}
                  >
                     {/* Certification Main Title */}
                     <Typography
                        variant="h3"
                        sx={{
                           fontSize: `20px`,
                           fontWeight: `700`,
                           color: `#ffffff`,
                           mb: issuerName || formattedDate ? `6px` : `0`,
                        }}
                     >
                        {mainTitle}
                     </Typography>

                     {/* Issuer Name */}
                     {issuerName && (
                        <Typography
                           sx={{
                              fontSize: `16px`,
                              fontWeight: `600`,
                              color: `#b388ff`,
                              mb: `4px`,
                           }}
                        >
                           {issuerName}
                        </Typography>
                     )}

                     {/* Date / Status */}
                     {formattedDate && (
                        <Typography
                           sx={{
                              fontSize: `14px`,
                              color: `rgba(255, 255, 255, 0.65)`,
                              mt: `4px`,
                           }}
                        >
                           {formattedDate}
                        </Typography>
                     )}
                  </Box>
               );
            })
         )}
      </Stack>
   );
}
