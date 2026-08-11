import { ROUTER } from "@/constants/router.constant";

type TProps = {
   color?: string;
   dotColor?: string;
};

export default function Logo({ color = "#ffffff", dotColor = "#8b5cf6" }: TProps) {
   return (
      <a
         href={ROUTER.HOME}
         style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
         }}
      >
         <span
            style={{
               fontSize: "32px",
               fontFamily: "var(--font-sora), sans-serif",
               letterSpacing: "-0.5px",
            }}
         >
            <span style={{ fontWeight: "700", color: color }}>quoc </span>
            <span style={{ fontWeight: "300", color: color }}>lam</span>
            <span style={{ color: dotColor, fontWeight: "700" }}>.</span>
         </span>
      </a>
   );
}
