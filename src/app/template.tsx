"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
   const [progress, setProgress] = useState(0);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      setProgress(0);
      setIsLoading(true);

      const interval = setInterval(() => {
         setProgress((prev) => {
            if (prev >= 100) {
               clearInterval(interval);
               setTimeout(() => setIsLoading(false), 120);
               return 100;
            }
            return prev + Math.floor(Math.random() * 3) + 2;
         });
      }, 32);

      return () => clearInterval(interval);
   }, []);

   return (
      <>
         {children}

         <AnimatePresence>
            {isLoading && (
               <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                     position: "fixed",
                     top: 0,
                     left: 0,
                     width: "100vw",
                     height: "100vh",
                     zIndex: 9999,
                     backgroundColor: "#000000",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     padding: "20px",
                  }}
               >
                  <motion.div
                     initial={{ scale: 0.94, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.97, opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     style={{
                        width: "100%",
                        maxWidth: "520px",
                        backgroundColor: "#0b0c10",
                        borderRadius: "10px",
                        border: "1px solid rgba(179, 136, 255, 0.35)",
                        boxShadow:
                           "0px 15px 45px rgba(0, 0, 0, 0.95), 0px 0px 30px rgba(179, 136, 255, 0.22)",
                        overflow: "hidden",
                        fontFamily:
                           "'Courier New', Courier, monospace, sans-serif",
                     }}
                  >
                     {/* Terminal Window Header */}
                     <div
                        style={{
                           backgroundColor: "#13141c",
                           padding: "10px 14px",
                           display: "flex",
                           alignItems: "center",
                           gap: "8px",
                           borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                     >
                        <span
                           style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: "#ff5f56",
                              display: "inline-block",
                           }}
                        ></span>
                        <span
                           style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: "#ffbd2e",
                              display: "inline-block",
                           }}
                        ></span>
                        <span
                           style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: "#27c93f",
                              display: "inline-block",
                           }}
                        ></span>
                     </div>

                     {/* Terminal Body Content */}
                     <div style={{ padding: "22px 20px", color: "#b388ff" }}>
                        <div
                           style={{
                              fontSize: "17px",
                              fontWeight: "600",
                              marginBottom: "18px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              textShadow: "0px 0px 12px rgba(179, 136, 255, 0.85)",
                           }}
                        >
                           <span style={{ fontWeight: "bold" }}>$</span> Loading...
                        </div>

                        <div
                           style={{
                              fontSize: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              width: "100%",
                           }}
                        >
                           <span
                              style={{
                                 color: "#b388ff",
                                 fontWeight: "bold",
                                 fontSize: "17px",
                              }}
                           >
                              [
                           </span>

                           <div
                              style={{
                                 flexGrow: 1,
                                 height: "14px",
                                 position: "relative",
                                 display: "flex",
                                 alignItems: "center",
                                 overflow: "hidden",
                                 borderRadius: "2px",
                              }}
                           >
                              {/* Dotted Background Track */}
                              <div
                                 style={{
                                    position: "absolute",
                                    width: "100%",
                                    color: "rgba(209, 196, 233, 0.35)",
                                    letterSpacing: "2.5px",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    fontSize: "14px",
                                    lineHeight: "1",
                                    userSelect: "none",
                                 }}
                              >
                                 ····································································································································
                              </div>

                              {/* Glowing Purple Fill Bar */}
                              <div
                                 style={{
                                    height: "11px",
                                    width: `${progress}%`,
                                    background:
                                       "linear-gradient(90deg, #7c4dff 0%, #b388ff 100%)",
                                    borderRadius: "2px",
                                    boxShadow:
                                       "0px 0px 14px #b388ff, 0px 0px 25px rgba(179, 136, 255, 0.8)",
                                    transition: "width 0.08s linear",
                                    zIndex: 2,
                                 }}
                              />
                           </div>

                           <span
                              style={{
                                 color: "#b388ff",
                                 fontWeight: "bold",
                                 fontSize: "17px",
                              }}
                           >
                              ]
                           </span>

                           <span
                              style={{
                                 color: "#b388ff",
                                 fontWeight: "bold",
                                 fontSize: "15px",
                                 minWidth: "48px",
                                 textAlign: "right",
                                 textShadow: "0px 0px 10px rgba(179, 136, 255, 0.85)",
                              }}
                           >
                              {progress}%
                           </span>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}
