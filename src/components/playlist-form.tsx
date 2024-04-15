import React, { useState } from "react";
import emailjs from "@emailjs/browser";

export default function PlaylistForm({
  message,
  inputPlaceholder,
  buttonText,
  onSubmit,
  inputValue,
  setInputValue,
  songsNotFound,
  newPlaylistUrl,
}: {
  message: string;
  inputPlaceholder: string;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  inputValue: string;
  setInputValue: (value: string) => void;
  songsNotFound?: string[];
  newPlaylistUrl?: string;
}) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Check if any of the fields are empty
    let allFieldsFilled = true;
    formData.forEach((value) => {
      if (!value) {
        allFieldsFilled = false;
      }
    });

    if (
      !process.env.NEXT_PUBLIC_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_PUBLIC_KEY
    ) {
      return;
    }

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        form,
        {
          publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          setEmailSent(true);
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
  return message === "" ? (
    <>
      <div className="text-orange-300 bg-green-700 p-5 text-center text-xl mx-auto">
        <p>{inputPlaceholder}</p>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col space-y-5">
        <input
          type="text"
          className="text-black text-center bg-transparent border-2 border-black placeholder-black rounded-3xl"
          placeholder="playlist link"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="text-6xl font-extrabold text-outline">
          {buttonText}
        </button>
      </form>
    </>
  ) : (
    <>
      {songsNotFound && songsNotFound.length > 0 && (
        <div className="text-orange-300 bg-green-700 p-5 text-center text-xl mx-auto">
          <p>The following song(s) were not added:</p>
          <ul className="text-lg">
            {songsNotFound.map((song, index) => (
              <li key={index}>{song}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-black text-center">{message}</p>

      {!emailSent && (
        <form onSubmit={sendEmail} className="flex flex-col space-y-5">
          <input
            type="text"
            className="text-black text-center bg-transparent border-2 border-black placeholder-black rounded-3xl"
            placeholder="email playlist"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="text-6xl font-extrabold text-outline"
          >
            Send
          </button>
          <input
            type="text"
            className="hidden"
            placeholder="email playlist"
            value={newPlaylistUrl}
          />
        </form>
      )}

      {newPlaylistUrl && (
        <a href={newPlaylistUrl}>
          <button className="text-6xl font-extrabold text-outline">
            Link to new Playlist
          </button>
        </a>
      )}
    </>
  );
}
