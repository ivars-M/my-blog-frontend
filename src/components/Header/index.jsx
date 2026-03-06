import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "../../axios.js";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import Skeleton from "@mui/material/Skeleton";
// import Avatar from "@mui/material/Avatar";

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import UserMenu from "./UserMenu";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);

  const onClickLogout = () => {
    if (window.confirm("Tiešām gribat iziet?")) dispatch(logout());
    window.localStorage.removeItem("token");
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Sākums</div>
          </Link>

          {/* Labā puse */}
          <div className={styles.inner}>
            {/* Avatar vieta vienmēr pastāv */}
            <div className={styles.avatarWrapper}>
              {isAuth ? (
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
              ) : (
                <Skeleton variant="circular" width={40} height={40} />
              )}
            </div>
            <div className={styles.buttons}>
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
                  <Link to="/login" className={styles.loginBtn}>
                    <Button variant="outlined">Ieeja</Button>
                  </Link>
                  <Link to="/register" className={styles.registerBtn}>
                    <Button variant="contained">Izveidot profilu</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
