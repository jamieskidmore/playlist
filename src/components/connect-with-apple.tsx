import ConnectToApiButton from "./connect-to-api-button";

const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const scope = encodeURIComponent(
  "playlist-modify-public playlist-modify-private"
);

export default function ConnectWithApple() {
  return (
    <a
      href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`}
    >
      <ConnectToApiButton service="Apple" />
    </a>
  );
}
