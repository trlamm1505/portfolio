"use client";

import { createSkillAction } from "@/actions/skill.action";
import { FB_FOLDER_SKILL } from "@/constants/firebase.constant";
import { isFileSizeValid } from "@/helpers/function.helper";
import { uploadWithFirebase } from "@/libs/firebase.lib";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AddLinkIcon from "@mui/icons-material/AddLink";
import LoadingButton from "@mui/lab/LoadingButton";
import {
   Box,
   Button,
   Divider,
   Drawer,
   IconButton,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import PreviewImage from "./PreviewImage";

type TProps = {
   openDrawerSkillCreate: boolean;
   handleCloseDrawerSkillCreate: () => void;
};

const heightHeader = `70px`;
const heightFooter = `80px`;

const fileToBase64 = (file: File): Promise<string> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
   });
};

export default function DrawerSkillCreate({
   openDrawerSkillCreate,
   handleCloseDrawerSkillCreate,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);
   const [fileList, setFileList] = useState<File[]>([]);
   const [customUrl, setCustomUrl] = useState<string>("");
   const [urlList, setUrlList] = useState<string[]>([]);

   const createSkillForm = useFormik({
      initialValues: {
         title: ``,
      },
      validationSchema: Yup.object().shape({
         title: Yup.string().trim().required(`Title is required`),
      }),
      onSubmit: async (valuesRaw) => {
         if (fileList.length === 0 && urlList.length === 0) {
            return toast.error("Please upload file or add image URL");
         }

         for (const file of fileList) {
            if (!isFileSizeValid(file, 10)) {
               return toast.warning(`File ${file.name} size is > 10MB`);
            }
         }

         setLoading(true);

         const uploadedImages: string[] = [...urlList];

         for (const file of fileList) {
            try {
               const imgName = await uploadWithFirebase(file, FB_FOLDER_SKILL);
               if (imgName) {
                  uploadedImages.push(imgName);
               } else {
                  // Fallback to base64 if Firebase upload fails / quota exceeded
                  const base64 = await fileToBase64(file);
                  uploadedImages.push(base64);
               }
            } catch {
               const base64 = await fileToBase64(file);
               uploadedImages.push(base64);
            }
         }

         if (uploadedImages.length === 0) {
            setLoading(false);
            return toast.error("Failed to process icon images");
         }

         const result = await createSkillAction({
            title: valuesRaw.title,
            images: uploadedImages,
         });

         setLoading(false);

         if (!result.status) {
            toast.error(result.message);
            return;
         }

         createSkillForm.resetForm();
         setFileList([]);
         setUrlList([]);
         setCustomUrl("");
         handleCloseDrawerSkillCreate();
         toast.success(result.message);
      },
   });

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const newFiles = Array.from(e.target.files);
         setFileList((prev) => [...prev, ...newFiles]);
      }
   };

   const handleAddUrl = () => {
      if (!customUrl.trim()) return;
      setUrlList((prev) => [...prev, customUrl.trim()]);
      setCustomUrl("");
   };

   const handleRemoveFile = (index: number) => {
      setFileList((prev) => prev.filter((_, i) => i !== index));
   };

   const handleRemoveUrl = (index: number) => {
      setUrlList((prev) => prev.filter((_, i) => i !== index));
   };

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerSkillCreate}
         onClose={handleCloseDrawerSkillCreate}
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
         >
            {/* Header */}
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
                  Create New Skill
               </Typography>
            </Stack>

            {/* Body */}
            <Stack
               sx={{
                  height: `calc(100vh - (${heightHeader} + ${heightFooter}))`,
                  p: `24px`,
                  rowGap: `24px`,
                  overflowY: `auto`,
               }}
            >
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
                  label="Title (e.g. Front-End Development)"
                  name="title"
                  value={createSkillForm.values.title}
                  onChange={createSkillForm.handleChange}
                  error={
                     createSkillForm.touched.title && createSkillForm.errors.title !== undefined
                  }
                  helperText={createSkillForm.touched.title && createSkillForm.errors.title}
                  variant="outlined"
               />

               <Divider sx={{ borderColor: "#efe8fa" }} />

               {/* Upload File Section */}
               <Box>
                  <Typography sx={{ fontSize: `15px`, fontWeight: `700`, color: "#3b1874", mb: `12px` }}>
                     Upload Icon Files
                  </Typography>
                  <Button
                     component="label"
                     variant="contained"
                     startIcon={<CloudUploadIcon />}
                     sx={{
                        borderRadius: "12px",
                        backgroundColor: "#f3eefc",
                        color: "#6c2bd9",
                        boxShadow: "none",
                        fontWeight: "600",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#8b5cf6", color: "#ffffff" },
                     }}
                  >
                     Select Files
                     <Box
                        component="input"
                        type="file"
                        accept="image/*"
                        multiple
                        sx={{
                           clip: "rect(0 0 0 0)",
                           clipPath: "inset(50%)",
                           height: 1,
                           overflow: "hidden",
                           position: "absolute",
                           bottom: 0,
                           left: 0,
                           whiteSpace: "nowrap",
                           width: 1,
                        }}
                        onChange={handleFileChange}
                     />
                  </Button>

                  <Stack sx={{ mt: `15px`, gap: `10px` }}>
                     {fileList.map((file, idx) => (
                        <Stack
                           key={idx}
                           direction="row"
                           alignItems="center"
                           justifyContent="space-between"
                           sx={{
                              p: `8px 12px`,
                              border: `1px solid #e7ddfa`,
                              borderRadius: `12px`,
                              backgroundColor: "#f9f7fe",
                           }}
                        >
                           <Stack direction="row" alignItems="center" gap={`10px`}>
                              <PreviewImage file={file} />
                              <Typography sx={{ fontSize: `14px`, maxWidth: `220px`, color: "#3b1874" }} noWrap>
                                 {file.name}
                              </Typography>
                           </Stack>
                           <IconButton color="error" onClick={() => handleRemoveFile(idx)}>
                              <DeleteIcon />
                           </IconButton>
                        </Stack>
                     ))}
                  </Stack>
               </Box>

               <Divider sx={{ borderColor: "#efe8fa" }} />

               {/* Or Add Image URL directly */}
               <Box>
                  <Typography sx={{ fontSize: `15px`, fontWeight: `700`, color: "#3b1874", mb: `12px` }}>
                     Or Add Image URL Directly
                  </Typography>
                  <Stack direction="row" gap="10px">
                     <TextField
                        size="small"
                        sx={{ flex: 1 }}
                        InputProps={{
                           sx: {
                              color: "#221638",
                              backgroundColor: "#fcfaff",
                              borderRadius: "12px",
                           },
                        }}
                        placeholder="https://..."
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                     />
                     <Button
                        variant="outlined"
                        startIcon={<AddLinkIcon />}
                        onClick={handleAddUrl}
                        sx={{
                           borderRadius: "12px",
                           borderColor: "#d4c2fc",
                           color: "#6c2bd9",
                           textTransform: "none",
                           fontWeight: "600",
                        }}
                     >
                        Add URL
                     </Button>
                  </Stack>

                  <Stack sx={{ mt: `15px`, gap: `10px` }}>
                     {urlList.map((url, idx) => (
                        <Stack
                           key={idx}
                           direction="row"
                           alignItems="center"
                           justifyContent="space-between"
                           sx={{
                              p: `8px 12px`,
                              border: `1px solid #e7ddfa`,
                              borderRadius: `12px`,
                              backgroundColor: "#f9f7fe",
                           }}
                        >
                           <Typography sx={{ fontSize: `14px`, maxWidth: `300px`, color: "#3b1874" }} noWrap>
                              {url}
                           </Typography>
                           <IconButton color="error" onClick={() => handleRemoveUrl(idx)}>
                              <DeleteIcon />
                           </IconButton>
                        </Stack>
                     ))}
                  </Stack>
               </Box>
            </Stack>

            {/* Footer */}
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
               <Button onClick={handleCloseDrawerSkillCreate} sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}>
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => createSkillForm.handleSubmit()}
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
                  Create Skill
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
