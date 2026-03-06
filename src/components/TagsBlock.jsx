import React from "react";
// import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";
export const TagsBlock = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Tags">
      <List sx={{ 
        display: 'flex',       // Izvieto tagus rindā
        flexWrap: 'wrap',     // Ja rinda pilna, pāriet nākamajā
        gap: '5px',           // Atstarpe starp tagiem
        padding: '10px' 
      }}>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <a
            style={{ textDecoration: 'none', color: 'black' }}
            href={`/tags/${name}`}
            key={i}
          >
            <ListItem 
              disablePadding 
              sx={{ width: 'auto' }} // Svarīgi: noņem 100% platumu
            >
              <ListItemButton sx={{ 
                borderRadius: '20px',    // Padara tagu apaļu
                backgroundColor: '#f3f3f3', 
                padding: '4px 12px',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}>
                <ListItemIcon style={{ minWidth: 25 }}>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={40} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </a>
        ))}
      </List>
    </SideBlock>
  );
};


// export const TagsBlock = ({ items, isLoading = true }) => {
//   return (
//     <SideBlock title="Tags">
//       <List>
//         {(isLoading ? [...Array(6)] : items).map((name, i) => (
//           <ListItem key={i} disablePadding>
//             <ListItemButton
//               component={Link}
//               to={`/tag/${name}`} // ← PAREIZS URL + React Router navigācija
//             >
//               <ListItemIcon>
//                 <TagIcon />
//               </ListItemIcon>

//               {isLoading ? (
//                 <Skeleton width={100} />
//               ) : (
//                 <ListItemText primary={name} />
//               )}
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </SideBlock>
//   );
// };
