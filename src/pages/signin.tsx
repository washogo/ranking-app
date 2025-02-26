import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Button, TextField } from "@mui/material";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const signin: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.push("/movie");
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  };

  const handleGoogleSignin = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      const credential: any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token);
      router.push("/movie");
    });
  };

  return (
    <>
      <Container>
        <Grid container>
          <Paper elevation={10} sx={{ p: 4, m: "80px auto", height: "70vh" }}>
            <Avatar sx={{ m: "20px auto", bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant={"h5"} sx={{ m: "30px" }} align="center">
              SignIn
            </Typography>

            <TextField
              name="email"
              label="E-mail"
              variant="standard" // border無しになる
              sx={{ mt: "5px" }}
              fullWidth
              value={email}
              onChange={handleChangeEmail}
            />

            <TextField
              sx={{ mt: "5px" }}
              name="password"
              label="Password"
              type="password"
              variant="standard"
              fullWidth
              value={password}
              onChange={handleChangePassword}
            />
            {/* <FormControlLabel
            label="パスワードを忘れました"
            labelPlacement="end"
            control={<Checkbox size="small" />}
          /> */}
            <Box mt={6}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                onClick={handleSignin}
              >
                ログインする
              </Button>

              {/* <Typography>
            <Link href="#">パスワードを忘れましたか？</Link>
          </Typography> */}

              {/* <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "end", mt: 1 }}
              >
                <Link href="/register">パスワードを忘れましたか？</Link>
              </Typography> */}
              <Typography
                variant="caption"
                sx={{ display: "block", textAlign: "end", mt: 0.5 }}
              >
                アカウントを登録する
                <Link href="/signup">signup</Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Container>
    </>
  );
};

export default signin;
