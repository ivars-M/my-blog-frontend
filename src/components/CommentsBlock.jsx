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

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  const sortedComments = [...items].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <SideBlock title="Komentāri">
      <List
        sx={{
          padding: 0,
          maxHeight: "400px", // Te tu vari regulēt, cik garu gribi to logu
          overflowY: "auto", // Ieslēdz skrollbāru
          "&::-webkit-scrollbar": { width: "5px" }, // Uztaisa smuku, tievu skrollbāru
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "10px",
          },
        }}
      >
        {(isLoading ? [...Array(5)] : sortedComments).map((obj, index) => {
          const safeUser =
            obj?.user &&
            typeof obj.user === "object" &&
            Object.keys(obj.user).length > 0
              ? obj.user
              : { fullName: "Anonīms lietotājs", avatarUrl: null };

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

          return (
            <React.Fragment key={index}>
              {isLoading ? (
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
                  </ListItem>
                </Link>
              )}
              {index < (isLoading ? 4 : sortedComments.length - 1) && (
                <Divider
                  variant="inset"
                  component="li"
                  sx={{ marginLeft: "50px" }}
                />
              )}
            </React.Fragment>
          );
        })}
      </List>

      {!isLoading && items.length > 5 && (
        <div style={{ padding: "0 10px 10px 10px", textAlign: "center" }}></div>
      )}

      {children}
    </SideBlock>
  );
};
