import React from "react";
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

  // 1. GUDRAIS URL: Ja bildes nav, obligāti atgriežam undefined
  const avatarUrl = user?.avatarUrl;
  const finalAvatarUrl = avatarUrl
    ? avatarUrl.startsWith("http")
      ? avatarUrl
      : `https://my-blog-backend-qniv.onrender.com${avatarUrl}`
    : undefined;

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
          // Ja ir bilde, fons caurspīdīgs, ja nav - smuks pelēks iniciālim
          backgroundColor: finalAvatarUrl ? "transparent" : "#1976d2",
          color: "#fff",
          fontWeight: 600,
        }}
        onClick={handleOpen}
      >
        {/* Šis parādīsies tikai tad, ja finalAvatarUrl ir undefined */}
        {user?.fullName ? user.fullName[0].toUpperCase() : "U"}
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
            {user?.fullName || "Lietotājs"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || ""}
          </Typography>
        </Box>

        <Divider />

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
            onDeleteProfile();
          }}
          sx={{ color: "error.main" }}
        >
          Dzēst profilu
        </MenuItem>

        <Divider />

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
