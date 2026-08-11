"use client";

import { deleteTextInPageAction, updateTextInPageAction } from "@/actions/title-in-page.action";
import { TTextInPage } from "@/types/respon/text-in-page.type";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Chip, Drawer, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   openDrawerTextInPageEdit: boolean;
   handleCloseDrawerTextInPageEdit: () => void;
   dataTextInPageEdit: TTextInPage;
};

const heightHeader = `70px`;
const heightFooter = `80px`;

const textFieldStyle = {
   width: "100%",
   "& .MuiInputLabel-root": { color: "#5b21b6" },
   "& .MuiOutlinedInput-root": {
      color: "#221638",
      backgroundColor: "#fcfaff",
      borderRadius: "12px",
      "& fieldset": { borderColor: "#d4c2fc" },
      "&:hover fieldset": { borderColor: "#8b5cf6" },
      "&.Mui-focused fieldset": { borderColor: "#8b5cf6" },
   },
};

export default function DrawerTextInPageEdit({
   openDrawerTextInPageEdit,
   handleCloseDrawerTextInPageEdit,
   dataTextInPageEdit,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

   const editTextInPageForm = useFormik({
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
         if (!dataTextInPageEdit) return;
         setLoading(true);

         const payload: TTextInPage = {
            _id: dataTextInPageEdit._id,
            page: valuesRaw.page,
            description: valuesRaw.description,
            title: valuesRaw.title,
         };

         const result = await updateTextInPageAction(payload);
         setLoading(false);

         if (!result.status) return toast.error(result.message);

         handleCloseDrawerTextInPageEdit();
         toast.success(result.message);
      },
   });

   useEffect(() => {
      if (dataTextInPageEdit) {
         editTextInPageForm.setValues({
            page: dataTextInPageEdit.page || ``,
            title: dataTextInPageEdit.title || ``,
            description: dataTextInPageEdit.description || ``,
         });
      }
   }, [dataTextInPageEdit]);

   const handleDeleteTextInPage = async () => {
      setLoadingDelete(true);

      const reuslt = await deleteTextInPageAction(dataTextInPageEdit._id);
      setLoadingDelete(false);

      if (reuslt.status === false) return toast.error(reuslt.message);

      editTextInPageForm.resetForm();
      handleCloseDrawerTextInPageEdit();

      toast.success(reuslt.message);
   };

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerTextInPageEdit}
         onClose={handleCloseDrawerTextInPageEdit}
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
            onSubmit={editTextInPageForm.handleSubmit}
         >
            {/* header */}
            <Stack
               sx={{
                  height: `${heightHeader}`,
                  alignItems: `center`,
                  justifyContent: `space-between`,
                  p: `20px 24px 10px`,
                  flexDirection: `row`,
                  borderBottom: `1px solid #e7ddfa`,
               }}
            >
               <Typography sx={{ fontSize: `22px`, fontWeight: `800`, color: "#3b1874" }}>
                  Edit Text In Page
               </Typography>
               <LoadingButton
                  onClick={handleDeleteTextInPage}
                  loading={loadingDelete}
                  loadingPosition="end"
                  endIcon={<DeleteRoundedIcon />}
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
               >
                  Delete
               </LoadingButton>
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
                           editTextInPageForm.setFieldValue("page", "social");
                           editTextInPageForm.setFieldValue("title", "GitHub");
                           editTextInPageForm.setFieldValue("description", "https://github.com/trlamm1505");
                        }}
                        sx={{ backgroundColor: "#f3eefc", color: "#6c2bd9", fontWeight: 600, cursor: "pointer" }}
                     />
                     <Chip
                        label="📘 Facebook"
                        size="small"
                        onClick={() => {
                           editTextInPageForm.setFieldValue("page", "social");
                           editTextInPageForm.setFieldValue("title", "Facebook");
                           editTextInPageForm.setFieldValue("description", "https://www.facebook.com/Suduy.1505");
                        }}
                        sx={{ backgroundColor: "#e7f3ff", color: "#1877f2", fontWeight: 600, cursor: "pointer" }}
                     />
                     <Chip
                        label="💼 LinkedIn"
                        size="small"
                        onClick={() => {
                           editTextInPageForm.setFieldValue("page", "social");
                           editTextInPageForm.setFieldValue("title", "LinkedIn");
                           editTextInPageForm.setFieldValue("description", "https://www.linkedin.com/in/tqlam150504/");
                        }}
                        sx={{ backgroundColor: "#e8f4f9", color: "#0a66c2", fontWeight: 600, cursor: "pointer" }}
                     />
                     <Chip
                        label="📄 CV Resume"
                        size="small"
                        onClick={() => {
                           editTextInPageForm.setFieldValue("page", "social");
                           editTextInPageForm.setFieldValue("title", "CV Resume");
                           editTextInPageForm.setFieldValue("description", "https://drive.google.com/file/d/1d9jTYRwv09XPlU8oDDXFuvfZ-jVsLG4Q/view?usp=sharing");
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
                  value={editTextInPageForm.values.page}
                  onChange={editTextInPageForm.handleChange}
                  error={editTextInPageForm.touched.page && editTextInPageForm.errors.page !== undefined}
                  helperText={editTextInPageForm.touched.page && editTextInPageForm.errors.page}
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
                  value={editTextInPageForm.values.title}
                  onChange={editTextInPageForm.handleChange}
                  error={
                     editTextInPageForm.touched.title && editTextInPageForm.errors.title !== undefined
                  }
                  helperText={editTextInPageForm.touched.title && editTextInPageForm.errors.title}
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
                  value={editTextInPageForm.values.description}
                  onChange={editTextInPageForm.handleChange}
                  error={
                     editTextInPageForm.touched.description &&
                     editTextInPageForm.errors.description !== undefined
                  }
                  helperText={
                     editTextInPageForm.touched.description && editTextInPageForm.errors.description
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
               <Button onClick={handleCloseDrawerTextInPageEdit} sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}>
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => {
                     editTextInPageForm.handleSubmit();
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
                     boxShadow: "0 6px 20px rgba(139, 92, 246, 0.3)",
                  }}
               >
                  Update Text
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
