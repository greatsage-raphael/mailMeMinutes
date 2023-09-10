import type { NextApiRequest, NextApiResponse } from "next";

// Define the shape of the expected incoming request data
interface ExtendedNextApiRequest extends NextApiRequest {
  body: FormData; //  FormData containing the audio file
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method not allowed
  }

  const formData = req.body; // This assumes that the incoming request body contains FormData

  try {
    // Use the FormData API to send a multipart/form-data request to OpenAI
    const transcriptionRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: formData
    });

    // Check for errors from OpenAI
    if (transcriptionRes.status !== 200) {
      const errorData = await transcriptionRes.json();
      throw new Error(`API request failed with status ${transcriptionRes.status}: ${errorData.error}`);
    }

    const transcriptionData = await transcriptionRes.json();

    return res.status(200).json({ transcription: transcriptionData.text });
    
  } catch (error) {
    if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
}
}


//wont work because of the 1mb limit by vercel
