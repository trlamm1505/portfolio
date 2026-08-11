"use client";

import { sendMailAction } from "@/actions/contract.action";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Divider, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   dataTextInPage: TResonAction<TTextInPage | null>;
};

function FormContact({ dataTextInPage }: TProps) {
   const [loading, setLoading] = useState<boolean>(false);

   const contactForm = useFormik({
      initialValues: {
         name: ``,
         email: ``,
         subject: ``,
         message: ``,
      },
      validationSchema: Yup.object().shape({
         name: Yup.string().trim().required(`Name is required`),
         email: Yup.string()
            .trim()
            .required("Email is required.")
            .email("Invalid email. Please try again."),
         subject: Yup.string().trim(),
         message: Yup.string().trim().required("Message is required."),
      }),
      onSubmit: async (valuesRaw) => {
         setLoading(true);
         const result = await sendMailAction({
            value: valuesRaw,
            emailMe: dataTextInPage.data?.description.split(`/`)[1] || `vulebaolong@gmail.com`,
         });
         setLoading(false);

         if (result.status) {
            toast.success(`Thank you for reaching out! We'll get back to you shortly.`);
            contactForm.resetForm();
         } else {
            toast.warning(`Sorry, the system is under maintenance, please try again later`);
         }
      },
   });

   const phoneInfo = dataTextInPage.data?.description?.split(`/`)[0] || "";
   const emailInfo = dataTextInPage.data?.description?.split(`/`)[1] || "";

   return (
      <Stack component="form" autoComplete="off" onSubmit={contactForm.handleSubmit} rowGap={2.5}>
         {/* Row 1: Side-by-side Name & Email */}
         <Stack direction={{ xs: "column", sm: "row" }} gap="20px">
            <TextField
               fullWidth
               autoComplete="name"
               label="name"
               name="name"
               value={contactForm.values.name}
               onChange={contactForm.handleChange}
               error={contactForm.touched.name && contactForm.errors.name !== undefined}
               helperText={contactForm.touched.name && contactForm.errors.name}
               variant="outlined"
            />
            <TextField
               fullWidth
               autoComplete="email"
               label="email"
               name="email"
               value={contactForm.values.email}
               onChange={contactForm.handleChange}
               error={contactForm.touched.email && contactForm.errors.email !== undefined}
               helperText={contactForm.touched.email && contactForm.errors.email}
               variant="outlined"
            />
         </Stack>

         {/* Row 2: Subject */}
         <TextField
            fullWidth
            autoComplete="subject"
            label="subject"
            name="subject"
            value={contactForm.values.subject}
            onChange={contactForm.handleChange}
            error={contactForm.touched.subject && contactForm.errors.subject !== undefined}
            helperText={contactForm.touched.subject && contactForm.errors.subject}
            variant="outlined"
         />

         {/* Row 3: Message Textarea */}
         <TextField
            fullWidth
            multiline
            rows={8}
            autoComplete="message"
            label="message"
            name="message"
            value={contactForm.values.message}
            onChange={contactForm.handleChange}
            error={contactForm.touched.message && contactForm.errors.message !== undefined}
            helperText={contactForm.touched.message && contactForm.errors.message}
            variant="outlined"
         />

         {/* Row 4: Submit Button & Contact Details */}
         <Stack
            sx={{
               flexDirection: {
                  xs: `column`,
                  sm: `row`,
               },
               alignItems: { xs: `stretch`, sm: `center` },
               gap: `20px`,
               mt: `10px`,
            }}
         >
            <LoadingButton
               onClick={() => contactForm.handleSubmit()}
               loading={loading}
               loadingPosition="end"
               endIcon={<SendRoundedIcon sx={{ fontSize: `16px !important` }} />}
               variant="outlined"
               size="large"
               sx={{
                  px: `30px`,
                  py: `12px`,
                  height: `48px`,
                  borderRadius: `999999px`,
                  textTransform: `none`,
                  fontSize: `16px`,
                  fontWeight: `600`,
                  color: `#ffffff`,
                  borderColor: `rgba(255, 255, 255, 0.3)`,
                  transition: `all 0.3s ease`,
                  "&:hover": {
                     backgroundColor: `#b388ff`,
                     borderColor: `#b388ff`,
                     color: `#ffffff`,
                     boxShadow: `0 4px 20px rgba(179, 136, 255, 0.4)`,
                  },
               }}
            >
               Lets talk
            </LoadingButton>

            {/* Vertical Divider & Info (Rendered only if data exists in Admin DB) */}
            {(phoneInfo || emailInfo) && (
               <>
                  <Box
                     sx={{
                        display: {
                           xs: `none`,
                           sm: `block`,
                        },
                        height: `40px`,
                     }}
                  >
                     <Divider orientation="vertical" sx={{ height: `100%`, borderColor: `rgba(255, 255, 255, 0.15)` }} />
                  </Box>

                  <Stack gap="6px" sx={{ justifyContent: `center` }}>
                     {phoneInfo && (
                        <Stack direction="row" gap="10px" alignItems="center">
                           <LocalPhoneRoundedIcon sx={{ fontSize: `18px`, color: `rgba(255, 255, 255, 0.6)` }} />
                           <Box
                              component="a"
                              href={`tel:${phoneInfo.replace(/\s+/g, '')}`}
                              sx={{
                                 color: `rgba(255, 255, 255, 0.9)`,
                                 textDecoration: `none`,
                                 fontSize: `14px`,
                                 fontWeight: `500`,
                                 transition: `color 0.2s ease`,
                                 "&:hover": { color: `#b388ff` },
                              }}
                           >
                              {phoneInfo}
                           </Box>
                        </Stack>
                     )}

                     {emailInfo && (
                        <Stack direction="row" gap="10px" alignItems="center">
                           <EmailRoundedIcon sx={{ fontSize: `18px`, color: `rgba(255, 255, 255, 0.6)` }} />
                           <Box
                              component="a"
                              href={`mailto:${emailInfo}`}
                              sx={{
                                 color: `rgba(255, 255, 255, 0.9)`,
                                 textDecoration: `none`,
                                 fontSize: `14px`,
                                 fontWeight: `500`,
                                 transition: `color 0.2s ease`,
                                 "&:hover": { color: `#b388ff` },
                              }}
                           >
                              {emailInfo}
                           </Box>
                        </Stack>
                     )}
                  </Stack>
               </>
            )}
         </Stack>
      </Stack>
   );
}

export default FormContact;
