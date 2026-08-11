"use client";

import { createTextInPageAction } from "@/actions/title-in-page.action";
import { TTextInPageCreate } from "@/types/respon/text-in-page.type";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Chip, Drawer, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   openDrawerTextInPageCreate: boolean;
   handleCloseDrawerTextInPageCreate: () => void;
};

const heightHeader = `70px`;
const heightFooter = `80px`;

export default function DrawerTextInPageCreate({
   openDrawerTextInPageCreate,
   handleCloseDrawerTextInPageCreate,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);

   const createTextInPageForm = useFormik({
      initialValues: {
         page: ``,
         title: ``,
         description: ``,
      },
      validationSchema: Yup.object().shape({
         page: Yup.string().trim().required(`Page is required`),
         title: Yup.string().trim().required(`Name is required`),
         description: Yup.string().trim().required(`Description is required`),
      }),
      onSubmit: async (valuesRaw) => {
         console.log(`valuesRaw`, valuesRaw);

         setLoading(true);

         const payload: TTextInPageCreate = {
            page: valuesRaw.page,
            description: valuesRaw.description,
            title: valuesRaw.title,
         };

         const result = await createTextInPageAction(payload);
         console.log(result);
         setLoading(false);

         if (!result.status) return toast.error(result.message);

         handleCloseDrawerTextInPageCreate();
         createTextInPageForm.resetForm()

         toast.success(result.message);
      },
   });


   return (
      <Drawer
         anchor={`right`}
         open={openDrawerTextInPageCreate}
         onClose={handleCloseDrawerTextInPageCreate}
         PaperProps={{
            sx: {
               backgroundColor: "#ffffff",
               color: "#221638",
               boxShadow: "-10px 0 40px rgba(139, 92, 246, 0.15)",
            },
         }}
      >
         <Box
            sx={{ width: { xs: `90vw`, lg: `500px` }, position: `relative`, height: `100%` }}
            role="presentation"
            component="form"
            autoComplete="false"
            onSubmit={createTextInPageForm.handleSubmit}
         >
            {/* header */}
            <Stack
               sx={{
                  height: `${heightHeader}`,
                  alignItems: `start`,
                  justifyContent: `center`,
                  p: `20px 24px 10px`,
                  borderBottom: `1px solid #e7ddfa`,
               }}
            >
               <Typography sx={{ fontSize: `22px`, fontWeight: `800`, color: "#3b1874" }}>
                  Create Text In Page
               </Typography>
            </Stack>

            {/* body */}
            <Stack
               sx={{
                  height: `calc(100vh - (${heightHeader} + ${heightFooter}))`,
                  p: `24px`,
                  rowGap: `20px`,
                  overflowY: `auto`,
               }}
            >
               {/* Quick Social Presets */}
               <Box sx={{ mb: 0.5 }}>
                  <Typography variant="caption" fontWeight="700" color="#7c3aed" display="block" mb={1}>
                     ⚡ Quick Presets for Social Links:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                     <Chip
                        label="🐙 GitHub"
                        size="small"
                        onClick={() => {
                           createTextInPageForm.setFieldValue("page", "social");
                           createTextInPageForm.setFieldValue("title", "GitHub");
                           createTextInPageForm.setFieldValue("description", "https://github.com/trlamm1505");
                        }}
                        sx={{ backgroundColor: "#f3eefc", color: "#6c2bd9", fontWeight: 600, cursor: "pointer" }}
                     />
                     <Chip
                        label="📘 Facebook"
                        size="small"
                        onClick={() => {
                           createTextInPageForm.setFieldValue("page", "social");
                           createTextInPageForm.setFieldValue("title", "Facebook");
                           createTextInPageForm.setFieldValue("description", "https://www.facebook.com/Suduy.1505");
                        }}
                        sx={{ backgroundColor: "#e7f3ff", color: "#1877f2", fontWeight: 600, cursor: "pointer" }}
                     />
                     <Chip
                        label="💼 LinkedIn"
                        size="small"
                        onClick={() => {
                           createTextInPageForm.setFieldValue("page", "social");
                           createTextInPageForm.setFieldValue("title", "LinkedIn");
                           createTextInPageForm.setFieldValue("description", "https://www.linkedin.com/in/tqlam150504/");
                        }}
                        sx={{ backgroundColor: "#e8f4f9", color: "#0a66c2", fontWeight: 600, cursor: "pointer" }}
                     />
                     <Chip
                        label="📄 CV Resume"
                        size="small"
                        onClick={() => {
                           createTextInPageForm.setFieldValue("page", "social");
                           createTextInPageForm.setFieldValue("title", "CV Resume");
                           createTextInPageForm.setFieldValue("description", "https://drive.google.com/file/d/1d9jTYRwv09XPlU8oDDXFuvfZ-jVsLG4Q/view?usp=sharing");
                        }}
                        sx={{ backgroundColor: "#fce8e6", color: "#ea4335", fontWeight: 600, cursor: "pointer" }}
                     />
                  </Stack>
               </Box>

               {/* page */}
               <TextField
                  fullWidth
                  InputLabelProps={{ sx: { color: "#5b21b6", fontWeight: 600 } }}
                  InputProps={{
                     sx: {
                        color: "#221638",
                        backgroundColor: "#fcfaff",
                        borderRadius: "12px",
                        fontWeight: 500,
                     },
                  }}
                  autoComplete="page"
                  label="Page Route (e.g. / or /about or /contact)"
                  name="page"
                  value={createTextInPageForm.values.page}
                  onChange={createTextInPageForm.handleChange}
                  error={createTextInPageForm.touched.page && createTextInPageForm.errors.page !== undefined}
                  helperText={createTextInPageForm.touched.page && createTextInPageForm.errors.page}
                  variant="outlined"
               />

               {/* title */}
               <TextField
                  fullWidth
                  InputLabelProps={{ sx: { color: "#5b21b6", fontWeight: 600 } }}
                  InputProps={{
                     sx: {
                        color: "#221638",
                        backgroundColor: "#fcfaff",
                        borderRadius: "12px",
                        fontWeight: 500,
                     },
                  }}
                  autoComplete="title"
                  label="Title"
                  name="title"
                  value={createTextInPageForm.values.title}
                  onChange={createTextInPageForm.handleChange}
                  error={
                     createTextInPageForm.touched.title && createTextInPageForm.errors.title !== undefined
                  }
                  helperText={createTextInPageForm.touched.title && createTextInPageForm.errors.title}
                  variant="outlined"
               />

               {/* description */}
               <TextField
                  fullWidth
                  InputLabelProps={{ sx: { color: "#5b21b6", fontWeight: 600 } }}
                  InputProps={{
                     sx: {
                        color: "#221638",
                        backgroundColor: "#fcfaff",
                        borderRadius: "12px",
                        fontWeight: 500,
                     },
                  }}
                  multiline
                  rows={8}
                  autoComplete="description"
                  label="Description"
                  name="description"
                  value={createTextInPageForm.values.description}
                  onChange={createTextInPageForm.handleChange}
                  error={
                     createTextInPageForm.touched.description &&
                     createTextInPageForm.errors.description !== undefined
                  }
                  helperText={
                     createTextInPageForm.touched.description && createTextInPageForm.errors.description
                  }
                  variant="outlined"
               />
            </Stack>

            {/* footer */}
            <Stack
               sx={{
                  height: `${heightFooter}`,
                  flexDirection: `row`,
                  p: `10px 24px 20px`,
                  gap: `16px`,
                  borderTop: `1px solid #e7ddfa`,
                  alignItems: "center",
                  justifyContent: "flex-end",
               }}
            >
               <Button onClick={handleCloseDrawerTextInPageCreate} sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}>
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => {
                     createTextInPageForm.handleSubmit();
                  }}
                  loading={loading}
                  loadingPosition="end"
                  endIcon={<SendRoundedIcon sx={{ fontSize: `16px !important` }} />}
                  variant="contained"
                  size="large"
                  sx={{
                     borderRadius: "12px",
                     background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
                     color: "#ffffff",
                     fontWeight: "700",
                     textTransform: "none",
                     px: 3,
                  }}
               >
                  Create Text
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
