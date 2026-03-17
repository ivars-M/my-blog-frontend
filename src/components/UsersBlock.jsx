import React from "react";
import { SideBlock } from "./SideBlock";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";

export const UsersBlock = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Jaunie biedri">
      <List
        style={{
          maxHeight: "300px", // Ierobežojam augstumu
          overflowY: "auto", // Ieslēdzam vertikālo skrollēšanu
          scrollbarWidth: "thin", // Smuks skrollbārs Firefox pārlūkam
        }}
      >
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={obj.fullName}
                    src={
                      obj.avatarUrl
                        ? obj.avatarUrl.startsWith("http")
                          ? obj.avatarUrl
                          : `http://localhost:4444${obj.avatarUrl}`
                        : ""
                    }
                  />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" width={120} height={20} />
                  <Skeleton variant="text" width={160} height={18} />
                </div>
              ) : (
                <ListItemText primary={obj.fullName} secondary={obj.email} />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </SideBlock>
  );
};
