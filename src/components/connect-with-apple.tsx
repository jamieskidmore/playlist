"use client";

import Link from "next/link";
import ConnectToApiButton from "./connect-to-api-button";

export default function ConnectWithApple() {
  return (
    <a href="{`https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`}">
      <ConnectToApiButton service="Apple" />
    </a>
  );
}
