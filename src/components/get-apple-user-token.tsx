// "use client";

// import { useEffect } from "react";

// declare global {
//   interface Window {
//     MusicKit: any;
//   }
// }

// export default function GetAppleUserToken({
//   appleDeveloperToken,
// }: {
//   appleDeveloperToken: string;
// }) {
//   useEffect(() => {
//     const handleConnectWithApple = async () => {
//       if (window.MusicKit) {
//         try {
//           const music = window.MusicKit.configure({
//             developerToken: appleDeveloperToken,
//             app: {
//               name: "playlist",
//             },
//           });

//           const appleUserToken = await music.authorize();
//           localStorage.setItem("appleUserToken", appleUserToken);
//         } catch (error) {
//           console.error("MusicKit Authorization Failed:", error);
//         }
//       }
//     };
//     handleConnectWithApple();
//   }, []);

//   return <></>;
// }
