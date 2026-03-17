import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  currentUserId,
  onDelete,
}) => {
  const [showAll, setShowAll] = React.useState(false);

  const sortedComments = [...items].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const visibleComments = showAll ? sortedComments : sortedComments.slice(0, 5);

  return (
    <SideBlock title="Komentāri">
      <List sx={{ padding: 0 }}>
        {(isLoading ? [...Array(5)] : visibleComments).map((obj, index) => {
          const safeUser =
            obj?.user &&
            typeof obj.user === "object" &&
            Object.keys(obj.user).length > 0
              ? obj.user
              : { fullName: "Anonīms lietotājs", avatarUrl: null };

          // --- IZLABOTĀ GUDRA LOĢIKA ---
          const avatarUrl = safeUser.avatarUrl;
          const isFullUrl = avatarUrl?.startsWith("http");

          const finalAvatarPath =
            avatarUrl &&
            avatarUrl !== "null" &&
            avatarUrl !== "undefined" &&
            avatarUrl !== ""
              ? isFullUrl
                ? avatarUrl
                : `${axios.defaults.baseURL}${avatarUrl}`
              : "/no-avatar.png";
          // ----------------------------

          return (
            <React.Fragment key={index}>
              {isLoading ? (
                // ... (Skeleton daļa paliek nemainīga)
                <ListItem alignItems="flex-start" sx={{ padding: "8px 10px" }}>
                  <ListItemAvatar sx={{ minWidth: 45 }}>
                    <Skeleton variant="circular" width={30} height={30} />
                  </ListItemAvatar>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={20} width={100} />
                    <Skeleton variant="text" height={15} width={180} />
                  </div>
                </ListItem>
              ) : (
                <Link
                  to={`/posts/${obj.post?._id || obj.post}#comment-${obj._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem
                    alignItems="flex-start"
                    button
                    sx={{ padding: "8px 10px" }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar
                        alt={safeUser.fullName}
                        src={finalAvatarPath} // IZMAIŅA ŠEIT
                        sx={{ width: 30, height: 30 }}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={safeUser.fullName}
                      secondary={obj.text}
                      primaryTypographyProps={{
                        style: {
                          fontSize: "14px",
                          fontWeight: 600,
                          lineHeight: "1.2",
                        },
                      }}
                      secondaryTypographyProps={{
                        style: {
                          fontSize: "13px",
                          color: "#444",
                          lineHeight: "1.3",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        },
                      }}
                    />
                    {/* ... (dzēšanas poga paliek tāda pati) */}
                  </ListItem>

                  {!isLoading && currentUserId === obj.user?._id && (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault(); // Svarīgi: lai neaizietu uz linku!
                        onDelete(obj._id);
                      }}
                      sx={{
                        color: "rgba(0, 0, 0, 0.4)",
                        "&:hover": { color: "red" },
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                </Link>
              )}
              <Divider
                variant="inset"
                component="li"
                sx={{ marginLeft: "50px" }}
              />
            </React.Fragment>
          );
        })}
      </List>

      {/* Poga "Rādīt vairāk / mazāk" */}
      {!isLoading && items.length > 5 && (
        <div style={{ padding: "0 10px 10px 10px", textAlign: "center" }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              background: "none",
              border: "none",
              color: "#1976d2",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              padding: "5px 10px",
            }}
          >
            {showAll ? "Rādīt mazāk" : `Rādīt visus (${items.length})`}
          </button>
        </div>
      )}

      {children}
    </SideBlock>
  );
};
