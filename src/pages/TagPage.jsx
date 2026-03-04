import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { Post } from "../components/Post";
import Grid from "@mui/material/Grid";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export const TagPage = () => {
  const dispatch = useDispatch();
  const { tag } = useParams(); // ← te dabūjam tagu no URL
  const { posts } = useSelector((state) => state.posts);
  const [tabIndex, setTabIndex] = React.useState(0);

  React.useEffect(() => {
    dispatch(fetchPosts, fetchTags()); // ← ielādējam visus postus
  }, [dispatch]);

  // ← filtrējam tikai tos, kuri satur šo tagu
  const filteredPosts = posts.items.filter((p) => p.tags.includes(tag));
  // const dispatch = useDispatch();

  // 🔹 Paņemam lietotāja datus un postus no Redux store

  const { tags } = useSelector((state) => state.posts);

  // 🔹 Nosakām, vai dati vēl lādējas

  const isTagsLoading = tags.status === "loading";

  // 🔹 Tabs state — 0 = Jauns, 1 = Populārs

  const [latestComments, setLatestComments] = React.useState([]);
  React.useEffect(() => {
    axios
      .get("/comments")
      .then((res) => setLatestComments(res.data))
      .catch((err) => console.warn(err));
  }, []);

  // 🔹 Ielādējam postus un tagus, kad lapa atveras
  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, [dispatch]);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)} // ← mainām tab
        aria-label="basic tabs example"
      >
        <Tab label="Jauns" />
        <Tab label="Populārs" />
      </Tabs>
      <h2>Posti ar tagu: #{tag}</h2>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {filteredPosts.map((obj, index) => (
            <Post
              key={index}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl}
              isFullPost={false}
              user={obj.user}
              createdAt={obj.createdAt}
              viewsCount={obj.viewsCount}
              commentsCount={obj.commentsCount}
              tags={obj.tags}
            />
          ))}
        </Grid>
        <Grid xs={4} item>
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
