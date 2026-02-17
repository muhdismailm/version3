import React, { useState } from 'react';
import {
  Home,
  Upload,
  Mic,
  Send,
  BookOpen
} from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface DemoPageProps {
  onBack: () => void;
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function DemoPage({ onBack }: DemoPageProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [currentSign, setCurrentSign] = useState('System Ready.');
  const [avatarVideo, setAvatarVideo] = useState<string | null>(null);

  /* ---------------- PIPELINE SIMULATION ---------------- */
  const simulatePipeline = async () => {
    const steps = 4;
    for (let i = 1; i <= steps; i++) {
      setProgressStep(i);
      await new Promise((resolve) => setTimeout(resolve, 900));
    }
  };

  /* ---------------- TEXT TO ISL ---------------- */
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);
    setProgressStep(0);
    setAvatarVideo(null);
    setCurrentSign('Processing text...');

    try {
      const res = await fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });

      const data = await res.json();

      if (data.error) {
        setCurrentSign(data.error);
       } else {
        setCurrentSign(`ISL Gloss: ${data.isl_gloss.join(' ')}`);}

      // Update if backend sends dynamic path
      setAvatarVideo('/avatar_output.mp4');
    } catch (err) {
      console.error(err);
      setCurrentSign('Error processing request.');
    }

    setIsProcessing(false);
    setMessage('');
  };

  /* ---------------- VIDEO UPLOAD ---------------- */
  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsProcessing(true);
      setProgressStep(0);
      setAvatarVideo(null);
      setCurrentSign(`Uploading ${file.name}`);

      const formData = new FormData();
      formData.append('video', file);

      try {
        await fetch('http://localhost:5000/upload_video', {
          method: 'POST',
          body: formData
        });

        await simulatePipeline();

        setCurrentSign('Video processed successfully.');
        setAvatarVideo('/avatar_output.mp4');
      } catch (err) {
        console.error(err);
        setCurrentSign('Video upload failed.');
      }

      setIsProcessing(false);
    };

    input.click();
  };

  /* ---------------- VOICE INPUT ---------------- */
  const toggleRecording = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsRecording(true);
    setCurrentSign('Listening...');
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setCurrentSign(`Recognized: "${transcript}"`);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setCurrentSign('Speech recognition failed.');
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);
  };

  /* ---------------- CIRCULAR PROGRESS CALCULATION ---------------- */
  const percentage = (progressStep / 4) * 100;
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-10">
            <BookOpen className="text-blue-400" />
            <span className="text-xl font-bold">signifyEd</span>
          </div>

          <div className="text-sm text-slate-400">
            AI-Based ISL Translation System
          </div>
        </div>

        <button
          onClick={onBack}
          className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition"
        >
          <Home size={18} />
          <span>Back</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 space-y-10">

        {/* AVATAR VIDEO PANEL */}
        <div className="bg-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-xl">
          {avatarVideo ? (
            <video
              src={avatarVideo}
              controls
              autoPlay
              className="w-96 rounded-xl"
            />
          ) : (
            <div className="w-96 h-64 bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
              Avatar Output Preview
            </div>
          )}

          <div className="mt-4 text-sm text-slate-300 text-center">
            {currentSign}
          </div>
        </div>

        {/* CIRCULAR PROGRESS RING */}
        {isProcessing && (
          <div className="bg-slate-800 p-10 rounded-2xl flex flex-col items-center shadow-xl">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="#1e293b"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />

              <circle
                stroke="#3b82f6"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  transition: 'stroke-dashoffset 0.5s ease'
                }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                transform={`rotate(-90 ${radius} ${radius})`}
              />

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontSize="22"
                fontWeight="bold"
              >
                {Math.round(percentage)}%
              </text>
            </svg>

            <div className="mt-6 text-slate-400 text-sm">
              AI Processing Pipeline
            </div>
          </div>
        )}

        {/* INPUT SECTION */}
        <div className="bg-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">

          <button
            onClick={handleVideoUpload}
            disabled={isProcessing}
            className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 transition"
          >
            <Upload className="inline mr-2" />
            Upload Video
          </button>

          <div className="flex space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type text to convert to ISL..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-700 focus:outline-none"
            />

            <button
              onClick={toggleRecording}
              disabled={isProcessing}
              className={`px-4 rounded-xl ${
                isRecording ? 'bg-red-500' : 'bg-slate-700'
              }`}
            >
              <Mic />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={isProcessing || !message.trim()}
              className="bg-green-600 px-4 rounded-xl disabled:opacity-50"
            >
              <Send />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
