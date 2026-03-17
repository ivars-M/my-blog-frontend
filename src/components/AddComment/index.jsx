import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const Index = ({ postId, onAdd }) => {
  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const user = useSelector((state) => state.auth.data);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      setIsLoading(true);
      const { data } = await axios.post("/comments", {
        text,
        postId,
      });

      setText("");
      if (onAdd) onAdd(data);
    } catch (err) {
      console.warn(err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Komentēt var tikai reģistrēti lietotāji!");
      } else {
        alert("Neizdevās pievienot komentāru. Mēģiniet vēlreiz!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAVA IZMAIŅA: JA LIETOTĀJS NAV IELOGOJIES ---
  if (!user) {
    return (
      <div
        className={styles.root}
        style={{
          padding: "20px",
          border: "1px dashed #ccc",
          borderRadius: "10px",
          textAlign: "center",
          marginBottom: "20px", // Pievienoju mazliet atstarpi apakšā
        }}
      >
        <p style={{ margin: "0 0 10px 0" }}>
          Tikai reģistrēti lietotāji var pievienot komentārus.
        </p>
        <Link
          to="/login"
          style={{
            color: "#1976d2",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Ielogoties
        </Link>
      </div>
    );
  }

  // --- JA LIETOTĀJS IR IELOGOJIES ---
  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={
          user?.avatarUrl
            ? user.avatarUrl.startsWith("http")
              ? user.avatarUrl
              : `${axios.defaults.baseURL}${user.avatarUrl}`
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
          disabled={isLoading}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? "Sūta..." : "Nosūtīt"}
        </Button>
      </div>
    </div>
  );
};
