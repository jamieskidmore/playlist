const jwt = require("jsonwebtoken");

import CreateApplePlaylist from "@/components/create-apple-playlist";
import CreateSpotifyPlaylist from "@/components/create-spotify-playlist";

export default async function Create({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.REDIRECT_URI;
  const scope = encodeURIComponent(
    "playlist-modify-public playlist-modify-private"
  );
  let spotifyAccessToken = "";
  let appleDeveloperToken = "";

  const generateAppleDeveloperToken = () => {
    const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    const teamId = process.env.NEXT_PUBLIC_APPLE_TEAM_ID;
    const keyId = process.env.NEXT_PUBLIC_APPLE_KEY_ID;

    const payload = {
      iss: teamId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
      iat: Math.floor(Date.now() / 1000),
    };

    const options = {
      algorithm: "ES256",
      keyid: keyId,
    };

    return jwt.sign(payload, privateKey, options);
  };

  const handleConnectWithApple = () => {
    const token = generateAppleDeveloperToken();
    appleDeveloperToken = token;
  };

  const getSpotifyAccessToken = async (code: string) => {
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    if (redirect_uri) {
      const authHeader =
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64");

      const params = new URLSearchParams();
      params.append("code", code);
      params.append("redirect_uri", redirect_uri);
      params.append("grant_type", "authorization_code");

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: authHeader,
          },
          body: params,
        });

        if (response.ok) {
          const data = await response.json();
          return data.access_token;
        } else {
          console.log("Error getting access token");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  if (!searchParams) {
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
  }

  if (searchParams.code) {
    spotifyAccessToken = await getSpotifyAccessToken(searchParams.code);
  }

  handleConnectWithApple();

  if (localStorage.getItem("choice") == "Spotify") {
    return (
      <CreateSpotifyPlaylist
        spotifyAccessToken={spotifyAccessToken}
        appleDeveloperToken={appleDeveloperToken}
      />
    );
  } else if (localStorage.getItem("choice") == "Apple") {
    return (
      <CreateApplePlaylist
        appleDeveloperToken={appleDeveloperToken}
        spotifyAccessToken={spotifyAccessToken}
      />
    );
  } else {
    return <p>Something went wrong.</p>;
  }
}
