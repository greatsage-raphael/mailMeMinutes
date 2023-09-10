import type { NextApiRequest, NextApiResponse } from "next";
import Replicate from 'replicate'

type Data = any;

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    audioUrl: string;
  };
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || '',
})

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // POST request to Replicate to start the image restoration generation process
  const audio = req.body.audioUrl;
  console.log(audio)

  const output = await replicate.run(
    'openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7',
    {
      input: {
        audio,
      },
    }
  )

  console.log(output)
  res
    .status(200)
     .json(output);
}
