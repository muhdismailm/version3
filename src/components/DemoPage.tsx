import { useState } from 'react';
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
  backendUrl: string;
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function DemoPage({ onBack }: DemoPageProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [transcript, setTranscript] = useState('');
  const [gloss, setGloss] = useState<string[]>([]);

  /* ---------------- TEXT TO ISL ---------------- */
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsProcessing(true);
    setGloss([]);
    setTranscript('');

    try {
      const res = await fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });

      const data = await res.json();

      if (data.error) {
        setTranscript(data.error);
      } else {
        setTranscript(data.original);
        setGloss(data.isl_gloss || []);
      }

    } catch (err) {
      console.error(err);
      setTranscript('Error processing request.');
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
      setGloss([]);
      setTranscript('');

      const formData = new FormData();
      formData.append('video', file);

      try {
        const res = await fetch('http://localhost:5000/upload_video', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (data.error) {
          setTranscript(data.error);
        } else {
          setTranscript(data.transcript);
          setGloss(data.isl_gloss || []);
        }

      } catch (err) {
        console.error(err);
        setTranscript('Video upload failed.');
      }

      setIsProcessing(false);
    };

    input.click();
  };

  /* ---------------- VOICE INPUT ---------------- */
  const toggleRecording = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsRecording(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
  };

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

      {/* MAIN SPLIT LAYOUT */}
      <main className="flex-1 p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            {/* Transcript Panel */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                Transcript
              </h3>
              <div className="bg-slate-700 p-4 rounded-lg min-h-[80px]">
                {transcript || "Waiting for input..."}
              </div>
            </div>

            {/* ISL Gloss Panel */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                ISL Gloss
              </h3>
              <div className="flex flex-wrap gap-4">
                {gloss.length > 0 ? (
                  gloss.map((word, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 px-6 py-3 rounded-xl text-lg font-semibold"
                    >
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">
                    Gloss will appear here...
                  </span>
                )}
              </div>
            </div>

            {/* Input Controls */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
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
          </div>

          {/* RIGHT SIDE - Avatar Placeholder */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Avatar Rendering
            </h3>

            <div className="w-full h-[350px] bg-slate-700 rounded-xl flex items-center justify-center text-slate-400 text-center px-6">
              🎬 Avatar Rendering Coming Soon
              <br />
              (3D ISL Animation Integration)
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
