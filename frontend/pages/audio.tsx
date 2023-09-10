import React, { useState } from 'react';

export default function AudioUpload() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAudioFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    if (audioFile) {
      formData.append('audio', audioFile);
    }

    const res = await fetch("/api/whisper", {
      method: "POST",
      body: formData,
    });
    
    setIsUploading(false);
    const data = await res.json();
    setTranscription(data.transcription);  // Adjust based on the actual response structure
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label className="sr-only" htmlFor="audioFile">
              Upload Audio File
            </label>
            <input
              type="file"
              className="block w-full rounded-md bg-white border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 placeholder-gray-500 text-gray-900"
              name="audioFile"
              id="audioFile"
              accept="audio/*"
              onChange={handleAudioChange}
              required
            />
          </div>

          <button
            className={`bg-blue-600 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
              ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
            type="submit"
            disabled={isUploading || !audioFile}
          >
            {isUploading ? "Uploading..." : "Upload Audio"}
          </button>
        </form>

        {transcription && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Transcription:</h2>
            <p className="text-gray-700">{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
