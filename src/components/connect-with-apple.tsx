import Link from "next/link";

export default function ConnectWithApple() {
  return (
    <Link href="/create">
      <button
        onClick={() => {
          localStorage.setItem("choice", "Apple");
        }}
      >
        Connect with Apple Music
      </button>
    </Link>
  );
}
