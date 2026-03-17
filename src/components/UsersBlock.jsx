import React from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import axios from "../axios";

export const UsersBlock = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Jaunie biedri">
      <List sx={{ padding: 0 }}>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ padding: "8px 10px" }}>
              <ListItemAvatar sx={{ minWidth: 45 }}>
                {isLoading ? (
                  <Skeleton variant="circular" width={30} height={30} />
                ) : (
                  <Avatar
                    alt={obj.fullName}
                    src={
                      obj.avatarUrl
                        ? obj.avatarUrl.startsWith("http")
                          ? obj.avatarUrl
                          : `${axios.defaults.baseURL}${obj.avatarUrl}`
                        : "/no-avatar.png"
                    }
                    sx={{ width: 30, height: 30 }}
                  />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={20} width={100} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.fullName}
                  primaryTypographyProps={{
                    style: { fontSize: "14px", fontWeight: 600 },
                  }}
                />
              )}
            </ListItem>
            {index < (isLoading ? 4 : items.length - 1) && (
              <Divider
                variant="inset"
                component="li"
                sx={{ marginLeft: "50px" }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
    </SideBlock>
  );
};
