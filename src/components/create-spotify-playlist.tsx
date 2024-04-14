"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function CreateSpotifyPlaylist({
  spotifyAccessToken,
  appleDeveloperToken,
}: {
  spotifyAccessToken: string;
  appleDeveloperToken: string;
}) {
  const [message, setMessage] = useState("");
  const [applePlaylistTracks, setApplePlaylistTracks] = useState<
    [{ name: string; artist: string; album: string }] | null
  >(null);
  const [newPlaylistUrl, setNewPlaylistUrl] = useState("");
  const [newPlaylistArtwork, setNewPlaylistArtwork] = useState<{
    height: number;
    width: number;
    url: string;
  } | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("New playlist");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("<3");
  const [songsNotFound, setSongsNotFound] = useState<string[] | null>(null);
  const [inputValue, setInputValue] = useState("");

  const getCurrentSpotifyUserId = async () => {
    const url = "https://api.spotify.com/v1/me";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${spotifyAccessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        return data.id;
      } else {
        console.log("Error getting user id");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const convertAppleMusicUrlToApiUrl = (
    appleMusicUrl: string
  ): string | null => {
    const playlistUrl = appleMusicUrl.split("/");
    if (playlistUrl.length == 6) {
      return `https://api.music.apple.com/v1/catalog/${playlistUrl[3]}/playlists/${playlistUrl[5]}`;
    } else {
      return `https://api.music.apple.com/v1/catalog/${playlistUrl[3]}/playlists/${playlistUrl[6]}`;
    }
  };

  const getPlaylistFromApple = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = convertAppleMusicUrlToApiUrl(inputValue);
    if (url) {
      try {
        const playlistResponse = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${appleDeveloperToken}` },
        });
        const playlistData = await playlistResponse.json();
        const tracks = playlistData.data[0].relationships.tracks.data.map(
          (track: {
            attributes: { name: string; artistName: string; albumName: string };
          }) => {
            return {
              name: track.attributes.name,
              artist: track.attributes.artistName,
              album: track.attributes.albumName,
            };
          }
        );

        setApplePlaylistTracks(tracks);
        setNewPlaylistArtwork(playlistData.data[0].attributes.artwork);
        setNewPlaylistName(playlistData.data[0].attributes.name);
        setNewPlaylistDescription(playlistData.data[0].attributes.description);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleCreateSpotifyPlaylist = async (playlistSpotifyId: string) => {
    setMessage("Finding songs");
    const notFoundTracks = [];

    if (applePlaylistTracks) {
      for (const applePlaylistTrack of applePlaylistTracks) {
        const queryParts = [
          applePlaylistTrack.name,
          applePlaylistTrack.artist,
          applePlaylistTrack.album,
        ]
          .filter((part) => part)
          .map((part) => encodeURIComponent(part))
          .join(" ");

        try {
          const searchResponse = await fetch(
            `https://api.spotify.com/v1/search?q=${queryParts}&type=track`,
            {
              method: "GET",
              headers: { Authorization: `Bearer ${spotifyAccessToken}` },
            }
          );
          const searchData = await searchResponse.json();

          if (searchData.tracks.items.length > 0) {
            let trackFound = false;
            for (const track of searchData.tracks.items) {
              if (track.name === applePlaylistTrack.name) {
                await addSongToPlaylist(
                  track.id,
                  track.name,
                  playlistSpotifyId
                );
                trackFound = true;
                break;
              }
            }
            if (!trackFound) {
              notFoundTracks.push(applePlaylistTrack.name);
            }
          } else {
            notFoundTracks.push(applePlaylistTrack.name);
          }
        } catch (error) {
          console.error("Error adding song:", error);
        }
      }
    }
    setSongsNotFound(notFoundTracks);
  };

  const addSongToPlaylist = async (
    songSpotifyId: string,
    songName: string,
    playlistSpotifyId: string
  ) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistSpotifyId}/tracks`;
    const bodyData = {
      uris: [`spotify:track:${songSpotifyId}`],
    };
    setMessage(`Adding song: ${songName}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log("error adding song", error);
    }
  };

  useEffect(() => {
    const createSpotifyPlaylist = async () => {
      setMessage("Connecting to Spotify");
      try {
        const currentSpotifyUserId = await getCurrentSpotifyUserId();

        if (!currentSpotifyUserId) {
          setMessage("Failed to get Spotify user ID");
          return;
        }

        setMessage(`Creating playlist for ${currentSpotifyUserId}`);

        const playlistResponse = await fetch(
          `https://api.spotify.com/v1/users/${currentSpotifyUserId}/playlists`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${spotifyAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newPlaylistName,
              description: newPlaylistDescription,
              public: true,
            }),
          }
        );

        const playlistData = await playlistResponse.json();
        await handleCreateSpotifyPlaylist(playlistData.id);
        setNewPlaylistUrl(
          `https://open.spotify.com/playlist/${playlistData.id}`
        );
        setMessage("Playlist created.");
      } catch (error) {
        console.log("error", error);
      }
    };

    if (applePlaylistTracks !== null) {
      createSpotifyPlaylist();
    }
  }, [applePlaylistTracks]);

  return message == "" ? (
    <>
      <p>Enter an Apple Music playlist link below</p>
      <form onSubmit={async (e) => await getPlaylistFromApple(e)}>
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
    </>
  ) : (
    <>
      {message}
      {newPlaylistUrl && (
        <a href={newPlaylistUrl}>
          <button className="bg-white text-black">Link to new Playlist</button>
        </a>
      )}

      {songsNotFound && songsNotFound.length > 0 && (
        <div>
          <p>The following song(s) were not added:</p>
          <ul>
            {songsNotFound.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
