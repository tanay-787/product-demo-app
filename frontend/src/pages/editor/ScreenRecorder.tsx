import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Video, Square } from 'lucide-react';

const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedVideoUrl(null); // Clear previous recording
    } catch (error) {
      console.error('Error starting screen recording:', error);
      alert('Failed to start screen recording. Please ensure you grant screen and microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    if (recordedVideoUrl) {
      const a = document.createElement('a');
      a.href = recordedVideoUrl;
      a.download = `product-tour-recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(recordedVideoUrl); // Clean up the object URL
      setRecordedVideoUrl(null);
    }
  };

  return (
    <div className="border p-4 rounded-md mt-4">
      <h3 className="text-lg font-semibold mb-2">Screen Recorder</h3>
      <div className="flex items-center space-x-2">
        {!isRecording ? (
          <Button onClick={startRecording} className="bg-green-500 text-white flex items-center">
            <Video className="h-4 w-4 mr-2" /> Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecording} className="bg-red-500 text-white flex items-center">
            <Square className="h-4 w-4 mr-2" /> Stop Recording
          </Button>
        )}
        {recordedVideoUrl && (
          <Button onClick={downloadRecording} variant="outline" className="flex items-center">
            Download Recording
          </Button>
        )}
      </div>
      {isRecording && (
        <p className="text-sm text-yellow-600 mt-2">Recording... (Click Stop to save)</p>
      )}
      {recordedVideoUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <video src={recordedVideoUrl} controls className="w-full max-h-60 rounded-md bg-black"></video>
        </div>
      )}
      <p className="text-sm text-gray-600 mt-2">
        This feature allows you to record your screen and optionally include microphone audio.
        The recording will be saved locally. (Backend upload for video is not yet implemented).
      </p>
    </div>
  );
};

export default ScreenRecorder;
