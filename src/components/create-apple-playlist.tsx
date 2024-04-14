"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    MusicKit: any;
  }
}

const songs = [{ track: "Back to Black", artist: "Amy Winehouse" }];

export default function CreateApplePlaylist({
  appleDeveloperToken,
  spotifyAccessToken,
}: {
  appleDeveloperToken: string;
  spotifyAccessToken: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.clear();
    const handleConnectWithApple = async () => {
      if (window.MusicKit) {
        try {
          const music = window.MusicKit.configure({
            developerToken: appleDeveloperToken,
            app: {
              name: "playlist-hosted",
            },
          });

          const appleUserToken = await music.authorize();
          localStorage.setItem("appleUserToken", appleUserToken);
          setMessage("User connected with apple!");
        } catch (error) {
          setMessage("MusicKit Authorization Failed.");
          console.error("MusicKit Authorization Failed:", error);
        }
      }
    };

    if (!localStorage.getItem("appleUserToken")) {
      handleConnectWithApple();
    }
  }, [appleDeveloperToken]);

  const getPlaylistFromSpotify = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formatSpotifyUrlForApi(inputValue);
    if (url) {
      try {
        const playlistResponse = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${spotifyAccessToken}` },
        });
        const playlistData = await playlistResponse.json();
        console.log(1);
        console.log(playlistData.tracks.items[0].track.name);
        console.log(2);
        console.log(playlistData.tracks.items[0].track.album.name);
        console.log(3);
        console.log(playlistData.tracks.items[0].track.artists);
        console.log(4);
        console.log(playlistData.tracks.items[0].track.artists[0].name);

        const tracks = playlistData.tracks.items.map(
          (track: {
            name: string;
            artists: { name: string }[];
            album: { name: string };
          }) => {
            return {
              name: track.name,
              artist: track.artists[0],
              album: track.album.name,
            };
          }
        );
        console.log(tracks);
        // setApplePlaylistTracks(tracks);
        // setNewPlaylistArtwork(playlistData.data[0].attributes.artwork);
        // setNewPlaylistName(playlistData.data[0].attributes.name);
        // setNewPlaylistDescription(playlistData.data[0].attributes.description);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const formatSpotifyUrlForApi = (spotifyUrl: string): string | null => {
    const playlistUrl = spotifyUrl.split("/");
    return `https://api.spotify.com/v1/playlists/${playlistUrl[4]}`;
  };

  return message === "" ? (
    <div>
      <p>Connecting to Apple...</p>
    </div>
  ) : (
    <>
      <div>
        <p>Enter an Spotify playlist link below</p>
        <form onSubmit={async (e) => await getPlaylistFromSpotify(e)}>
          <input
            type="text"
            className="text-black"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="bg-white text-black">
            Go
          </button>
        </form>
      </div>
    </>
  );
}
