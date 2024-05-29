"use client";
import { transcribeAudio } from "@/lib/transcriber";
import { MicrophoneProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";
import React, { useRef, useState } from "react";

const Microphone: React.FC<MicrophoneProps> = ({ onTranscription }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
    setRecording(!recording);
  };

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const options = { mimeType: "audio/webm" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.addEventListener(
        "dataavailable",
        (event: BlobEvent) => {
          chunksRef.current.push(event.data);
        },
      );
      mediaRecorderRef.current.start();
    });
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.addEventListener("stop", async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob);
        const timestamp = Date.now();
        const transcription = await transcribeAudio(formData, timestamp);
        onTranscription(transcription);
        chunksRef.current = [];
      });
    }
  };

  return (
    <div
      className={cn("p-2 cursor-pointer", recording && "bg-neutral-700 rounded-sm")}
      onClick={toggleRecording}
    >
      <Mic className="text-white h-5 w-5" />
    </div>
  );
};

export default Microphone;
