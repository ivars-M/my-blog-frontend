import React from "react";
import { Link } from "react-router-dom"; // Pārliecinies, ka izmanto Link no react-router-dom
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
      <List
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          padding: "10px",
        }}
      >
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          /* IZMAIŅA: Izmantojam komponenti 'component={Link}' tieši ListItemButton */
          <ListItem key={i} disablePadding sx={{ width: "auto" }}>
            {isLoading ? (
              <ListItemButton disabled>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <TagIcon />
                </ListItemIcon>
                <Skeleton width={40} />
              </ListItemButton>
            ) : (
              <ListItemButton
                component={Link}
                to={`/tags/${name}`}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#f3f3f3",
                  padding: "4px 12px",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
