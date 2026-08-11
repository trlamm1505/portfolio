import { ExpandMore } from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";

type TProps = {
   item: any;
   pl: number;
};

export default function ListItemNav({ item, pl }: TProps) {
   const router = useRouter();
   const pathname = usePathname();

   const initOpen = (item: any) => {
      if (item.childrens.length > 0) {
         return item.childrens.some((chil: any) => {
            return initOpen(chil);
         });
      } else {
         return pathname.includes(item.path);
      }
   };

   const [open, setOpen] = useState(initOpen(item));

   const isButtonHaveToggle = item.childrens.length > 0;

   const handleClick = () => {
      if (isButtonHaveToggle) {
         setOpen(!open);
      } else {
         if (pathname.slice(1) === item.path) return;
         router.push(item.path, { scroll: false });
      }
   };

   const isSelected = pathname === item.path;

   return (
      <>
         <ListItemButton
            selected={isSelected}
            onClick={handleClick}
            sx={{
               pl: pl,
               borderRadius: "12px",
               mb: 0.8,
               transition: "all 0.2s ease",
               color: "#4c3a6b",
               "&.Mui-selected": {
                  backgroundColor: "#ebdffa",
                  borderLeft: "4px solid #8b5cf6",
                  "& .MuiListItemIcon-root": { color: "#8b5cf6" },
                  "& .MuiListItemText-primary": { color: "#5b21b6", fontWeight: 700 },
               },
               "&:hover": {
                  backgroundColor: "#f3eefc",
               },
            }}
         >
            <ListItemIcon sx={{ minWidth: 36, color: isSelected ? "#8b5cf6" : "#7c689c" }}>
               {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: "14px", fontWeight: isSelected ? 700 : 500 }} />
            {item.childrens.length > 0 && (
               <NavigateNextIcon sx={{ rotate: !open ? `0deg` : `90deg`, transition: `all .3s`, fontSize: "18px", color: "#9ca3af" }} />
            )}
         </ListItemButton>
         {item.childrens.length > 0 && (
            <Collapse in={open} timeout="auto" unmountOnExit>
               <List disablePadding>
                  {item.childrens.map((children: any, index: number) => {
                     const plNext = pl + 2;
                     return (
                        <Fragment key={index}>
                           <ListItemNav item={children} pl={plNext} />
                        </Fragment>
                     );
                  })}
               </List>
            </Collapse>
         )}
      </>
   );
}
