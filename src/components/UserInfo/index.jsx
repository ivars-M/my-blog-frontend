import React from "react";
import axios from "../../axios";
import Avatar from "@mui/material/Avatar";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ fullName, avatarUrl, additionalText }) => {
  // 1. Pārbaudām, vai ir īsta bilde
  const hasAvatar =
    avatarUrl &&
    avatarUrl !== "null" &&
    avatarUrl !== "undefined" &&
    avatarUrl !== "";

  // 2. Veidojam ceļu tikai tad, ja ir bilde, citādi dodam undefined
  const finalAvatarPath = hasAvatar
    ? avatarUrl.startsWith("http")
      ? avatarUrl
      : `${axios.defaults.baseURL}${avatarUrl}`
    : undefined; // ŠIS IR SVARĪGI INICIĀĻIEM

  return (
    <div className={styles.root}>
      <Avatar
        className={styles.avatar}
        src={finalAvatarPath}
        alt={fullName || "Anonīms autors"}
      >
        {/* 3. Ja bildes nav (src ir undefined), rādīs šo burtu: */}
        {fullName ? fullName[0].toUpperCase() : "A"}
      </Avatar>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName || "Anonīms autors"}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
