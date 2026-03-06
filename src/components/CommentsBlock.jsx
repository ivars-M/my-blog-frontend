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
  const [showAll, setShowAll] = React.useState(false);

  const sortedComments = [...items].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const visibleComments = showAll
    ? sortedComments
    : sortedComments.slice(0, 10);

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
                <ListItem alignItems="flex-start" sx={{ padding: '8px 10px' }}>
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
                    sx={{ 
                      padding: '8px 10px', // Kompaktākas atkāpes
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar 
                        alt={safeUser.fullName} 
                        src={safeAvatar} 
                        sx={{ width: 30, height: 30 }} // Mazāks avatars
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={safeUser.fullName}
                      secondary={obj.text}
                      primaryTypographyProps={{ 
                        style: { fontSize: '14px', fontWeight: 600, lineHeight: '1.2' } 
                      }}
                      secondaryTypographyProps={{ 
                        style: { 
                          fontSize: '13px', 
                          color: '#444', 
                          lineHeight: '1.3',
                          display: '-webkit-box',
                          WebkitLineClamp: 2, // Neļauj vienam komentāram aizņemt visu ekrānu
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        } 
                      }}
                    />

                    {safeUser._id === currentUserId && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(obj._id);
                        }}
                        style={{
                          marginLeft: 10,
                          background: "#ffebee",
                          border: "none",
                          color: "#d32f2f",
                          cursor: "pointer",
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}
                      >
                        Dzēst
                      </button>
                    )}
                  </ListItem>
                </Link>
              )}
              <Divider variant="inset" component="li" sx={{ marginLeft: '50px' }} />
            </React.Fragment>
          );
        })}
      </List>

      {sortedComments.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            margin: "10px auto",
            display: "block",
            padding: "6px 12px",
            background: "transparent",
            color: "#1976d2",
            border: "1px solid #1976d2",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500"
          }}
        >
          {showAll ? "Rādīt mazāk" : `Rādīt vēl ${sortedComments.length - 10}`}
        </button>
      )}

      {children}
    </SideBlock>
  );
};


