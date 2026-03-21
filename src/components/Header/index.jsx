import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { setSearchQuery } from "../../redux/slices/posts";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Avatar } from "@mui/material";

import axios from "../../axios.js";
import UserMenu from "./UserMenu";
import styles from "./Header.module.scss";

export const Header = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.posts.searchQuery);
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);

  // Šis būs vajadzīgs meklētājam vēlāk (Home lapā)
  // const [searchValue, setSearchValue] = React.useState("");
  const onChangeSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const onClickLogout = () => {
    if (window.confirm("Tiešām gribat iziet?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          {/* KREISĀ PUSE: Logo un Meklētājs */}
          <div
            className={styles.leftSide}
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            <Link className={styles.logo} to="/">
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>SĀKUMS</div>
            </Link>

            {/* JAUNAIS MEKLĒTĀJS */}
            <TextField
              size="small"
              placeholder="Meklēt..."
              variant="outlined"
              value={searchQuery}
              onChange={onChangeSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                width: { xs: "150px", sm: "250px" }, // xs (telefons) būs 150px, sm (dators) būs 250px
                transition: "width 0.3s", // Smukam efektam
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" }, // Ja gribi modernāku izskatu bez rāmja
                },
              }}
            />
          </div>

          {/* LABĀ PUSE: Avatars un Pogas */}
          <div
            className={styles.buttons}
            style={{ display: "flex", alignItems: "center", gap: "15px" }}
          >
            <div className={styles.avatarWrapper}>
              {/* Tikai ja ielogojies UN dati ir atnākuši, rādām UserMenu */}
              {isAuth && user ? (
                <UserMenu
                  user={user}
                  onDeleteProfile={() => {
                    if (window.confirm("Vai tiešām dzēst profilu?")) {
                      axios.delete("/auth/me").then(() => {
                        window.localStorage.removeItem("token");
                        window.location.reload();
                      });
                    }
                  }}
                  onLogout={() => {
                    window.localStorage.removeItem("token");
                    window.location.reload();
                  }}
                />
              ) : isAuth ? (
                // Ja ir ielogojies, bet dati vēl lādējas
                <Skeleton variant="circular" width={40} height={40} />
              ) : (
                /* ŠIS PARĀDĪSIES, KAD BŪSI IZLOGOJIES */
                <Avatar sx={{ width: 40, height: 40, bgcolor: "#e5e5e5" }} />
              )}
            </div>

            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Rakstīt postu</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Iziet
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Ieeja</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Izveidot profilu</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
