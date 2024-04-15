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
      {showApple ? (
        <CreateApplePlaylist
          appleDeveloperToken={appleDeveloperToken}
          spotifyAccessToken={spotifyAccessToken}
        />
      ) : (
        <CreateSpotifyPlaylist
          spotifyAccessToken={spotifyAccessToken}
          appleDeveloperToken={appleDeveloperToken}
        />
      )}
      <button
        onClick={() => {
          setShowApple(!showApple);
        }}
        className="text-blue-800"
      >
        {showApple ? "* Switch to Spotify *" : "* Switch to Apple *"}
      </button>
    </>
  );
}
