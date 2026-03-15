import React from "react";
import axios from "../../axios";
import Avatar from "@mui/material/Avatar";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ fullName, avatarUrl, additionalText }) => {
  // 1. Pārbaudām, vai avatarUrl vispār eksistē un nav kļūdains
  const hasAvatar =
    avatarUrl &&
    avatarUrl !== "null" &&
    avatarUrl !== "undefined" &&
    avatarUrl !== "";

  // 2. GUDRA SAITE: Ja tā sākas ar "http", izmantojam to pašu.
  // Ja nē (vecās bildes), pieliekam servera adresi.
  const finalAvatarPath = hasAvatar
    ? avatarUrl.startsWith("http")
      ? avatarUrl
      : `${axios.defaults.baseURL}${avatarUrl}`
    : "/no-avatar.png";

  return (
    <div className={styles.root}>
      <div className={styles.root}>
        <Avatar
          className={styles.avatar}
          // Ja finalAvatarPath satur bildi (nav tukšs), rādām to
          src={finalAvatarPath || undefined}
          alt={fullName}
        >
          {fullName ? fullName[0].toUpperCase() : "A"}
        </Avatar>
      </div>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName || "Anonīms autors"}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
