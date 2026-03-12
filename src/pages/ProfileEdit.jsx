import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/slices/auth";

import axios from "../axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
  Paper,
} from "@mui/material";

export const ProfileEdit = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/auth/me")
      .then(({ data }) => {
        setFullName(data.fullName);
        setEmail(data.email);
        setAvatarUrl(data.avatarUrl);
      })
      .catch(() => alert("Neizdevās ielādēt profilu"));
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.patch("/auth/me", {
        fullName,
        email,
      });

      // 1. Atjauninām Redux store
      dispatch(updateUser(response.data));

      alert("Profils atjaunināts!");
    } catch (err) {
      alert("Neizdevās saglabāt izmaiņas");
    }
  };

  const handleAvatarChange = async (event) => {
    try {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);

      // 1. Augšupielādējam uz Cloudinary
      const { data } = await axios.post("/upload/avatar", formData);

      // 2. Saglabājam saiti lietotāja profilā
      await axios.patch("/auth/avatar", {
        avatarUrl: data.url, // Cloudinary pilnais URL
      });

      // 3. Ieteicams: Atjaunot datus Redux vai vienkārši:
      window.location.reload();
    } catch (err) {
      console.warn(err);
      alert("Neizdevās augšupielādēt avataru");
    }
  };
  const handlePasswordChange = async () => {
    if (newPassword !== repeatPassword) {
      alert("Jaunās paroles nesakrīt");
      return;
    }

    try {
      const res = await axios.patch("/auth/password", {
        oldPassword,
        newPassword,
      });

      dispatch(updateUser(res.data));

      alert("Parole veiksmīgi nomainīta!");
      setOldPassword("");
      setNewPassword("");
      setRepeatPassword("");
    } catch (err) {
      alert("Neizdevās nomainīt paroli");
    }
  };
  const isFullUrl = avatarUrl?.startsWith("http");
  const finalAvatarUrl = isFullUrl
    ? avatarUrl
    : avatarUrl
    ? `https://my-blog-backend-qniv.onrender.com${avatarUrl}`
    : "";

  return (
    <Paper sx={{ maxWidth: 500, mx: "auto", p: 4, mt: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Rediģēt profilu
      </Typography>

      <Stack spacing={2}>
        <Box textAlign="center">
          <Avatar
            src={finalAvatarUrl}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
          />
          <Button variant="outlined" component="label">
            Mainīt avataru
            <input type="file" hidden onChange={handleAvatarChange} />
          </Button>
        </Box>

        <TextField
          label="Vārds Uzvārds"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
        />

        <TextField
          label="E-pasts"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit}>
          Saglabāt izmaiņas
        </Button>
        <Typography variant="h6" mt={4}>
          Mainīt paroli
        </Typography>

        <TextField
          label="Vecā parole"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          fullWidth
        />

        <TextField
          label="Jaunā parole"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
        />

        <TextField
          label="Atkārtot jauno paroli"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          fullWidth
        />

        <Button variant="outlined" onClick={handlePasswordChange}>
          Saglabāt jauno paroli
        </Button>
      </Stack>
    </Paper>
  );
};
