"use client";

import { useState } from "react";
import CreateApplePlaylist from "./create-apple-playlist";
import CreateSpotifyPlaylist from "./create-spotify-playlist";

export default function CreatePlaylist({
  spotifyAccessToken,
  appleDeveloperToken,
}: {
  spotifyAccessToken: string;
  appleDeveloperToken: string;
}) {
  const [showApple, setShowApple] = useState(false);
  return (
    <>
      <CreateSpotifyPlaylist
        spotifyAccessToken={spotifyAccessToken}
        appleDeveloperToken={appleDeveloperToken}
      />
      <button
        onClick={() => {
          setShowApple(true);
        }}
      >
        Apple
      </button>

      {showApple && (
        <CreateApplePlaylist
          appleDeveloperToken={appleDeveloperToken}
          spotifyAccessToken={spotifyAccessToken}
        />
      )}
    </>
  );
}
