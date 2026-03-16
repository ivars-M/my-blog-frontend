import React from "react";
import axios from "../../axios";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import { fetchRemovePost } from "../../redux/slices/posts";
import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable,
  onPostDelete,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. GUDRA LOĢIKA LIELAJAI BILDEI
  const isImageFullUrl = imageUrl?.startsWith("http");
  const finalImageUrl = isImageFullUrl
    ? imageUrl
    : imageUrl
    ? `${axios.defaults.baseURL}${imageUrl}`
    : "";

  // 2. GUDRA LOĢIKA AVATĀRAM
  const isFullAvatar = user?.avatarUrl?.startsWith("http");
  const finalAvatarUrl = isFullAvatar
    ? user.avatarUrl
    : user?.avatarUrl
    ? `${axios.defaults.baseURL}${user.avatarUrl}`
    : "";

  if (isLoading) {
    return <PostSkeleton />;
  }

  const onClickRemove = () => {
    if (window.confirm("Tiešām gribat dzēst rakstu?")) {
      dispatch(fetchRemovePost(id));
      navigate("/");
      if (onPostDelete) {
        onPostDelete();
      }
    }
  };

  const hasImage =
    imageUrl &&
    imageUrl !== "null" &&
    imageUrl !== "undefined" &&
    imageUrl.trim() !== "";

  function formatDate(iso) {
    return new Date(iso).toLocaleString("lv-LV", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      {hasImage && (
        <img
          className={clsx(isFullPost ? styles.imageFull : styles.imageSmall)}
          src={finalImageUrl} // IZMAIŅA ŠEIT: izmantojam finalImageUrl
          alt={title}
        />
      )}

      <div className={styles.wrapper}>
        <div className={styles.indention}>
          {/* UserInfo tagad saņem jau apstrādātu avataru */}
          <UserInfo
            _id={user?._id}
            fullName={user?.fullName || "Anonīms autors"}
            avatarUrl={finalAvatarUrl}
            additionalText={formatDate(createdAt)}
          />

          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>

          <ul className={styles.tags}>
            {tags &&
              tags.map((name) => (
                <li key={name}>
                  <Link to={`/tags/${name}`}>#{name}</Link>
                </li>
              ))}
          </ul>

          {children && <div className={styles.content}>{children}</div>}

          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
