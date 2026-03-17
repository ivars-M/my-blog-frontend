import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/posts/uploads", formData);

      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert("Kļūda augšupielādējot attēlu");
    }
  };
  const onClickRemoveImage = () => {
    setImageUrl("");
  };
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      // 1. Pārliecināmies, ka tagi ir masīvs un tajā nav tukšu atstarpju
      // Ja 'tags' ir string "lacis, koks", tas kļūs par ["lacis", "koks"]
      const tagsArray =
        typeof tags === "string"
          ? tags.split(",").map((tag) => tag.trim())
          : tags;

      const fields = {
        title, // Pārliecinies, ka šeit ir vismaz 5 simboli
        text, // Pārliecinies, ka šeit ir vismaz 10 simboli
        imageUrl,
        tags: tagsArray,
      };

      console.log("SŪTĀM ŠOS DATUS:", fields);

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn("PILNA KĻŪDA:", err);
      // Ja Response logs ir tukšs, mēģinām izvilkt kļūdu no Axios objekta
      if (err.response && err.response.data) {
        console.log("SERVERA ZIŅOJUMS:", err.response.data);
      }
      alert("Neizdevās izveidot rakstu. Pārbaudi konsoli!");
    } finally {
      setIsLoading(false);
    }
  };
  // const onSubmit = async () => {
  //   try {
  //     setLoading(true);

  //     const fields = {
  //       title,
  //       imageUrl: imageUrl,
  //       tags:
  //         typeof tags === "string"
  //           ? tags.split(",").map((tag) => tag.trim())
  //           : tags,
  //       text,
  //     };
  //     console.log("FIELDS:", fields);

  //     const { data } = isEditing
  //       ? await axios.patch(`/posts/${id}`, fields)
  //       : await axios.post("/posts", fields);

  //     const _id = isEditing ? id : data._id;

  //     navigate(`/posts/${_id}`);
  //   } catch (err) {
  //     console.log("ERROR:", err.response?.data);
  //     console.warn(err);
  //     alert("Kļūda izveidojot ierakstu");
  //   }
  // };
  React.useEffect(() => {
    console.log("EDIT ID:", id);

    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        console.log("DATA FROM SERVER:", data);
        console.log("IMAGE URL:", data.imageUrl);
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(","));
      });
    }
  }, [id]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: false,
      placeholder: "Ievadiet tekstu...",
      status: false,
      autosave: { enabled: true, delay: 1000 },
    }),
    [],
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }
  const isFullUrl = imageUrl?.startsWith("http");
  const finalPreviewUrl = isFullUrl
    ? imageUrl
    : `https://my-blog-backend-qniv.onrender.com${imageUrl}`;
  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Ielādēt priekšskatījumu
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Dzēst
          </Button>
          <img
            className={styles.image}
            src={finalPreviewUrl}
            // src={
            //   imageUrl.startsWith("http")
            //     ? imageUrl
            //     : `https://my-blog-backend-qniv.onrender.com${imageUrl}`
            // }
            // src={`${axios.defaults.baseURL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Virsraksts..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags "
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />

      <div className={styles.buttons}>
        <Button
          disabled={isLoading}
          onClick={onSubmit}
          size="large"
          variant="contained"
        >
          {isEditing ? "Saglabāt" : "Publicēt"}
        </Button>
        <a href="/">
          <Button size="large">Atlikt</Button>
        </a>
      </div>
    </Paper>
  );
};
