import { useState, useRef } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSystemAudio, setIsSystemAudio] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startRecordingWithStream(stream);
      setIsSystemAudio(false);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // user might have denied permission or no mic
      alert("Microphone access denied or not available");
    }
  };

  const startSystemRecording = async () => {
    try {
      // getDisplayMedia requires video to get audio in most browsers
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Check if audio track exists (user might share screen without audio)
      if (stream.getAudioTracks().length === 0) {
        stream.getTracks().forEach((t) => t.stop());
        alert(
          'Please share "Tab Audio" or "System Audio" when selecting the screen.'
        );
        return;
      }

      startRecordingWithStream(stream);
      setIsSystemAudio(true);
    } catch (err) {
      console.error("Error accessing system audio:", err);
    }
  };

  const startRecordingWithStream = (stream: MediaStream) => {
    streamRef.current = stream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      setAudioBlob(blob);
      chunks.length = 0;
      stream.getTracks().forEach((track) => track.stop()); // Stop screen share/mic
    };

    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return {
    isRecording,
    startRecording,
    startSystemRecording,
    stopRecording,
    audioBlob,
    recordingTime,
    formatTime,
    resetRecording,
    isSystemAudio,
  };
}
