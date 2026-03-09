import React from "react";
// import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const UserMenu = ({ user, onDeleteProfile, onLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const avatarUrl = user?.avatarUrl;
  const isFullUrl = user?.avatarUrl?.startsWith("http");
  const finalAvatarUrl = isFullUrl
    ? user.avatarUrl
    : user?.avatarUrl
    ? `https://my-blog-backend-qniv.onrender.com${avatarUrl}`
    : undefined;

  console.log("Lietotāja bilde:", finalAvatarUrl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        src={finalAvatarUrl}
        sx={{
          width: 40,
          height: 40,
          marginRight: 1,
          cursor: "pointer",
          backgroundColor: user?.avatarUrl ? "transparent" : "#e5e5e5",
          color: "#555",
          fontWeight: 600,
          filter: user?.avatarUrl ? "none" : "brightness(1.4)",
        }}
        onClick={handleOpen}
      >
        {!user?.avatarUrl && user?.fullName?.[0]?.toUpperCase()}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            onDeleteProfile();
          }}
        >
          Dzēst profilu
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile/edit");
          }}
        >
          Rediģēt profilu
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            onLogout();
          }}
        >
          Iziet
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
