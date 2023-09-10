import { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import appendNewToName from "../utils/appendNewToName";
import downloadTranscript from "../utils/downloadTranscript"; 
import { useNylas } from '@nylas/nylas-react';
import DynamicNylasLogin  from "./DynamicNylasLogin"

// Configuration for the uploader
const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_KEY || "free",
});

const Home: NextPage = () => {
  const [originalAudio, setOriginalAudio] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const nylas = useNylas();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');  

  useEffect(() => {
    if (!nylas) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      nylas
        .exchangeCodeFromUrlForToken()
        .then((user) => {
          const { id } = JSON.parse(user);
          setUserId(id);
          sessionStorage.setItem('userId', id);
        })
        .catch((error) => {
          console.error('An error occurred parsing the response:', error);
        });
    }
  }, [nylas]);

  useEffect(() => {
    const userIdString = sessionStorage.getItem('userId');
    const storedUserEmail = sessionStorage.getItem('userEmail');
    if (userIdString) {
      setUserId(userIdString);
    }
    if (storedUserEmail) {
      setUserEmail(storedUserEmail);
    }
  }, []);

  const options = {
    maxFileCount: 1,
    mimeTypes: ["audio/mpeg"],
    styles: { colors: { primary: "#000" } },
  };

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setAudioName(file[0].originalFile.originalFileName);
          setOriginalAudio(file[0].fileUrl);
          generateAudio(file[0].fileUrl);
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generateAudio(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioUrl: fileUrl }),
    });

    let whisper = await res.json();
    let transcription = whisper.transcription
    // let language = whisper.detected_language
    console.log(whisper.transcription)
    console.log(whisper.detected_language)

    if (res.status !== 200) {
      setError(whisper);
    } else {
      setDiagnosis(transcription);
      setTranscript(true)
    }
    setLoading(false);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>MailMyMeeting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header photo={undefined} />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
      {!userId ? (
          <DynamicNylasLogin email={userEmail} setEmail={setUserEmail} />
        ) : (
          <>
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">
          Upload any meeting audio and get an email with the transcription
        </h1>
        <p className="mx-auto font-display tracking-normal text-slate-900 sm:text-2xl mb-5">
          only mp3 files are allowed atm 💔
        </p>
        <div className="flex justify-between items-center w-full flex-col mt-4">
          <UploadDropZone />
          {diagnosis && (
            <div className="sm:mt-0 mt-8">
              <h2 className="mb-1 font-medium text-lg">Transcription ✍🏾</h2>
              <p>{diagnosis}</p>
            </div>
          )}
          {loading && (
            <button
              disabled
              className="bg-black rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 hover:bg-black/80 w-40"
            >
              <span className="pt-4">
                <LoadingDots color="white" style="large" />
              </span>
            </button>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8 max-w-[575px]"
              role="alert"
            >
              <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Please try again in 24 hours
              </div>
              <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                {error}
              </div>
            </div>
          )}
          <div className="flex space-x-2 justify-center">
            {originalAudio && !loading && (
              <button
                onClick={() => {
                  setOriginalAudio(null);
                  setDiagnosis(null);
                  setTranscript(false)
                  setError(null);
                }}
                className="bg-black rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-black/80 transition"
              >
                Upload New Audio
              </button>
            )}
            {transcript && (
                        
<button
  onClick={() => {
    downloadTranscript(diagnosis!, appendNewToName(audioName!));
  }}
  className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
>
  Download Transcript
</button>
   )}
          </div>
        </div>
        </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;

