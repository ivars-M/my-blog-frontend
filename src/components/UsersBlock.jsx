import React from "react";
import { SideBlock } from "./SideBlock";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import axios from "../axios";
import styles from "./UsersBlock.module.scss";

export const UsersBlock = ({
  items: propsItems,
  isLoading: propsLoading = true,
}) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!propsItems) {
      axios
        .get("/users")
        .then((res) => {
          setUsers(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.warn("Kļūda ielādējot lietotājus:", err);
          setLoading(false);
        });
    }
  }, [propsItems]);

  const finalItems = propsItems || users;
  const isDataLoading = propsItems ? propsLoading : loading;

  return (
    <div className={styles.root}>
      <SideBlock title="Lietotāju saraksts">
        <List className={styles.list}>
          {(isDataLoading ? [...Array(5)] : finalItems).map((obj, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" className={styles.userItem}>
                <ListItemAvatar>
                  {isDataLoading ? (
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

                {isDataLoading ? (
                  <div className={styles.skeletonWrapper}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={160} height={18} />
                  </div>
                ) : (
                  <ListItemText primary={obj.fullName} secondary={obj.email} />
                )}
              </ListItem>

              {index !== (isDataLoading ? 4 : finalItems.length - 1) && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      </SideBlock>
    </div>
  );
};
