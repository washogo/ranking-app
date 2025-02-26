import React, { useEffect, useState } from "react";
import { WatchedListState } from "@/lib/atom";
import { requests } from "@/lib/MovieApi";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";

export type WatchList = {
  id: string;
  name: string;
  title: string;
  img: string;
  mediaType: string;
  overview: string;
  releaseDate: string;
  video: string;
  posterPath: string;
  backdropPath: string;
};
const WatchList = () => {
  const [watchedList, setWatchedList] = useRecoilState(WatchedListState);
  const [watchList, setWatchList] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      const moviesRef = query(
        collection(db, "users", "3afv8SDIvjimSBLiXZsM", "movies")
      );

      getDocs(moviesRef).then((querySnapshot) => {
        setWatchList(querySnapshot.docs.map((doc) => ({ ...doc.data() })));
      });
    }

    fetchData();
  }, []);
  console.log(watchList);

  // 削除機能
  const handleWatchDelete = (
    e: React.MouseEvent<HTMLElement>,
    targetMovie: WatchList
  ) => {
    e.preventDefault();

    // watchedリストへ追加
    const watchedMovieRef = collection(
      db,
      "users",
      "3afv8SDIvjimSBLiXZsM",
      "watchedMovie"
    );
    const moviesDocumentRef = addDoc(watchedMovieRef, {
      id: targetMovie.id,
      title: targetMovie.title,
      mediaType: targetMovie.mediaType ? targetMovie.mediaType : "",
      releaseDate: targetMovie.releaseDate ? targetMovie.releaseDate : "",
      video: targetMovie.video,
      overview: targetMovie.overview,
      posterPath: targetMovie.posterPath,
    });

    // 削除機能
    const moviesRef = collection(db, "users", "3afv8SDIvjimSBLiXZsM", "movies");
    const q = query(moviesRef, where("id", "==", targetMovie.id));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.docs.map((document) => {
        const movieDocument = doc(
          db,
          "users",
          "3afv8SDIvjimSBLiXZsM",
          "movies",
          document.id
        );

        deleteDoc(movieDocument);
      });
    });

    setWatchList((current: WatchList[]) =>
      current.filter((value: WatchList) => targetMovie !== value)
    );

    setWatchedList((value: WatchList[]) => {
      return [...value, targetMovie];
    });
  };

  return (
    <>
      <h2 style={{ marginTop: "20px", padding: "10px" }}>見る映画リスト</h2>

      <ImageList
        gap={8}
        sx={{
          mb: 8,
          gridTemplateColumns:
            "repeat(auto-fill, minmax(180px, 1fr))!important",
        }}
      >
        {watchList &&
          watchList.length > 0 &&
          watchList.map((movie: WatchList) => {
            return (
              <ImageListItem
                key={movie.img}
                sx={{ maxWidth: "185px", placeSelf: "center" }}
              >
                <Link
                  style={{ textAlign: "center", maxWidth: "185px" }}
                  href={{
                    pathname: `/movie/${movie.id}`,
                    query: {
                      id: movie.id,
                      title: movie.title,
                      mediaType: movie.mediaType,
                      overview: movie.overview,
                      releaseDate: movie.releaseDate,
                      video: movie.video,
                      posterPath: movie.posterPath,
                    },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${requests.image}${movie.posterPath}`}
                    alt="movie image"
                    style={{ backgroundColor: "#dbdbdb" }}
                  />
                  <ImageListItemBar
                    sx={{
                      "& .MuiImageListItemBar-title": {
                        textAlign: "start",
                        overflow: "auto",
                        whiteSpace: "normal",
                      },
                      "& .MuiImageListItemBar-positionBottom ": {
                        background: "rgba(255, 255, 255, 0.94)",
                      },
                    }}
                    title={movie.title ? movie.title : movie.name}
                    // subtitle={movie.name}
                    actionIcon={
                      <IconButton
                        sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                        aria-label={`info about ${movie.title}`}
                        // 見た映画登録ボタン
                        onClick={(
                          e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                        ) => handleWatchDelete(e, movie)}
                      >
                        +
                      </IconButton>
                    }
                  />
                </Link>
              </ImageListItem>
            );
          })}
      </ImageList>
    </>
  );
};

export default WatchList;
