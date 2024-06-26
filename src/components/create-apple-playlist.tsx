"use client";

import { useState, useEffect } from "react";
import PlaylistForm from "./playlist-form";

declare global {
  interface Window {
    MusicKit: any;
  }
}

export default function CreateApplePlaylist({
  appleDeveloperToken,
  spotifyAccessToken,
}: {
  appleDeveloperToken: string;
  spotifyAccessToken: string;
}) {
  const [spotifyPlaylistTracks, setSpotifyPlaylistTracks] = useState<
    { name: string; artists: [{ name: string }]; album: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [appleUserToken, setAppleUserToken] = useState("");
  const [message, setMessage] = useState("");
  const [songsNotFound, setSongsNotFound] = useState<string[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [newPlaylistUrl, setNewPlaylistUrl] = useState("");

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
          setMessage("");
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
    const handleCreateApplePlaylist = async () => {
      const songs = await getSongsFromApple();
      if (songs.length > 0) {
        createApplePlaylist(songs);
      }
    };

    if (spotifyPlaylistTracks !== null) {
      handleCreateApplePlaylist();
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
        console.log(playlistData);

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
        setNewPlaylistName(playlistData.name);
        setNewPlaylistDescription(playlistData.description);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const formatSpotifyUrlForApi = (spotifyUrl: string): string | null => {
    const playlistUrl = spotifyUrl.split("/");
    return `https://api.spotify.com/v1/playlists/${playlistUrl[4]}`;
  };

  const getSongsFromApple = async () => {
    const catalogIds: string[] = [];
    const notFound: string[] = [];
    try {
      await Promise.all(
        spotifyPlaylistTracks.map(async (track) => {
          setMessage(`Adding song ${track.name}`);
          const artistNames = track.artists.map((artist) => artist.name);

          const queryString = new URLSearchParams({
            term: `${track.name} ${artistNames.join(" ")} ${track.album}`,
            types: "songs",
            limit: "10",
          }).toString();

          const searchResponse = await fetch(
            `https://api.music.apple.com/v1/catalog/ca/search?${queryString}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${appleDeveloperToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (searchResponse.ok) {
            const search = await searchResponse.json();
            if (search.results.songs && search.results.songs.data.length > 0) {
              catalogIds.push(search.results.songs.data[0].id);
            } else {
              notFound.push(track.name);
            }
          } else {
            console.error("Search response error:", searchResponse.statusText);
          }
        })
      );

      setSongsNotFound(notFound);
      return catalogIds;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  const createApplePlaylist = async (songs: string[]) => {
    const body = {
      attributes: {
        name: newPlaylistName,
        description: newPlaylistDescription,
      },
      relationships: {
        tracks: {
          data: songs.map((id) => ({ id: id, type: "library-songs" })),
        },
      },
    };

    try {
      const response = await fetch(
        "https://api.music.apple.com/v1/me/library/playlists",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${appleDeveloperToken}`,
            "Music-User-Token": appleUserToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdPlaylist = await response.json();

      setMessage("Playlist created!");

      setNewPlaylistUrl(
        "https://music.apple.com/us/library/all-playlists/?l=en-US"
      );
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <PlaylistForm
      message={message}
      inputPlaceholder="Enter a Spotify playlist link below"
      buttonText="Convert to Apple Music"
      onSubmit={getPlaylistFromSpotify}
      inputValue={inputValue}
      setInputValue={setInputValue}
      songsNotFound={songsNotFound}
      newPlaylistUrl={newPlaylistUrl}
    />
  );
}

// }
