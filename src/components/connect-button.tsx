"use client";

export default function ConnectButton({ choice }: { choice: string }) {
  return (
    <button
      onClick={() => {
        localStorage.setItem("choice", choice);
      }}
    >
      Connect with {choice}
    </button>
  );
}
