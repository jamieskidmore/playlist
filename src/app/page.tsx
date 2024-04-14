const jwt = require("jsonwebtoken");
import Start from "@/components/start";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Start />
    </main>
  );
}
