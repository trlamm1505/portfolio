"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "../header/Header";
import Nav from "../nav/Nav";
import Image from "next/image";
import { usePathname } from "next/navigation";

const basePath = `/images/layout/`;

type TProps = {
   children: ReactNode;
};

export default function MainLayout({ children }: TProps) {
   const pathname = usePathname();
   const [showCornerBg, setShowCornerBg] = useState(false);

   useEffect(() => {
      if (pathname === "/") {
         setShowCornerBg(false);
      } else {
         const timer = setTimeout(() => {
            setShowCornerBg(true);
         }, 450);
         return () => clearTimeout(timer);
      }
   }, [pathname]);

   return (
      <div
         style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
         }}
      >
         {/* Main Background SVG */}
         <Image
            fill
            src={`${basePath}bg.svg`}
            alt={`bg.svg`}
            priority
            style={{
               verticalAlign: "middle",
               position: "absolute",
               objectFit: "cover",
               zIndex: `-2`,
            }}
         />

         {/* Top-Left Splatter Image - Turned Purple with zero dark background */}
         <div
            style={{
               position: "fixed",
               top: 0,
               left: 0,
               zIndex: `-1`,
               width: "400px",
               height: "400px",
               pointerEvents: "none",
               mixBlendMode: "color-dodge",
               opacity: 0.9,
               filter: "hue-rotate(250deg) saturate(2) contrast(300%) brightness(1.3)",
               maskImage: "linear-gradient(135deg, black 35%, transparent 75%)",
               WebkitMaskImage: "linear-gradient(135deg, black 35%, transparent 75%)",
            }}
         >
            <Image
               src={`${basePath}top-left.png`}
               alt="top-left decoration"
               width={400}
               height={400}
               style={{ width: "100%", height: "auto" }}
               priority
            />
         </div>

         {/* Bottom-Right Explosion Graphic - 100% Responsive Flush Corner */}
         {showCornerBg && (
            <div
               style={{
                  position: "fixed",
                  bottom: 0,
                  right: 0,
                  zIndex: `-1`,
                  width: "720px",
                  height: "720px",
                  transform: "translate(35%, 35%)",
                  pointerEvents: "none",
                  mixBlendMode: "color-dodge",
                  opacity: 0.85,
                  filter: "hue-rotate(220deg) saturate(1.4) blur(2px)",
               }}
            >
               <Image
                  src={`/images/home/bg-explosion.png`}
                  alt="bg-explosion decoration"
                  width={720}
                  height={720}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  priority
               />
            </div>
         )}

         <Nav />
         <Header />
         <main style={{ overflowY: `auto`, height: `100vh`, position: "relative", zIndex: 1 }}>{children}</main>
      </div>
   );
}
