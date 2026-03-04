import React from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

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
  // 🔥 Rādīt vairāk / mazāk state
  const [showAll, setShowAll] = React.useState(false);

  // 🔥 Sakārtojam komentārus (jaunākie augšā)
  const sortedComments = [...items].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // 🔥 Rādām tikai 10, ja showAll = false
  const visibleComments = showAll
    ? sortedComments
    : sortedComments.slice(0, 10);

  return (
    <SideBlock title="Komentāri">
      <List>
        {(isLoading ? [...Array(5)] : visibleComments).map((obj, index) => {
          const safeUser =
            obj?.user &&
            typeof obj.user === "object" &&
            Object.keys(obj.user).length > 0
              ? obj.user
              : { fullName: "Anonīms lietotājs", avatarUrl: null };

          const safeAvatar =
            safeUser.avatarUrl &&
            safeUser.avatarUrl !== "null" &&
            safeUser.avatarUrl !== "undefined" &&
            safeUser.avatarUrl !== "" &&
            !safeUser.avatarUrl.includes("null")
              ? `${axios.defaults.baseURL}${safeUser.avatarUrl}`
              : "/no-avatar.png";

          return (
            <React.Fragment key={index}>
              {isLoading ? (
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                </ListItem>
              ) : (
                <Link
                  to={`/posts/${obj.post?._id || obj.post}#comment-${obj._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItem alignItems="flex-start" button>
                    <ListItemAvatar>
                      <Avatar alt={safeUser.fullName} src={safeAvatar} />
                    </ListItemAvatar>

                    <ListItemText
                      primary={safeUser.fullName}
                      secondary={obj.text}
                    />

                    {safeUser._id === currentUserId && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(obj._id);
                        }}
                        style={{
                          marginLeft: 10,
                          background: "transparent",
                          border: "none",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        Dzēst
                      </button>
                    )}
                  </ListItem>
                </Link>
              )}

              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>

      {/* 🔥 Rādīt vairāk / mazāk poga */}
      {sortedComments.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: 10,
            padding: "8px 16px",
            background: "#1976d2",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showAll ? "Rādīt mazāk" : "Rādīt vairāk"}
        </button>
      )}

      {children}
    </SideBlock>
  );
};
