import { TEducation } from "@/types/respon/education.type";
import { Box, Stack, Typography } from "@mui/material";

type TProps = {
   dataEducations: TResonAction<TEducation[] | null>;
};

export default function Education({ dataEducations }: TProps) {
   const educations = dataEducations.data || [];

   return (
      <Stack gap={`24px`}>
         {educations.length === 0 ? (
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
               No education entries added yet.
            </Typography>
         ) : (
            educations.map((education) => {
               // Split description into non-empty lines
               const lines = (education.description || "")
                  .split("\n")
                  .map((l) => l.trim())
                  .filter(Boolean);

               const degreeLine = lines[0] || "";
               const yearsLine = lines[1] || "";
               const gpaLine = lines.find((l) => l.toUpperCase().includes("GPA")) || lines[2] || "";
               const otherLines = lines.filter(
                  (l) => l !== degreeLine && l !== yearsLine && l !== gpaLine
               );

               return (
                  <Box
                     key={education._id.toString()}
                     sx={{
                        p: `24px`,
                        borderRadius: `16px`,
                        backgroundColor: `rgba(255, 255, 255, 0.04)`,
                        border: `1px solid rgba(255, 255, 255, 0.08)`,
                        backdropFilter: `blur(10px)`,
                        transition: `all 0.3s ease`,
                        "&:hover": {
                           backgroundColor: `rgba(255, 255, 255, 0.07)`,
                           borderColor: `rgba(179, 136, 255, 0.3)`,
                           transform: `translateY(-2px)`,
                           boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
                        },
                     }}
                  >
                     {/* School / Institution Title */}
                     <Typography
                        variant="h3"
                        sx={{
                           fontSize: `22px`,
                           fontWeight: `700`,
                           color: `#ffffff`,
                           mb: `8px`,
                        }}
                     >
                        {education.title}
                     </Typography>

                     {/* Degree Line */}
                     {degreeLine && (
                        <Typography
                           sx={{
                              fontSize: `17px`,
                              fontWeight: `600`,
                              color: `#b388ff`,
                              mb: `4px`,
                           }}
                        >
                           {degreeLine}
                        </Typography>
                     )}

                     {/* Years Line */}
                     {yearsLine && (
                        <Typography
                           sx={{
                              fontSize: `15px`,
                              color: `rgba(255, 255, 255, 0.65)`,
                              mb: `8px`,
                           }}
                        >
                           {yearsLine}
                        </Typography>
                     )}

                     {/* GPA Line */}
                     {gpaLine && (
                        <Typography
                           sx={{
                              fontSize: `16px`,
                              fontWeight: `700`,
                              color: `#ffffff`,
                              mb: `8px`,
                           }}
                        >
                           {gpaLine.includes(":") ? (
                              <>
                                 {gpaLine.split(":")[0]}:{" "}
                                 <Box component="span" sx={{ color: `#00e676` }}>
                                    {gpaLine.split(":")[1]}
                                 </Box>
                              </>
                           ) : (
                              <Box component="span" sx={{ color: `#00e676` }}>
                                 {gpaLine}
                              </Box>
                           )}
                        </Typography>
                     )}

                     {/* Focus / Description Notes */}
                     {otherLines.map((note, idx) => (
                        <Typography
                           key={idx}
                           sx={{
                              fontSize: `15px`,
                              color: `rgba(255, 255, 255, 0.8)`,
                              lineHeight: `1.6`,
                              mt: `4px`,
                           }}
                        >
                           {note}
                        </Typography>
                     ))}
                  </Box>
               );
            })
         )}
      </Stack>
   );
}
