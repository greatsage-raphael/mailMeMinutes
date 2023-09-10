import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { NylasProvider } from '@nylas/nylas-react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const SERVER_URI ='http://localhost:9000';

  return (
     <>
     <NylasProvider serverBaseUrl={SERVER_URI}>
      <Component {...pageProps} />
      <Analytics />
      </NylasProvider>
      </>
  );
}

export default MyApp;
