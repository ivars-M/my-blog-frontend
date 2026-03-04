import React from "react";
import axios from "../../axios";
import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";

export const Index = ({ postId, onAdd }) => {
  const [text, setText] = React.useState("");
  const user = useSelector((state) => state.auth.data);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await axios.post("/comments", {
        text,
        postId,
      });

      setText("");

      // Atjaunojam komentāru sarakstu
      if (onAdd) onAdd(data);
    } catch (err) {
      alert("Neizdevās pievienot komentāru");
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={
          user?.avatarUrl
            ? `${axios.defaults.baseURL}${user.avatarUrl}`
            : "/no-avatar.png"
        }
      />

      <div className={styles.form}>
        <TextField
          label="Uzrakstīt komentāru"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Button variant="contained" onClick={handleSubmit}>
          Nosūtīt
        </Button>
      </div>
    </div>
  );
};
