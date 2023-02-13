import Header from "@/components/layouts/Header";
import ActorList from "@/features/components/ActorListContent";
import MovieGenre from "@/features/components/MovieGenre";
import MovieList from "@/features/components/MovieList";
import { requests } from "@/lib/MovieApi";
import React from "react";

const actor = () => {
  return (
    <div>
      {/* <Header searchUrl={requests.search} /> */}
      {/* <MovieGenre
        title={"ドキュメント"}
        fetchUrl={requests.genre.allMovieOfActor}
      /> */}
      <ActorList actorUrl={requests.actor} />
    </div>
  );
};

export default actor;
