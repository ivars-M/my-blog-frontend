import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import { Header, UsersBlock } from "./components";
import { ProfileEdit } from "./pages/ProfileEdit";
import Gallery from "./components/Gallery";

import {
  Home,
  UserPosts,
  FullPost,
  Registration,
  AddPost,
  Login,
} from "./pages";
import React from "react";
import { fetchAuthMe } from "./redux/slices/auth";
console.log("Komponentes:", {
  Home,
  FullPost,
  Login,
  Header,
  Gallery,
  UsersBlock,
  ProfileEdit,
});
function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tags/:name" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/user/:id" element={<UserPosts />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/UsersBlock" element={<UsersBlock />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
