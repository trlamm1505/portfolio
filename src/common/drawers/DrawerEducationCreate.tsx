"use client";

import { createEducationAction } from "@/actions/education.action";
import { TEducationCreate } from "@/types/respon/education.type";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Drawer, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   openDrawerEducationCreate: boolean;
   handleCloseDrawerEducationCreate: () => void;
};

const heightHeader = `70px`;
const heightFooter = `80px`;

const inputLabelProps = { sx: { color: "#5b21b6", fontWeight: 600 } };
const inputProps = {
   sx: {
      color: "#221638",
      backgroundColor: "#fcfaff",
      borderRadius: "12px",
      fontWeight: 500,
   },
};

export default function DrawerEducationCreate({
   openDrawerEducationCreate,
   handleCloseDrawerEducationCreate,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);

   const createEducationForm = useFormik({
      initialValues: {
         title: ``,
         description: ``,
      },
      validationSchema: Yup.object().shape({
         title: Yup.string().trim().required(`Name is required`),
         description: Yup.string().trim().required(`Description is required`),
      }),
      onSubmit: async (valuesRaw) => {
         setLoading(true);

         const payload: TEducationCreate = {
            description: valuesRaw.description,
            title: valuesRaw.title,
         };

         const result = await createEducationAction(payload);
         setLoading(false);

         if (!result.status) return toast.error(result.message);

         handleCloseDrawerEducationCreate();
         createEducationForm.resetForm();

         toast.success(result.message);
      },
   });

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerEducationCreate}
         onClose={handleCloseDrawerEducationCreate}
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
            onSubmit={createEducationForm.handleSubmit}
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
                  Create Education
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
               {/* title */}
               <TextField
                  fullWidth
                  InputLabelProps={inputLabelProps}
                  InputProps={inputProps}
                  autoComplete="title"
                  label="Title (e.g. Bachelor of Software Engineering)"
                  name="title"
                  value={createEducationForm.values.title}
                  onChange={createEducationForm.handleChange}
                  error={
                     createEducationForm.touched.title &&
                     createEducationForm.errors.title !== undefined
                  }
                  helperText={
                     createEducationForm.touched.title && createEducationForm.errors.title
                  }
                  variant="outlined"
               />

               {/* description */}
               <TextField
                  fullWidth
                  InputLabelProps={inputLabelProps}
                  InputProps={inputProps}
                  multiline
                  rows={8}
                  autoComplete="description"
                  label="Description"
                  name="description"
                  value={createEducationForm.values.description}
                  onChange={createEducationForm.handleChange}
                  error={
                     createEducationForm.touched.description &&
                     createEducationForm.errors.description !== undefined
                  }
                  helperText={
                     createEducationForm.touched.description &&
                     createEducationForm.errors.description
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
               <Button
                  onClick={handleCloseDrawerEducationCreate}
                  sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}
               >
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => {
                     createEducationForm.handleSubmit();
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
                  Create Education
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
