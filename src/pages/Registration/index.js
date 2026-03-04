import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import axios from "../../axios";

import styles from "./Login.module.scss";
import {
  // fetchAuth,
  fetchRegister,
  selectIsAuth,
} from "../../redux/slices/auth";
import { grey } from "@mui/material/colors";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const [avatarUrl, setAvatarUrl] = React.useState("");
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);

      const { data } = await axios.post("/upload/avatar", formData);

      setAvatarUrl(data.url);

      // saglabājam URL
    } catch (err) {
      console.warn(err);
      alert("Neizdevās augšupielādēt attēlu");
    }
  };

  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister({ ...values, avatarUrl }));

    if (!data.payload) {
      return alert("Neizdevās reģistrēties!");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    } else {
      return alert("Neizdevās reģistrēties!");
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Izveidot kontu
      </Typography>
      <div className={styles.avatar}>
        <Avatar
          sx={{ width: 100, height: 100, grey }}
          src={avatarUrl ? `${axios.defaults.baseURL}${avatarUrl}` : ""}
        />
        <label>
          <input type="file" onChange={handleChangeFile} hidden />
          <Button variant="outlined" component="span">
            Augšupielādēt foto
          </Button>
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Norādiet pilnu vārdu" })}
          className={styles.field}
          label="Pilns vārds"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register("email", { required: "Norādiet e-pastu" })}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password"
          {...register("password", { required: "Norādiet paroli" })}
          label="Parole"
          fullWidth
        />

        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Reģistrēties
        </Button>
      </form>
    </Paper>
  );
};
