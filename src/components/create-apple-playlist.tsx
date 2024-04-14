"use client";

import { useEffect, useState } from "react";
import GetAppleUserToken from "./get-apple-user-token";

const songs = [{ track: "Back to Black", artist: "Amy Winehouse" }];

export default function CreateAppleMusicPlaylist({
  appleDeveloperToken,
}: {
  appleDeveloperToken: string;
}) {
  const [message, setMessage] = useState("");
  const test = (e: any) => {
    e.preventDefault();
    console.log(localStorage.getItem("appleUserToken"));
  };

  useEffect(() => {
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

  //   const [songsNotFound, setSongsNotFound] = useState([""]);

  //   const getCurrentSpotifyUserId = async () => {
  //     const url = "https://api.spotify.com/v1/me";

  //     try {
  //       const response = await fetch(url, {
  //         method: "GET",
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         return data.id;
  //       } else {
  //         console.log("Error getting user id");
  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   const createSpotifyPlaylist = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setMessage("Connecting to Spotify");

  //     try {
  //       const currentSpotifyUserId = await getCurrentSpotifyUserId();
  //       if (!currentSpotifyUserId) {
  //         setMessage("Failed to get Spotify user ID.");
  //         return;
  //       }
  //       setMessage(`Creating playlist for ${currentSpotifyUserId}`);

  //       const playlistResponse = await fetch(
  //         `https://api.spotify.com/v1/users/${currentSpotifyUserId}/playlists`,
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             name: "New Playlist",
  //             description: "New playlist description",
  //             public: true,
  //           }),
  //         }
  //       );

  //       const playlistData = await playlistResponse.json();
  //       await handleCreateSpotifyPlaylist(playlistData.id);
  //       setMessage("Playlist created.");
  //     } catch (error) {
  //       console.error("Error creating playlist:", error);
  //     }
  //   };

  //   const handleCreateSpotifyPlaylist = async (playlistSpotifyId: string) => {
  //     setMessage("Finding songs");
  //     const notFoundTracks = [];

  //     for (const song of songs) {
  //       try {
  //         const searchResponse = await fetch(
  //           `https://api.spotify.com/v1/search?q=${encodeURIComponent(
  //             `${song.artist} ${song.track}`
  //           )}&type=track`,
  //           {
  //             method: "GET",
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         const searchData = await searchResponse.json();

  //         if (searchData.tracks.items.length !== 0) {
  //           const track = searchData.tracks.items[0];
  //           addSongToPlaylist(track.id, track.name, playlistSpotifyId);
  //         } else {
  //           notFoundTracks.push(song.track);
  //         }
  //       } catch (error) {
  //         console.error("Error adding song:", error);
  //       }
  //     }

  //     setSongsNotFound(notFoundTracks);
  //   };

  //   const addSongToPlaylist = (
  //     songSpotifyId: string,
  //     songName: string,
  //     playlistSpotifyId: string
  //   ) => {
  //     const url = `https://api.spotify.com/v1/playlists/${playlistSpotifyId}/tracks`;
  //     const bodyData = {
  //       uris: [`spotify:track:${songSpotifyId}`],
  //     };
  //     setMessage(`Adding song: ${songName}`);

  //     fetch(url, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(bodyData),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => console.log(data))
  //       .catch((error) => console.error("error", error));
  //   };

  return message == "" ? (
    <>
      <GetAppleUserToken appleDeveloperToken={appleDeveloperToken} />
      <p>Enter something...</p>
      <form onSubmit={(e) => test(e)}>
        <input type="text" className="text-black"></input>
        <button type="submit" className="bg-white text-black">
          Go
        </button>
      </form>
    </>
  ) : (
    message
  );
}
