"use client";

import CreateAppleMusicPlaylist from "./create-apple-playlist";
import CreateSpotifyPlaylist from "./create-spotify-playlist";

export default function CreatePlaylist({
  spotifyAccessToken,
  appleDeveloperToken,
}: {
  spotifyAccessToken: string;
  appleDeveloperToken: string;
}) {
  if (localStorage.getItem("choice") === "Spotify") {
    return (
      <CreateSpotifyPlaylist
        spotifyAccessToken={spotifyAccessToken}
        appleDeveloperToken={appleDeveloperToken}
      />
    );
  } else if (localStorage.getItem("choice") === "Apple") {
    return (
      <CreateAppleMusicPlaylist appleDeveloperToken={appleDeveloperToken} />
    );
  }
}
