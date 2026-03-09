import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { fetchPosts, fetchTags } from "../redux/slices/posts.js";
import axios from "../axios";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const Home = () => {
  const { name } = useParams();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const [tabIndex, setTabIndex] = React.useState(0);

  // VIENS UN VIENĪGAIS useEffect rakstiem un tagiem
  React.useEffect(() => {
    dispatch(fetchPosts(name)); // 'name' nāks no useParams
    dispatch(fetchTags());
  }, [name, dispatch]); // Tiklīdz mainās tags URL, mēs pārlādējam

  // DROŠA kārtošana: pievienojam pārbaudi, vai items vispār ir masīvs
  const sortedPosts = React.useMemo(() => {
    if (!posts.items || !Array.isArray(posts.items)) return [];

    return [...posts.items].sort((a, b) => {
      return tabIndex === 0
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : b.viewsCount - a.viewsCount;
    });
  }, [posts.items, tabIndex]);

  // Komentāru ielāde (atstājam kā bija)
  const [latestComments, setLatestComments] = React.useState([]);
  React.useEffect(() => {
    axios
      .get("/comments")
      .then((res) => setLatestComments(res.data))
      .catch((err) => console.warn(err));
  }, []); // Ielādējam tikai vienreiz palaižot lapu

  console.log("Pašreizējie raksti:", posts.items);
  return (
    <>
      {name && <h2 style={{ marginBottom: 20 }}>Raksti ar tagu: #{name}</h2>}
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
      >
        <Tab label="Jauns" />
        <Tab label="Populārs" />
      </Tabs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* <Grid xs={8} item> */}
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl || ""}
                isFullPost={false}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={
                  userData?._id &&
                  obj.user?._id &&
                  userData._id === obj.user._id
                }
              />
            ),
          )}
        </Grid>

        {/* <Grid xs={4} item> */}
        <Grid item xs={12} md={4}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />

          <CommentsBlock
            items={latestComments}
            isLoading={false}
            currentUserId={null}
            onDelete={() => {}}
          />
        </Grid>
      </Grid>
    </>
  );
};
