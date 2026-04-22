import React from "react";
import { SideBlock } from "./SideBlock";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import axios from "../axios"; // Pārliecinies, ka ceļš uz tavu axios instanci ir pareizs
import styles from "./UsersBlock.module.scss"; // IMPORTĒJAM STILUS

export const UsersBlock = ({
  items: propsItems,
  isLoading: propsLoading = true,
}) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Ja items netiek padoti caur props (no App.js), ielādējam tos no servera
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

  // Izlemjam, kurus datus rādīt: no props vai no lokālā fetch
  const finalItems = propsItems || users;
  const isDataLoading = propsItems ? propsLoading : loading;

  return (
    <div className={styles.root}>
    <SideBlock title="Lietotāju saraksts">
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
        {(isDataLoading ? [...Array(5)] : finalItems).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" width={120} height={20} />
                  <Skeleton variant="text" width={160} height={18} />
                </div>
              ) : (
                <ListItemText primary={obj.fullName} secondary={obj.email} />
              )}
            </ListItem>
            {/* Pievienojam atdalītāju visiem, izņemot pēdējo */}
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
