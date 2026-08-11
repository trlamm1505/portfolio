"use client";

import { createCertificationAction } from "@/actions/certification.action";
import { TCertificationCreate } from "@/types/respon/certification.type";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, Drawer, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

type TProps = {
   openDrawerCertificationCreate: boolean;
   handleCloseDrawerCertificationCreate: () => void;
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

export default function DrawerCertificationCreate({
   openDrawerCertificationCreate,
   handleCloseDrawerCertificationCreate,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);

   const createCertificationForm = useFormik({
      initialValues: {
         title: ``,
         link: ``,
         date: dayjs(),
      },
      validationSchema: Yup.object().shape({
         title: Yup.string().trim().required(`Title is required`),
         link: Yup.string().trim(),
         date: Yup.date().required(`Date is required`),
      }),
      onSubmit: async (valuesRaw) => {
         setLoading(true);

         const payload: TCertificationCreate = {
            link: valuesRaw.link,
            title: valuesRaw.title,
            date: valuesRaw.date ? valuesRaw.date.toDate() : new Date(),
         };

         const result = await createCertificationAction(payload);
         setLoading(false);

         if (!result.status) return toast.error(result.message);

         handleCloseDrawerCertificationCreate();
         createCertificationForm.resetForm();

         toast.success(result.message);
      },
   });

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerCertificationCreate}
         onClose={handleCloseDrawerCertificationCreate}
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
            onSubmit={createCertificationForm.handleSubmit}
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
                  Create Certification
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
                  label="Title (e.g. AWS Certified Solutions Architect)"
                  name="title"
                  value={createCertificationForm.values.title}
                  onChange={createCertificationForm.handleChange}
                  error={
                     createCertificationForm.touched.title &&
                     createCertificationForm.errors.title !== undefined
                  }
                  helperText={
                     createCertificationForm.touched.title && createCertificationForm.errors.title
                  }
                  variant="outlined"
               />

               {/* link */}
               <TextField
                  fullWidth
                  InputLabelProps={inputLabelProps}
                  InputProps={inputProps}
                  autoComplete="link"
                  label="Credential Link (URL)"
                  name="link"
                  value={createCertificationForm.values.link}
                  onChange={createCertificationForm.handleChange}
                  error={
                     createCertificationForm.touched.link &&
                     createCertificationForm.errors.link !== undefined
                  }
                  helperText={
                     createCertificationForm.touched.link && createCertificationForm.errors.link
                  }
                  variant="outlined"
               />

               {/* date */}
               <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                     label="Issued Date"
                     value={createCertificationForm.values.date}
                     onChange={(value) => createCertificationForm.setFieldValue("date", value)}
                     slotProps={{
                        openPickerButton: {
                           sx: { color: "#6c2bd9" },
                        },
                        textField: {
                           fullWidth: true,
                           InputLabelProps: inputLabelProps,
                           InputProps: inputProps,
                        },
                        popper: {
                           sx: {
                              "& .MuiPaper-root": {
                                 backgroundColor: "#ffffff",
                                 color: "#221638",
                                 borderRadius: "16px",
                                 boxShadow: "0 10px 40px rgba(139, 92, 246, 0.2)",
                                 border: "1px solid #e7ddfa",
                                 "& .MuiPickersDay-root": {
                                    color: "#221638",
                                    fontWeight: 500,
                                    "&:hover": { backgroundColor: "#f3eefc" },
                                 },
                                 "& .MuiPickersDay-root.Mui-selected": {
                                    backgroundColor: "#8b5cf6 !important",
                                    color: "#ffffff",
                                    fontWeight: 700,
                                 },
                                 "& .MuiDayCalendar-weekDayLabel": {
                                    color: "#6c2bd9",
                                    fontWeight: 700,
                                 },
                                 "& .MuiPickersCalendarHeader-label": {
                                    color: "#3b1874",
                                    fontWeight: 700,
                                 },
                                 "& .MuiPickersArrowSwitcher-button": {
                                    color: "#6c2bd9",
                                 },
                              },
                           },
                        },
                     }}
                  />
               </LocalizationProvider>
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
                  onClick={handleCloseDrawerCertificationCreate}
                  sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}
               >
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => {
                     createCertificationForm.handleSubmit();
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
                  Create Certification
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
