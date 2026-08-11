"use client";

import { deleteContractAction, getContractsAction } from "@/actions/contract.action";
import { TContract } from "@/types/respon/contract.type";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import {
   Box,
   Button,
   Chip,
   Dialog,
   DialogActions,
   DialogContent,
   DialogTitle,
   IconButton,
   Paper,
   Stack,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Contract() {
   const [contracts, setContracts] = useState<TContract[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [selectedContract, setSelectedContract] = useState<TContract | null>(null);

   const fetchContracts = async () => {
      setLoading(true);
      const res = await getContractsAction();
      if (res.status && res.data) {
         setContracts(res.data);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchContracts();
   }, []);

   const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this contact message?")) return;
      const res = await deleteContractAction(id);
      if (res.status) {
         toast.success("Deleted contact message successfully");
         fetchContracts();
      } else {
         toast.error("Failed to delete contact message");
      }
   };

   return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="800" color="#3b1874">
               Contact Messages ({contracts.length})
            </Typography>
            <Button
               variant="outlined"
               size="small"
               onClick={fetchContracts}
               sx={{
                  borderColor: "#d4c2fc",
                  backgroundColor: "#ffffff",
                  color: "#6c2bd9",
                  fontWeight: 600,
                  "&:hover": { borderColor: "#8b5cf6", backgroundColor: "#f3eefc" },
               }}
            >
               Refresh
            </Button>
         </Stack>

         <TableContainer
            component={Paper}
            elevation={0}
            sx={{
               borderRadius: "20px",
               overflow: "hidden",
               backgroundColor: "#ffffff",
               border: "1px solid #e7ddfa",
               boxShadow: "0 4px 20px rgba(139, 92, 246, 0.05)",
            }}
         >
            <Table>
               <TableHead sx={{ backgroundColor: "#f4eeff" }}>
                  <TableRow>
                     <TableCell sx={{ fontWeight: "700", color: "#3b1874" }}>STT</TableCell>
                     <TableCell sx={{ fontWeight: "700", color: "#3b1874" }}>Name</TableCell>
                     <TableCell sx={{ fontWeight: "700", color: "#3b1874" }}>Email</TableCell>
                     <TableCell sx={{ fontWeight: "700", color: "#3b1874" }}>Subject</TableCell>
                     <TableCell sx={{ fontWeight: "700", color: "#3b1874" }}>Message</TableCell>
                     <TableCell sx={{ fontWeight: "700", color: "#3b1874" }}>Date</TableCell>
                     <TableCell align="center" sx={{ fontWeight: "700", color: "#3b1874" }}>
                        Action
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {loading ? (
                     <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                           Loading messages...
                        </TableCell>
                     </TableRow>
                  ) : contracts.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                           <Typography color="text.secondary">No contact messages received yet.</Typography>
                        </TableCell>
                     </TableRow>
                  ) : (
                     contracts.map((item, index) => (
                        <TableRow key={item._id} hover>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell sx={{ fontWeight: 600 }}>{item.name}</TableCell>
                           <TableCell>{item.email}</TableCell>
                           <TableCell>
                              <Chip
                                 label={item.subject || "No Subject"}
                                 size="small"
                                 color={item.subject ? "secondary" : "default"}
                                 variant="outlined"
                              />
                           </TableCell>
                           <TableCell sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.message}
                           </TableCell>
                           <TableCell sx={{ fontSize: "13px", color: "text.secondary" }}>
                              {new Date(item.createdAt).toLocaleString("vi-VN")}
                           </TableCell>
                           <TableCell align="center">
                              <Stack direction="row" spacing={1} justifyContent="center">
                                 <IconButton size="small" color="primary" onClick={() => setSelectedContract(item)}>
                                    <VisibilityRoundedIcon fontSize="small" />
                                 </IconButton>
                                 <IconButton size="small" color="error" onClick={() => handleDelete(item._id)}>
                                    <DeleteOutlineRoundedIcon fontSize="small" />
                                 </IconButton>
                              </Stack>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </TableContainer>

         {/* Message View Modal */}
         <Dialog open={Boolean(selectedContract)} onClose={() => setSelectedContract(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: "bold" }}>Contact Message Details</DialogTitle>
            <DialogContent dividers>
               {selectedContract && (
                  <Stack spacing={2}>
                     <Box>
                        <Typography variant="caption" color="text.secondary">
                           Sender Name
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                           {selectedContract.name}
                        </Typography>
                     </Box>
                     <Box>
                        <Typography variant="caption" color="text.secondary">
                           Sender Email
                        </Typography>
                        <Typography variant="body1">{selectedContract.email}</Typography>
                     </Box>
                     <Box>
                        <Typography variant="caption" color="text.secondary">
                           Subject
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                           {selectedContract.subject || "No Subject"}
                        </Typography>
                     </Box>
                     <Box>
                        <Typography variant="caption" color="text.secondary">
                           Message Content
                        </Typography>
                        <Paper sx={{ p: 2, mt: 1, backgroundColor: "rgba(255, 255, 255, 0.03)", whiteSpace: "pre-wrap" }}>
                           {selectedContract.message}
                        </Paper>
                     </Box>
                     <Box>
                        <Typography variant="caption" color="text.secondary">
                           Sent Time
                        </Typography>
                        <Typography variant="body2">{new Date(selectedContract.createdAt).toLocaleString("vi-VN")}</Typography>
                     </Box>
                  </Stack>
               )}
            </DialogContent>
            <DialogActions>
               <Button onClick={() => setSelectedContract(null)}>Close</Button>
            </DialogActions>
         </Dialog>
      </Box>
   );
}
