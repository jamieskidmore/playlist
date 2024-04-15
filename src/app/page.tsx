const jwt = require("jsonwebtoken");
import StarRow from "@/components/star-row";
import Start from "@/components/start";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen text-6xl overflow-hidden">
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <div className="flex my-5 text-3xl w-full justify-between items-center">
        <div className={`w-full space-y-3 p-3 hidden sm:block`}>
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
        </div>
        <div className="flex flex-col items-center space-y-5 mx-auto min-w-40 md:min-w-72">
          <p className="text-orange-300 bg-red-700 flex p-5 text-center m-2 text-xl">
            <span>Playlist Converter for Spotify & Apple Music</span>
          </p>
          <Start />
        </div>
        <div className={`w-full space-y-3 p-3 hidden sm:block`}>
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
          <StarRow colour="text-green-800" />
        </div>
      </div>
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
      <StarRow colour="text-green-800" />
    </main>
  );
}
