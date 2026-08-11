"use client";

import { deleteProjectAction, updateProjectAction } from "@/actions/project.action";
import { getMediaUrl, FB_FOLDER_LOGO, FB_FOLDER_PROJECT } from "@/constants/firebase.constant";
import { isFileSizeValid } from "@/helpers/function.helper";
import { deleteWithFirebase, uploadWithFirebase } from "@/libs/firebase.lib";
import { TPayloadEditProject, TProject, TTypeProject } from "@/types/respon/project.type";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import {
   Autocomplete,
   Box,
   Button,
   CircularProgress,
   Divider,
   Drawer,
   FormHelperText,
   IconButton,
   MenuItem,
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

const currencies = [
   {
      value: "Fe Development",
      label: "Fe Development",
   },
   {
      value: "Be Development",
      label: "Be Development",
   },
];

type TProps = {
   openDrawerMyProjectEdit: boolean;
   handleCloseDrawerMyProjectEdit: () => void;
   dataMyProjectEdit: TProject;
   dataTypeProjects: TResonAction<TTypeProject[] | null>;
};

const heightHeader = `70px`;
const heightFooter = `80px`;

export default function DrawerMyProjectEdit({
   openDrawerMyProjectEdit,
   handleCloseDrawerMyProjectEdit,
   dataMyProjectEdit,
   dataTypeProjects,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);
   const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

   const [fileImgProject, setFileImgProject] = useState<File | null>(null);
   const [fileImgLogo, setFileImgLogo] = useState<File | null>(null);

   const editProjectForm = useFormik({
      initialValues: {
         title: ``,
         category: `Work Experience`,
         company_name: ``,
         location: ``,
         date_range: ``,
         github_link: ``,
         demo_link: ``,
         link: ``,
         technologies: ``,
         description: ``,
         imgProject: ``,
         imgLogo: ``,
      },
      validationSchema: Yup.object().shape({
         title: Yup.string().trim().required(`Name is required`),
         description: Yup.string().trim().required(`Description is required`),
      }),
      onSubmit: async (valuesRaw) => {
         if (!dataMyProjectEdit) return;
         console.log(`valuesRaw`, valuesRaw);

         setLoading(true);

         if (fileImgProject) {
            if (!isFileSizeValid(fileImgProject, 10)) {
               setLoading(false);
               return toast.warning("Project image file size > 10MB");
            }
            const imgProjectName = await uploadWithFirebase(fileImgProject, FB_FOLDER_PROJECT);
            if (imgProjectName) {
               deleteWithFirebase(dataMyProjectEdit.img_project_name, FB_FOLDER_PROJECT);
               valuesRaw.imgProject = imgProjectName;
            } else {
               return setLoading(false);
            }
         }

         if (fileImgLogo) {
            if (!isFileSizeValid(fileImgLogo, 10)) {
               setLoading(false);
               return toast.warning("Logo image file size > 10MB");
            }
            const imgLogoName = await uploadWithFirebase(fileImgLogo, FB_FOLDER_LOGO);
            if (imgLogoName) {
               deleteWithFirebase(dataMyProjectEdit.img_logo_name, FB_FOLDER_LOGO);
               valuesRaw.imgLogo = imgLogoName;
            } else {
               return setLoading(false);
            }
         }

         const payload: TPayloadEditProject = {
            _id: dataMyProjectEdit._id,
            description: valuesRaw.description,
            category: valuesRaw.category,
            company_name: valuesRaw.company_name,
            location: valuesRaw.location,
            date_range: valuesRaw.date_range,
            github_link: valuesRaw.github_link,
            demo_link: valuesRaw.demo_link || "",
            link: valuesRaw.demo_link || "",
            technologies: valuesRaw.technologies,
            img_logo_name: valuesRaw.imgLogo || dataMyProjectEdit.img_logo_name || "",
            img_project_name: valuesRaw.imgProject || dataMyProjectEdit.img_project_name || "",
            title: valuesRaw.title,
         };

         const result = await updateProjectAction(payload);
         console.log(result);
         setLoading(false);

         if (!result.status) {
            deleteWithFirebase(valuesRaw.imgProject, FB_FOLDER_PROJECT);
            deleteWithFirebase(valuesRaw.imgLogo, FB_FOLDER_LOGO);
            toast.error(result.message);
            return;
         }

         setFileImgProject(null);
         setFileImgLogo(null);
         handleCloseDrawerMyProjectEdit();

         toast.success(result.message);
      },
   });

   const handleDeleteProject = async () => {
      setLoadingDelete(true);

      deleteWithFirebase(dataMyProjectEdit.img_project_name, FB_FOLDER_PROJECT);

      deleteWithFirebase(dataMyProjectEdit.img_logo_name, FB_FOLDER_LOGO);

      const reuslt = await deleteProjectAction(dataMyProjectEdit._id);
      setLoadingDelete(false);

      if (reuslt.status === false) return toast.error(reuslt.message);

      editProjectForm.resetForm();
      handleCloseDrawerMyProjectEdit();

      toast.success(reuslt.message);
   };

   useEffect(() => {
      if (dataMyProjectEdit) {
         const gitLink = (dataMyProjectEdit.github_link || "").trim();
         const rawDemoLink = (dataMyProjectEdit.demo_link || dataMyProjectEdit.link || "").trim();
         const cleanDemoLink = rawDemoLink !== gitLink ? rawDemoLink : "";

         editProjectForm.setValues({
            title: dataMyProjectEdit.title || ``,
            category: dataMyProjectEdit.category || `Work Experience`,
            company_name: dataMyProjectEdit.company_name || ``,
            location: dataMyProjectEdit.location || ``,
            date_range: dataMyProjectEdit.date_range || ``,
            github_link: dataMyProjectEdit.github_link || ``,
            demo_link: cleanDemoLink,
            link: cleanDemoLink,
            technologies: Array.isArray(dataMyProjectEdit.technologies)
               ? dataMyProjectEdit.technologies.join(", ")
               : dataMyProjectEdit.technologies || ``,
            description: dataMyProjectEdit.description || ``,
            imgProject: dataMyProjectEdit.img_project_name || ``,
            imgLogo: dataMyProjectEdit.img_logo_name || ``,
         });
      }
   }, [dataMyProjectEdit]);

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerMyProjectEdit}
         onClose={handleCloseDrawerMyProjectEdit}
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
            onSubmit={editProjectForm.handleSubmit}
         >
            {/* header */}
            <Stack
               sx={{
                  height: `${heightHeader}`,
                  alignItems: `center`,
                  justifyContent: `space-between`,
                  p: `20px 20px 10px`,
                  flexDirection: `row`,
               }}
            >
               <Typography sx={{ fontSize: `20px`, fontWeight: `700` }}>
                  <span>Edit Project </span>
                  <span style={{ fontWeight: `400`, fontSize: `14px` }}>
                     - {dataMyProjectEdit._id.toString()}
                  </span>
               </Typography>
               <IconButton
                  disabled={loadingDelete}
                  color="error"
                  size="large"
                  onClick={handleDeleteProject}
               >
                  {loadingDelete ? <CircularProgress size={20} /> : <DeleteRoundedIcon />}
               </IconButton>
            </Stack>

            {/* body */}
            <Stack
               sx={{
                  height: `calc(100vh - (${heightHeader} + ${heightFooter}))`,
                  p: `10px 20px`,
                  rowGap: `20px`,
                  overflowY: `auto`,
               }}
            >
               {/* Project Category (AT THE VERY TOP) */}
               <TextField
                  select
                  fullWidth
                  InputLabelProps={{ sx: { color: "#5b21b6", fontWeight: 600 } }}
                  InputProps={{
                     sx: {
                        color: "#221638",
                        backgroundColor: "#fcfaff",
                        borderRadius: "12px",
                        fontWeight: 600,
                     },
                  }}
                  label="Project Category"
                  name="category"
                  value={editProjectForm.values.category}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               >
                  <MenuItem value="Work Experience">💼 Work Experience</MenuItem>
                  <MenuItem value="Personal Projects">🚀 Personal Projects</MenuItem>
               </TextField>

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
                  value={editProjectForm.values.title}
                  onChange={editProjectForm.handleChange}
                  error={
                     editProjectForm.touched.title && editProjectForm.errors.title !== undefined
                  }
                  helperText={editProjectForm.touched.title && editProjectForm.errors.title}
                  variant="outlined"
               />

               {/* company_name (Tag 1) */}
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
                  label="Tag / Sub-title 1 (e.g. Capstone Project, ILA Vietnam)"
                  name="company_name"
                  value={editProjectForm.values.company_name}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               />

               {/* location (Tag 2) */}
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
                  label="Tag / Sub-title 2 (e.g. Front-end Developer, Ho Chi Minh City)"
                  name="location"
                  value={editProjectForm.values.location}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               />

               {/* date_range */}
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
                  label="Date Range (e.g. Jan 2026 – Present)"
                  name="date_range"
                  value={editProjectForm.values.date_range}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               />

               {/* technologies */}
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
                  label="Technologies (comma separated, e.g. React Native, TypeScript, TanStack)"
                  name="technologies"
                  value={editProjectForm.values.technologies}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               />

               {/* description (PLACED ABOVE LINK FIELDS) */}
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
                  value={editProjectForm.values.description}
                  onChange={editProjectForm.handleChange}
                  error={
                     editProjectForm.touched.description &&
                     editProjectForm.errors.description !== undefined
                  }
                  helperText={
                     (editProjectForm.touched.description &&
                        editProjectForm.errors.description) ||
                     "Max 10 lines: 1 summary paragraph line + up to 9 bullet points starting with •"
                  }
                  variant="outlined"
               />

               {/* GitHub Link */}
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
                  label="GitHub Link (e.g. https://github.com/...)"
                  name="github_link"
                  value={editProjectForm.values.github_link}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               />

               {/* Demo Link */}
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
                  label="Live Demo Link (e.g. https://my-app.vercel.app)"
                  name="demo_link"
                  value={editProjectForm.values.demo_link}
                  onChange={editProjectForm.handleChange}
                  variant="outlined"
               />

               {/* img project */}
               <Box>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                     Image Project
                     <Box
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
                        component={`input`}
                        type="file"
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                           if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              setFileImgProject(file);
                              editProjectForm.setFieldValue("imgProject", file.name);
                           }
                        }}
                     />
                  </Button>
                  {fileImgProject ? (
                     <PreviewImage file={fileImgProject} />
                  ) : (
                     <Box
                        sx={{
                           mt: `10px`,
                           width: "100px",
                           height: "100px",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                        }}
                        overflow={"hidden"}
                     >
                        <Image
                           src={getMediaUrl(FB_FOLDER_PROJECT, dataMyProjectEdit.img_project_name)}
                           alt="preview"
                           width={0}
                           height={0}
                           sizes="30vw"
                           style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: `10px`,
                           }}
                        />
                     </Box>
                  )}
                  {fileImgProject ? (
                     <FormHelperText sx={{ px: `14px` }}>{fileImgProject.name}</FormHelperText>
                  ) : (
                     <FormHelperText sx={{ px: `14px` }}>
                        {dataMyProjectEdit.img_project_name}
                     </FormHelperText>
                  )}
               </Box>

               <Divider />

               {/* img logo */}
               <Box>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                     Image Logo
                     <Box
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
                        component={`input`}
                        type="file"
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                           if (e.target.files && e.target.files.length > 0) {
                              const file = e.target.files[0];
                              setFileImgLogo(file);
                              editProjectForm.setFieldValue("imgLogo", file.name);
                           }
                        }}
                     />
                  </Button>
                  {fileImgLogo ? (
                     <PreviewImage file={fileImgLogo} />
                  ) : (
                     <Box
                        sx={{
                           mt: `10px`,
                           width: "100px",
                           height: "100px",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                        }}
                        overflow={"hidden"}
                     >
                        <Image
                           src={getMediaUrl(FB_FOLDER_LOGO, dataMyProjectEdit.img_logo_name)}
                           alt="preview"
                           width={0}
                           height={0}
                           sizes="30vw"
                           style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: `10px`,
                           }}
                        />
                     </Box>
                  )}
                  {fileImgLogo ? (
                     <FormHelperText sx={{ px: `14px` }}>{fileImgLogo.name}</FormHelperText>
                  ) : (
                     <FormHelperText sx={{ px: `14px` }}>
                        {dataMyProjectEdit.img_logo_name}
                     </FormHelperText>
                  )}
               </Box>
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
               <Button onClick={handleCloseDrawerMyProjectEdit} sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}>
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => {
                     editProjectForm.handleSubmit();
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
                  Update Project
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
