"use client";

import { loginAction } from "@/actions/login.action";
import { ROUTER } from "@/constants/router.constant";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
   Box,
   Button,
   Container,
   IconButton,
   InputAdornment,
   Paper,
   Stack,
   TextField,
   Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const inputLabelProps = { sx: { color: "#5b21b6", fontWeight: 600 } };
const inputPropsBase = {
   color: "#221638",
   backgroundColor: "#fcfaff",
   borderRadius: "14px",
   fontWeight: 500,
   "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 100px #fcfaff inset !important",
      WebkitTextFillColor: "#221638 !important",
      borderRadius: "14px",
   },
};

export default function Login() {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);

   const handleClickShowPassword = () => setShowPassword((show) => !show);

   const loginForm = useFormik({
      initialValues: {
         email: ``,
         password: ``,
      },
      validationSchema: Yup.object({
         email: Yup.string()
            .trim()
            .required(`Email is required`)
            .email(`Invalid email. Please try again.`),
         password: Yup.string().required(`Password is required`),
      }),
      onSubmit: async (values: any) => {
         setLoading(true);
         const result = await loginAction(values);
         setLoading(false);

         if (!result.status) return toast.error(result.message);

         toast.success("Welcome back! Redirecting to Dashboard...");
         router.push(ROUTER.ADMIN.DASHBOARD);
      },
   });

   return (
      <Box
         sx={{
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f0fc",
            backgroundImage: "linear-gradient(135deg, #f8f5fd 0%, #ede4fc 100%)",
            position: "relative",
            overflow: "hidden",
            px: 2,
         }}
      >
         {/* Background ambient light */}
         <Box
            sx={{
               position: "absolute",
               width: "650px",
               height: "650px",
               background: "radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, transparent 70%)",
               filter: "blur(70px)",
               pointerEvents: "none",
            }}
         />

         <Container maxWidth="xs">
            <Paper
               elevation={0}
               sx={{
                  p: { xs: 3.5, sm: 4.5 },
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e7ddfa",
                  boxShadow: "0 20px 50px rgba(139, 92, 246, 0.12)",
               }}
            >
               {/* Logo & Header */}
               <Stack spacing={1} alignItems="center" mb={4}>
                  <Typography variant="h4" fontWeight="800" color="#3b1874" sx={{ letterSpacing: "-0.5px" }}>
                     quoc<Box component="span" sx={{ color: "#8b5cf6" }}>lam.</Box>
                  </Typography>
                  <Typography variant="body2" color="#634e8c" textAlign="center" fontWeight="500">
                     Admin Control Panel Sign In
                  </Typography>
               </Stack>

               {/* Form */}
               <Stack component="form" onSubmit={loginForm.handleSubmit} spacing={3}>
                  <TextField
                     fullWidth
                     name="email"
                     label="Email Address"
                     variant="outlined"
                     value={loginForm.values.email}
                     onChange={loginForm.handleChange}
                     error={loginForm.touched.email && Boolean(loginForm.errors.email)}
                     helperText={loginForm.touched.email && (loginForm.errors.email as string)}
                     InputLabelProps={inputLabelProps}
                     InputProps={{
                        sx: inputPropsBase,
                        startAdornment: (
                           <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "#8b5cf6" }} />
                           </InputAdornment>
                        ),
                     }}
                  />

                  <TextField
                     fullWidth
                     name="password"
                     label="Password"
                     type={showPassword ? "text" : "password"}
                     variant="outlined"
                     value={loginForm.values.password}
                     onChange={loginForm.handleChange}
                     error={loginForm.touched.password && Boolean(loginForm.errors.password)}
                     helperText={loginForm.touched.password && (loginForm.errors.password as string)}
                     InputLabelProps={inputLabelProps}
                     InputProps={{
                        sx: inputPropsBase,
                        startAdornment: (
                           <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "#8b5cf6" }} />
                           </InputAdornment>
                        ),
                        endAdornment: (
                           <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword} edge="end" sx={{ color: "#8b5cf6" }}>
                                 {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                           </InputAdornment>
                        ),
                     }}
                  />

                  <Button
                     type="submit"
                     disabled={loading}
                     fullWidth
                     size="large"
                     sx={{
                        py: 1.5,
                        borderRadius: "14px",
                        background: "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
                        color: "#ffffff",
                        fontWeight: "700",
                        fontSize: "16px",
                        textTransform: "none",
                        boxShadow: "0 8px 25px rgba(139, 92, 246, 0.35)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                           background: "linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%)",
                           boxShadow: "0 10px 30px rgba(139, 92, 246, 0.5)",
                           transform: "translateY(-1px)",
                        },
                     }}
                  >
                     {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <Typography
                     onClick={() => router.push(ROUTER.ADMIN.AUTH.REGISTER)}
                     variant="body2"
                     sx={{
                        color: "#634e8c",
                        cursor: "pointer",
                        textAlign: "center",
                        mt: 1,
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#8b5cf6" },
                     }}
                  >
                     Don't have an account? <Box component="span" sx={{ color: "#8b5cf6", fontWeight: 700 }}>Register now</Box>
                  </Typography>
               </Stack>
            </Paper>
         </Container>
      </Box>
   );
}
