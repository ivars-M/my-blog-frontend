import React from "react";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button"; // Pievieno šo
import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true }) => {
  const [showAll, setShowAll] = React.useState(false);

  // Ja ielādējas, rādām skeletonus, ja nē - filtrējam pēc showAll
  const visibleTags = showAll ? items : items.slice(0, 7);

  return (
    <SideBlock title="Tagi">
      <List
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          padding: "10px",
        }}
      >
        {(isLoading ? [...Array(9)] : visibleTags).map((name, i) => (
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

      {/* POGA "RĀDĪT VAIRĀK / MAZĀK" */}
      {!isLoading && items.length > 7 && (
        <div style={{ padding: "0 10px 10px 10px" }}>
          <Button
            onClick={() => setShowAll(!showAll)}
            size="small"
            fullWidth
            sx={{ fontSize: "12px", textTransform: "none" }}
          >
            {showAll ? "Rādīt mazāk" : `Rādīt visus (${items.length})`}
          </Button>
        </div>
      )}
    </SideBlock>
  );
};
