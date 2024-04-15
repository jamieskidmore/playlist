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
  const [appleTrackHrefs, setAppleTrackHrefs] = useState<string[]>([]);
  const [songsNotFound, setSongsNotFound] = useState<string[]>([]);

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
    const createApplePlaylist = async () => {
      getSongsFromApple();
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

        const tracks = playlistData.tracks.items.map(
          (item: {
            track: {
              name: string;
              artists: { name: string }[];
              album: { name: string };
            };
          }) => {
            console.log("here is an item: " + item);
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

  const getSongsFromApple = () => {
    const hrefs: string[] = [];
    const notFound: string[] = [];
    setMessage("Connecting to Apple");
    try {
      setMessage(`Creating playlist on Apple Music`);

      spotifyPlaylistTracks.map(async (track: any) => {
        setMessage(`Adding song ${track.name}`);
        const artistNames = track.artists.map((artist: any) => artist.name);

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
              // "Music-User-Token": appleUserToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (searchResponse) {
          const search = await searchResponse.json();
          hrefs.push(search.results.songs.data[0].href);
        } else {
          notFound.push(track.name);
        }
      });
      setAppleTrackHrefs(hrefs);
      setSongsNotFound(notFound);
    } catch (error) {
      console.log("error", error);
    }
    return;
  };

  // return message === "" ? (
  //   <div>
  //     <p>Connecting to Apple...</p>
  //   </div>
  // ) : (
  //   <>
  //     <div>
  //       <p>Enter an Spotify playlist link below</p>
  //       <form onSubmit={async (e) => await getPlaylistFromSpotify(e)}>
  //         <input
  //           type="text"
  //           className="text-black"
  //           value={inputValue}
  //           onChange={(e) => setInputValue(e.target.value)}
  //         />
  //         <button type="submit" className="bg-white text-black">
  //           Go
  //         </button>
  //       </form>
  //     </div>
  //   </>
  // );

  return message == "" ? (
    <>
      <p>Enter a Spotify playlist link below</p>
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
    </>
  ) : (
    <>
      {message}
      {/* {newPlaylistUrl && (
        <a href={newPlaylistUrl}>
          <button className="bg-white text-black">Link to new Playlist</button>
        </a>
      )} */}

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

// }
