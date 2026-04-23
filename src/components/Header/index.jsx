import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { setSearchQuery } from "../../redux/slices/posts";

import {
  Button,
  Container,
  Skeleton,
  TextField,
  InputAdornment,
  // Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu"; // Svītriņu ikona

// import axios from "../../axios.js";
import UserMenu from "./UserMenu";
import styles from "./Header.module.scss";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchQuery = useSelector((state) => state.posts.searchQuery);
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);

  const toggleMenu = (open) => () => setMenuOpen(open);

  const handleLogout = () => {
    if (window.confirm("Tiešām gribat iziet?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
      setMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          {/* KREISĀ PUSE: Vienmēr redzams Logo un Meklētājs */}
          <div className={styles.leftSide}>
            <Link className={styles.logo} to="/">
              <div className={styles.logoText}>SĀKUMS</div>
            </Link>

            <TextField
              size="small"
              placeholder="Meklēt..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              className={styles.searchField}
            />
          </div>

          {/* LABĀ PUSE: Desktop pogas (paslēptas mobilajā versijā) */}
          <div className={styles.desktopNav}>
            {isAuth ? (
              <>
                <Link to="/usersblock">
                  <Button variant="text">Lietotāji</Button>
                </Link>
                <Link to="/gallery">
                  <Button variant="text">Galerija</Button>
                </Link>
                <Link to="/add-post">
                  <Button variant="contained">Izveidot rakstu</Button>
                </Link>
                {user ? (
                  <UserMenu user={user} onLogout={handleLogout} />
                ) : (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
                <Button onClick={handleLogout} color="error" variant="outlined">
                  Iziet
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Ieeja</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Reģistrēties</Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILĀ IZVĒLNES POGA (parādās tikai telefonā) */}
          <div className={styles.mobileMenuIcon}>
            <IconButton onClick={toggleMenu(true)}>
              <MenuIcon />
            </IconButton>
          </div>

          {/* MOBILĀS IZVĒLNES "DRAWER" */}
          <Drawer anchor="right" open={menuOpen} onClose={toggleMenu(false)}>
            <div className={styles.drawerList} onClick={toggleMenu(false)}>
              <List>
                {isAuth ? (
                  <>
                    <ListItem>
                      <Link to="/usersblock">Lietotāju saraksts</Link>
                    </ListItem>
                    <ListItem>
                      <Link to="/gallery">Galerija</Link>
                    </ListItem>
                    <ListItem>
                      <Link to="/add-post">Izveidot rakstu</Link>
                    </ListItem>
                    <ListItem
                      onClick={handleLogout}
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      Iziet
                    </ListItem>
                  </>
                ) : (
                  <>
                    <ListItem>
                      <Link to="/login">Ieeja</Link>
                    </ListItem>
                    <ListItem>
                      <Link to="/register">Reģistrēties</Link>
                    </ListItem>
                  </>
                )}
              </List>
            </div>
          </Drawer>
        </div>
      </Container>
    </div>
  );
};
