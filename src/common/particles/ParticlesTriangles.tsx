import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { Engine } from "@tsparticles/engine";
import { loadTrianglesPreset } from "@tsparticles/preset-triangles";

function ParticlesTriangles() {
   const [init, setInit] = useState(false);

   useEffect(() => {
      initParticlesEngine(async (engine: Engine) => {
         await loadTrianglesPreset(engine);
      }).then(() => {
         setInit(true);
      });
   }, []);

   if (!init) return null;

   return (
      <Particles
         id="ParticlesTriangles"
         options={{
            preset: "triangles",
            fullScreen: { enable: false, zIndex: -1 },
            background: {
               color: {
                  value: "",
               },
            },
            fpsLimit: 120,
            particles: {
               color: {
                  value: "#b388ff",
               },
               links: {
                  color: "#9575cd",
                  distance: 220,
                  enable: true,
                  opacity: 0.45,
                  width: 1.2,
               },
               collisions: {
                  enable: true,
               },
               move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                     default: "bounce",
                  },
                  random: false,
                  speed: 1,
                  straight: false,
               },
               number: {
                  density: {
                     enable: true,
                     width: 1920,
                     height: 1080,
                  },
                  value: 60,
               },
               opacity: {
                  value: 0.5,
               },
               shape: {
                  type: "circle",
               },
               size: {
                  value: { min: 1, max: 5 },
               },
            },
            detectRetina: true,
         }}
      />
   );
}
export default ParticlesTriangles;
