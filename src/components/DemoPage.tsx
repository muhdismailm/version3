import React, { useState } from 'react';
import { Home, Upload, Mic, Send, BookOpen } from 'lucide-react';

interface DemoPageProps {
  onBack: () => void;
}

// @ts-ignore for TypeScript safety (in case SpeechRecognition is not in TS DOM types)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function DemoPage({ onBack }: DemoPageProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSign, setCurrentSign] = useState('Hello! I can translate your input into sign language.');

  const handleSendMessage = () => {
    if (message.trim()) {
      setIsProcessing(true);
      setCurrentSign(`Translating: "${message}"`);
      setTimeout(() => {
        setCurrentSign(`Showing sign language for: "${message}"`);
        setIsProcessing(false);
        setMessage('');
      }, 2000);
    }
  };

  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsProcessing(true);
        setCurrentSign(`Processing video: ${file.name}`);
        setTimeout(() => {
          setCurrentSign(`Translating sign language from video: ${file.name}`);
          setIsProcessing(false);
        }, 3000);
      }
    };
    input.click();
  };

  const toggleRecording = () => {
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsRecording(true);
    setCurrentSign('Listening to your voice...');
    recognition.start();

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setCurrentSign(`Input: "${transcript}"`);
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      setCurrentSign('Could not recognize speech.');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-900" />
            </div>
            <span className="text-white text-xl font-bold">signifyEd</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={onBack} className="flex items-center space-x-2 text-blue-100 hover:text-white">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <a href="#features" className="text-blue-100 hover:text-white">Features</a>
            <a href="#about" className="text-blue-100 hover:text-white">About</a>
            <a href="#contact" className="text-blue-100 hover:text-white">Contact</a>
            <button className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">Demo</button>
          </div>
          <button onClick={onBack} className="md:hidden flex items-center text-white">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Avatar Display */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="mb-8">
            <div className={`w-48 h-48 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
              isProcessing ? 'animate-pulse scale-105' : ''
            }`}>
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl">{isProcessing ? '🤔' : '🤟'}</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`transition-all duration-1000 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex space-x-4 text-2xl">
                      <span className="animate-bounce">👋</span>
                      <span className="animate-bounce delay-100">🤲</span>
                      <span className="animate-bounce delay-200">👐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-white text-xl font-semibold mb-2">Sign Language Avatar</h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md">
                <p className="text-blue-100 text-sm leading-relaxed">
                  {currentSign}
                </p>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">Processing your input...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 text-center">
              <button 
                onClick={handleVideoUpload}
                disabled={isProcessing}
                className="bg-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 flex items-center justify-center space-x-3 mx-auto disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Sign Language Video</span>
              </button>
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
                  placeholder="Type text to convert to sign language..."
                  disabled={isProcessing}
                  className="flex-1 bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-blue-200 disabled:opacity-50"
                />
                <button
                  onClick={toggleRecording}
                  disabled={isProcessing}
                  className={`p-3 rounded-xl ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20 hover:bg-white/30'} disabled:opacity-50`}
                >
                  <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-blue-200'}`} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isProcessing || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl disabled:opacity-50"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-blue-200 text-sm">
                Upload a sign language video, type text, or use voice input to see the avatar translate to sign language.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
