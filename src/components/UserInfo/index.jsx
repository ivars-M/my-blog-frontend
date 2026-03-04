import React from "react";
// import { Link } from "react-router-dom";
import axios from "../../axios";
import Avatar from "@mui/material/Avatar";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ fullName, avatarUrl, additionalText }) => {
  const safeAvatar =
    avatarUrl &&
    avatarUrl !== "null" &&
    avatarUrl !== "undefined" &&
    avatarUrl !== "" &&
    !avatarUrl.includes("null")
      ? `${axios.defaults.baseURL}${avatarUrl}`
      : "/no-avatar.png";

  return (
    <div className={styles.root}>
      <Avatar
        className={styles.avatar}
        src={safeAvatar}
        alt={fullName || "Anonīms autors"}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName || "Anonīms autors"}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
