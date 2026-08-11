"use client";

import { createProjectAction } from "@/actions/project.action";
import { FB_FOLDER_LOGO, FB_FOLDER_PROJECT } from "@/constants/firebase.constant";
import { isFileSizeValid } from "@/helpers/function.helper";
import { deleteWithFirebase, uploadWithFirebase } from "@/libs/firebase.lib";
import { TPayloadProject, TTypeProject } from "@/types/respon/project.type";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import {
   Autocomplete,
   Box,
   Button,
   Divider,
   Drawer,
   FormHelperText,
   MenuItem,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { ChangeEvent, useState } from "react";
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
   openDrawerMyProjectCreate: boolean;
   handleCloseDrawerMyProjectCreate: () => void;
   dataTypeProjects: TResonAction<TTypeProject[] | null>;
};

const heightHeader = `70px`;
const heightFooter = `80px`;

export default function DrawerMyProjectCreate({
   openDrawerMyProjectCreate,
   handleCloseDrawerMyProjectCreate,
   dataTypeProjects,
}: TProps) {
   const [loading, setLoading] = useState<boolean>(false);
   const [fileImgProject, setFileImgProject] = useState<File | null>(null);
   const [fileImgLogo, setFileImgLogo] = useState<File | null>(null);

   const createProjectForm = useFormik({
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
         console.log(valuesRaw);

         setLoading(true);

         let imgProjectName = "";
         if (fileImgProject) {
            if (!isFileSizeValid(fileImgProject, 10)) {
               setLoading(false);
               return toast.warning("Project image file size > 10MB");
            }
            imgProjectName = (await uploadWithFirebase(fileImgProject, FB_FOLDER_PROJECT)) || "";
         }

         let imgLogoName = "";
         if (fileImgLogo) {
            if (!isFileSizeValid(fileImgLogo, 10)) {
               setLoading(false);
               return toast.warning("Logo image file size > 10MB");
            }
            imgLogoName = (await uploadWithFirebase(fileImgLogo, FB_FOLDER_LOGO)) || "";
         }

         const payload: TPayloadProject = {
            description: valuesRaw.description,
            category: valuesRaw.category,
            company_name: valuesRaw.company_name,
            location: valuesRaw.location,
            date_range: valuesRaw.date_range,
            github_link: valuesRaw.github_link,
            demo_link: valuesRaw.demo_link || "",
            link: valuesRaw.demo_link || "",
            technologies: valuesRaw.technologies,
            img_logo_name: imgLogoName,
            img_project_name: imgProjectName,
            title: valuesRaw.title,
         };

         const result = await createProjectAction(payload);
         setLoading(false);

         if (!result.status) {
            deleteWithFirebase(imgProjectName, FB_FOLDER_PROJECT);
            deleteWithFirebase(imgLogoName, FB_FOLDER_LOGO);
            toast.error(result.message);
            return;
         }

         createProjectForm.resetForm();
         setFileImgProject(null);
         setFileImgLogo(null);
         handleCloseDrawerMyProjectCreate();

         toast.success(result.message);
      },
   });

   return (
      <Drawer
         anchor={`right`}
         open={openDrawerMyProjectCreate}
         onClose={handleCloseDrawerMyProjectCreate}
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
            // onSubmit={createProjectForm.handleSubmit}
         >
            {/* header */}
            <Stack
               sx={{
                  height: `${heightHeader}`,
                  alignItems: `start`,
                  justifyContent: `center`,
                  p: `20px 20px 10px`,
               }}
            >
               <Typography sx={{ fontSize: `20px`, fontWeight: `700` }}>Create Project</Typography>
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
                  value={createProjectForm.values.category}
                  onChange={createProjectForm.handleChange}
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
                  value={createProjectForm.values.title}
                  onChange={createProjectForm.handleChange}
                  error={
                     createProjectForm.touched.title && createProjectForm.errors.title !== undefined
                  }
                  helperText={createProjectForm.touched.title && createProjectForm.errors.title}
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
                  value={createProjectForm.values.company_name}
                  onChange={createProjectForm.handleChange}
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
                  value={createProjectForm.values.location}
                  onChange={createProjectForm.handleChange}
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
                  value={createProjectForm.values.date_range}
                  onChange={createProjectForm.handleChange}
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
                  value={createProjectForm.values.technologies}
                  onChange={createProjectForm.handleChange}
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
                  value={createProjectForm.values.description}
                  onChange={createProjectForm.handleChange}
                  error={
                     createProjectForm.touched.description &&
                     createProjectForm.errors.description !== undefined
                  }
                  helperText={
                     (createProjectForm.touched.description &&
                        createProjectForm.errors.description) ||
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
                  value={createProjectForm.values.github_link}
                  onChange={createProjectForm.handleChange}
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
                  value={createProjectForm.values.demo_link}
                  onChange={createProjectForm.handleChange}
                  variant="outlined"
               />

               <Divider />

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
                              createProjectForm.setFieldValue("imgProject", file.name);
                           }
                        }}
                     />
                  </Button>
                  {fileImgProject && <PreviewImage file={fileImgProject} />}
                  {fileImgProject ? (
                     <FormHelperText sx={{ px: `14px` }}>{fileImgProject.name}</FormHelperText>
                  ) : (
                     <FormHelperText
                        sx={{ px: `14px` }}
                        error={
                           createProjectForm.touched.imgProject &&
                           createProjectForm.errors.imgProject !== undefined
                        }
                     >
                        {createProjectForm.touched.imgProject &&
                           createProjectForm.errors.imgProject}
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
                              createProjectForm.setFieldValue("imgLogo", file.name);
                           }
                        }}
                     />
                  </Button>
                  {fileImgLogo && <PreviewImage file={fileImgLogo} />}
                  {fileImgLogo ? (
                     <FormHelperText sx={{ px: `14px` }}>{fileImgLogo.name}</FormHelperText>
                  ) : (
                     <FormHelperText
                        sx={{ px: `14px` }}
                        error={
                           createProjectForm.touched.imgLogo &&
                           createProjectForm.errors.imgLogo !== undefined
                        }
                     >
                        {createProjectForm.touched.imgLogo && createProjectForm.errors.imgLogo}
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
               <Button onClick={handleCloseDrawerMyProjectCreate} sx={{ color: "#634e8c", fontWeight: 600, textTransform: "none" }}>
                  Cancel
               </Button>

               <LoadingButton
                  onClick={() => {
                     createProjectForm.handleSubmit();
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
                  Create Project
               </LoadingButton>
            </Stack>
         </Box>
      </Drawer>
   );
}
