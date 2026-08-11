"use client";

import { deleteSkillAction, updateSkillAction } from "@/actions/skill.action";
import { getMediaUrl, FB_FOLDER_SKILL } from "@/constants/firebase.constant";
import { isFileSizeValid } from "@/helpers/function.helper";
import { deleteWithFirebase, uploadWithFirebase } from "@/libs/firebase.lib";
import { TSkill } from "@/types/respon/skill.type";
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
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import PreviewImage from "./PreviewImage";

type TProps = {
   openDrawerSkillEdit: boolean;
   handleCloseDrawerSkillEdit: () => void;
   dataSkillEdit: TSkill | null;
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

export default function DrawerSkillEdit({
   openDrawerSkillEdit,
   handleCloseDrawerSkillEdit,
   dataSkillEdit,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);
   const [existingImages, setExistingImages] = useState<string[]>([]);
   const [newFileList, setNewFileList] = useState<File[]>([]);
   const [customUrl, setCustomUrl] = useState<string>("");

   useEffect(() => {
      if (dataSkillEdit) {
         editSkillForm.setValues({
            title: dataSkillEdit.title || ``,
         });
         setExistingImages(dataSkillEdit.images || []);
         setNewFileList([]);
         setCustomUrl("");
      }
   }, [dataSkillEdit]);

   const editSkillForm = useFormik({
      initialValues: {
         title: ``,
      },
      validationSchema: Yup.object().shape({
         title: Yup.string().trim().required(`Title is required`),
      }),
      onSubmit: async (valuesRaw) => {
         if (!dataSkillEdit) return;

         if (existingImages.length === 0 && newFileList.length === 0) {
            return toast.error("Please include at least one icon image");
         }

         for (const file of newFileList) {
            if (!isFileSizeValid(file, 10)) {
               return toast.warning(`File ${file.name} size > 10MB`);
            }
         }

         setLoading(true);

         const newlyUploaded: string[] = [];
         for (const file of newFileList) {
            try {
               const imgName = await uploadWithFirebase(file, FB_FOLDER_SKILL);
               if (imgName) {
                  newlyUploaded.push(imgName);
               } else {
                  const base64 = await fileToBase64(file);
                  newlyUploaded.push(base64);
               }
            } catch {
               const base64 = await fileToBase64(file);
               newlyUploaded.push(base64);
            }
         }

         const finalImages = [...existingImages, ...newlyUploaded];

         const result = await updateSkillAction({
            _id: dataSkillEdit._id,
            title: valuesRaw.title,
            images: finalImages,
         });

         setLoading(false);

         if (!result.status) {
            toast.error(result.message);
            return;
         }

         handleCloseDrawerSkillEdit();
         toast.success(result.message);
      },
   });

   const handleNewFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const files = Array.from(e.target.files);
         setNewFileList((prev) => [...prev, ...files]);
      }
   };

   const handleAddUrl = () => {
      if (!customUrl.trim()) return;
      setExistingImages((prev) => [...prev, customUrl.trim()]);
      setCustomUrl("");
   };

   const handleRemoveExistingImage = (imgName: string) => {
      setExistingImages((prev) => prev.filter((item) => item !== imgName));
   };

   const handleRemoveNewFile = (index: number) => {
      setNewFileList((prev) => prev.filter((_, i) => i !== index));
   };

   const handleDeleteSkill = async () => {
      if (!dataSkillEdit) return;
      if (confirm(`Are you sure you want to delete "${dataSkillEdit.title}"?`)) {
         setLoading(true);
         for (const imgName of dataSkillEdit.images || []) {
            if (
               !imgName.startsWith("http") &&
               !imgName.startsWith("data:") &&
               !imgName.startsWith("/")
            ) {
               deleteWithFirebase(imgName, FB_FOLDER_SKILL);
            }
         }
         const result = await deleteSkillAction(dataSkillEdit._id);
         setLoading(false);
         if (result.status) {
            toast.success(result.message);
            handleCloseDrawerSkillEdit();
         } else {
            toast.error(result.message);
         }
      }
   };

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerSkillEdit}
         onClose={handleCloseDrawerSkillEdit}
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
                  flexDirection: `row`,
                  alignItems: `center`,
                  justifyContent: `space-between`,
                  p: `20px 24px 10px`,
                  borderBottom: `1px solid #e7ddfa`,
               }}
            >
               <Typography sx={{ fontSize: `22px`, fontWeight: `800`, color: "#3b1874" }}>
                  Edit Skill
               </Typography>
               <Button variant="outlined" color="error" onClick={handleDeleteSkill} sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}>
                  Delete
               </Button>
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
                  label="Title"
                  name="title"
                  value={editSkillForm.values.title}
                  onChange={editSkillForm.handleChange}
                  error={
                     editSkillForm.touched.title && editSkillForm.errors.title !== undefined
                  }
                  helperText={editSkillForm.touched.title && editSkillForm.errors.title}
                  variant="outlined"
               />

               <Divider sx={{ borderColor: "#efe8fa" }} />

               {/* Existing Images */}
               <Box>
                  <Typography sx={{ fontSize: `15px`, fontWeight: `700`, color: "#3b1874", mb: `12px` }}>
                     Current Icon Images
                  </Typography>
                  <Stack sx={{ gap: `10px` }}>
                     {existingImages.map((imgName, idx) => {
                        const imgUrl = getMediaUrl(FB_FOLDER_SKILL, imgName);
                        return (
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
                                 <Box sx={{ width: "45px", height: "45px", position: "relative" }}>
                                    <Image
                                       src={imgUrl}
                                       alt={`icon-${idx}`}
                                       width={45}
                                       height={45}
                                       style={{ objectFit: "contain", borderRadius: "6px" }}
                                    />
                                 </Box>
                                 <Typography sx={{ fontSize: `14px`, maxWidth: `220px`, color: "#3b1874" }} noWrap>
                                    {imgName}
                                 </Typography>
                              </Stack>
                              <IconButton
                                 color="error"
                                 onClick={() => handleRemoveExistingImage(imgName)}
                              >
                                 <DeleteIcon />
                              </IconButton>
                           </Stack>
                        );
                     })}
                  </Stack>
               </Box>

               <Divider sx={{ borderColor: "#efe8fa" }} />

               {/* New Images */}
               <Box>
                  <Typography sx={{ fontSize: `15px`, fontWeight: `700`, color: "#3b1874", mb: `12px` }}>
                     Add New Icons (File)
                  </Typography>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ borderRadius: "12px", backgroundColor: "#f3eefc", color: "#6c2bd9", boxShadow: "none", fontWeight: 600, textTransform: "none", "&:hover": { backgroundColor: "#8b5cf6", color: "#ffffff" } }}>
                     Upload More Icons
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
                        onChange={handleNewFileChange}
                     />
                  </Button>

                  <Stack sx={{ mt: `15px`, gap: `10px` }}>
                     {newFileList.map((file, idx) => (
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
                           <IconButton color="error" onClick={() => handleRemoveNewFile(idx)}>
                              <DeleteIcon />
                           </IconButton>
                        </Stack>
                     ))}
                  </Stack>
               </Box>

               <Divider sx={{ borderColor: "#efe8fa" }} />

               {/* Direct URL */}
               <Box>
                  <Typography sx={{ fontSize: `15px`, fontWeight: `700`, color: "#3b1874", mb: `12px` }}>
                     Or Add Image URL Directly
                  </Typography>
                  <Stack direction="row" gap="10px">
                     <TextField
                        size="small"
                        sx={{ flex: 1 }}
                        placeholder="https://..."
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                     />
                     <Button variant="outlined" startIcon={<AddLinkIcon />} onClick={handleAddUrl} sx={{ borderRadius: "12px", borderColor: "#d4c2fc", color: "#6c2bd9", textTransform: "none", fontWeight: 600 }}>
                        Add URL
                     </Button>
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
               <Button onClick={handleCloseDrawerSkillEdit} sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}>Cancel</Button>

               <LoadingButton
                  onClick={() => editSkillForm.handleSubmit()}
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
                  Update Skill
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
