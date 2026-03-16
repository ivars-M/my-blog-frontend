import React from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import Avatar from "@mui/material/Avatar";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ _id, fullName, avatarUrl, additionalText }) => {
  const hasAvatar =
    avatarUrl &&
    avatarUrl !== "null" &&
    avatarUrl !== "undefined" &&
    avatarUrl !== "";

  const finalAvatarPath = hasAvatar
    ? avatarUrl.startsWith("http")
      ? avatarUrl
      : `${axios.defaults.baseURL}${avatarUrl}`
    : undefined;

  // 1. Pārbaudām, vai mums ir lietotāja ID
  const isLinkable = Boolean(_id);

  return (
    <div className={styles.root}>
      {/* Ja ID ir, ietinam Avataru linkā, ja nav - rādām parastu Avataru */}
      {isLinkable ? (
        <Link to={`/user/${_id}`}>
          <Avatar
            className={styles.avatar}
            src={finalAvatarPath}
            alt={fullName}
          >
            {fullName ? fullName[0].toUpperCase() : "A"}
          </Avatar>
        </Link>
      ) : (
        <Avatar className={styles.avatar} src={finalAvatarPath} alt={fullName}>
          {fullName ? fullName[0].toUpperCase() : "A"}
        </Avatar>
      )}

      <div className={styles.userDetails}>
        {/* 2. Galvenā maģija šeit: ja ir ID, rādām Linku, ja nav - rādām parastu span */}
        {isLinkable ? (
          <Link to={`/user/${_id}`} className={styles.userName}>
            {fullName || "Anonīms autors"}
          </Link>
        ) : (
          <span className={styles.userNameStatic}>
            {fullName || "Anonīms autors"}
          </span>
        )}
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
