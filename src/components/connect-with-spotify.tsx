export default function ConnectToSpotify() {
  const client_id = "b6b24206aae34ef488bb7833fa7e718f"; // This should be an environment variable
  const redirect_uri = "http://localhost:3000/callback";
  const scope = encodeURIComponent(
    "playlist-modify-public playlist-modify-private"
  );

  return (
    <a
      href={`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`}
    >
      <button>Connect with Spotify</button>
    </a>
  );
}
