"use client";

export default function ConnectToApiButton({ service }: { service: string }) {
  return (
    <button
      onClick={() => {
        localStorage.setItem("choice", service);
      }}
    >
      Connect with {service}!
    </button>
  );
}
