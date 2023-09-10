function forceDownloadText(text: string, filename: string) {
  let blob = new Blob([text], { type: "text/plain" });
  let blobUrl = window.URL.createObjectURL(blob);
  forceDownload(blobUrl, filename);
}

function forceDownload(blobUrl: string, filename: string) {
  let a: any = document.createElement("a");
  a.download = filename;
  a.href = blobUrl;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function downloadTranscript(transcriptText: string, filename: string) {
  try {
    forceDownloadText(transcriptText, `${filename}.txt`);
  } catch (e) {
    console.error(e);
  }
}
