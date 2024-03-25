const jwt = require("jsonwebtoken");
import ConnectWithApple from "@/components/connect-with-apple";
import ConnectWithSpotify from "@/components/connect-with-spotify";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectWithSpotify />
      <ConnectWithApple />
    </main>
  );
}
