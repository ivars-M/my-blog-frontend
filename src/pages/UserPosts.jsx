import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { fetchPostsByUserId, fetchTags } from "../redux/slices/posts.js"; // Svarīgi: fetchPostsByUserId
import axios from "../axios";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

export const UserPosts = () => {
  const { id } = useParams(); // Dabūjam lietotāja ID no URL
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, searchQuery } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [tabIndex, setTabIndex] = React.useState(0);

  // Ielādējam tieši šī lietotāja rakstus
  React.useEffect(() => {
    dispatch(fetchPostsByUserId(id));
    dispatch(fetchTags());
  }, [id, dispatch]);

  const sortedPosts = React.useMemo(() => {
    if (!posts.items || !Array.isArray(posts.items)) return [];
    const query = searchQuery.toLowerCase();

    const filtered = posts.items.filter((obj) => {
      const inTitle = obj.title.toLowerCase().includes(query);
      const inTags =
        obj.tags && Array.isArray(obj.tags)
          ? obj.tags.some((tag) => tag.toLowerCase().includes(query))
          : false;
      return inTitle || inTags;
    });

    return [...filtered].sort((a, b) => {
      if (tabIndex === 0) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return b.viewsCount - a.viewsCount;
    });
  }, [posts.items, tabIndex, searchQuery]);

  const [latestComments, setLatestComments] = React.useState([]);
  React.useEffect(() => {
    axios
      .get("/comments")
      .then((res) => setLatestComments(res.data))
      .catch((err) => console.warn(err));
  }, []);

  // Dabūjam autora vārdu no pirmā raksta, ja tāds ir
  const authorName = posts.items[0]?.user?.fullName;

  return (
    <>
      <h2 style={{ marginBottom: 20 }}>
        {isPostsLoading
          ? "Ielādē rakstus..."
          : `Autora ${authorName || "lietotāja"} raksti`}
      </h2>

      <Tabs
        style={{ marginBottom: 15 }}
        value={tabIndex}
        onChange={(_, newIndex) => setTabIndex(newIndex)}
      >
        <Tab label="Jaunākie" />
        <Tab label="Populārākie" />
      </Tabs>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl || ""}
                isFullPost={false}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user?._id}
              />
            ),
          )}
          {!isPostsLoading && sortedPosts.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <h3>Lietotājam vēl nav rakstu...</h3>
            </div>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={latestComments} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};
