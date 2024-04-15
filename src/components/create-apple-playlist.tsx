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
  const [spotifyPlaylistTracks, setSpotifyPlaylistTracks] = useState([
    { name: "", artists: [""], album: "" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [appleUserToken, setAppleUserToken] = useState("");

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

          const userToken = await music.authorize();
          setAppleUserToken(userToken);
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

  useEffect(() => {
    const createApplePlaylist = async () => {
      setMessage("Connecting to Apple");
      try {
        setMessage(`Creating playlist on Apple Music`);

        const appleTracks: any = [];

        spotifyPlaylistTracks.map(async (tracks: any) => {
          const queryString = new URLSearchParams({
            term: `${tracks.name} ${tracks.artists.join(" ")} ${tracks.album}`,
            types: "songs",
            limit: "10",
          }).toString();
          const playlistResponse = await fetch(
            `https://api.music.apple.com/v1/catalog/ca/search?${queryString}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${appleDeveloperToken}`,
                // "Music-User-Token": appleUserToken,
                "Content-Type": "application/json",
              },
            }
          );
          appleTracks.push(playlistResponse);
          console.log(playlistResponse);
        });
        console.log(appleTracks);

        setMessage("Playlist created.");
      } catch (error) {
        console.log("error", error);
      }
    };

    if (spotifyPlaylistTracks !== null) {
      createApplePlaylist();
    }
  }, [spotifyPlaylistTracks]);

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
        console.log(playlistData.tracks);

        const tracks = playlistData.tracks.items.map(
          (item: {
            track: {
              name: string;
              artists: { name: string }[];
              album: { name: string };
            };
          }) => {
            return {
              name: item.track.name,
              artists: item.track.artists,
              album: item.track.album.name,
            };
          }
        );
        setSpotifyPlaylistTracks(tracks);
        console.log(tracks);
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
