import React from 'react';
import { Menu, Play, Download, ChevronRight, Users, BookOpen, Award, Zap } from 'lucide-react';
import DemoPage from './components/DemoPage';

function App() {
  const [showDemo, setShowDemo] = React.useState(false);

  if (showDemo) {
    return <DemoPage onBack={() => setShowDemo(false)} />;
  }

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
            <a href="#features" className="text-blue-100 hover:text-white transition-colors">Features</a>
            <a href="#about" className="text-blue-100 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-blue-100 hover:text-white transition-colors">Contact</a>
            <button 
              onClick={() => setShowDemo(true)}
              className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Demo
            </button>
          </div>
          
          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Transforming Education Through Digital Innovation
                </h1>
                
                <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
                  signifyEd is a revolutionary educational platform designed to bridge the gap between traditional learning and digital transformation, empowering educators and students with cutting-edge tools for meaningful engagement.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5 text-blue-300" />
                <span className="text-2xl md:text-3xl font-bold">10M+</span>
                <span className="text-blue-100 ml-2">learners empowered through innovative education.</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowDemo(true)}
                  className="bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Get Started Free</span>
                </button>
                
                <button 
                  onClick={() => setShowDemo(true)}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-900 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Right Content - Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] relative overflow-hidden">
                    {/* Phone Screen Content */}
                    <div className="p-6 text-white">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <div className="text-sm font-medium">9:41</div>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-2 border border-white rounded-sm">
                            <div className="w-3 h-1 bg-white rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      {/* App Header */}
                      <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-6 h-6 text-blue-900" />
                        </div>
                        <h3 className="text-lg font-semibold">signifyEd</h3>
                      </div>

                      {/* Feature Cards */}
                      <div className="space-y-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">Interactive Learning</span>
                          </div>
                          <div className="text-sm text-blue-100">Engage with dynamic content</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Zap className="w-5 h-5" />
                            <span className="font-medium">Real-time Analytics</span>
                          </div>
                          <div className="text-sm text-blue-100">Track progress instantly</div>
                        </div>

                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Collaborative Tools</span>
                          </div>
                          <div className="text-sm text-blue-100">Connect and learn together</div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-8">
                        <button 
                          onClick={() => setShowDemo(true)}
                          className="w-full bg-white text-blue-900 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-colors"
                        >
                          <span>Start Learning</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative px-6 py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose signifyEd?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover the powerful features that make learning more engaging, accessible, and effective for educators and students worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <Award className="w-12 h-12 text-blue-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Adaptive Learning</h3>
              <p className="text-blue-100 leading-relaxed">
                Personalized learning paths that adapt to each student's pace and learning style for optimal educational outcomes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <Zap className="w-12 h-12 text-blue-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Real-time Insights</h3>
              <p className="text-blue-100 leading-relaxed">
                Comprehensive analytics and reporting tools that provide instant feedback on student progress and engagement.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <Users className="w-12 h-12 text-blue-300 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-4">Global Community</h3>
              <p className="text-blue-100 leading-relaxed">
                Connect with educators and learners worldwide through our collaborative platform and shared resources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-blue-800/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-900" />
            </div>
            <span className="text-white text-xl font-bold">signifyEd</span>
          </div>
          <p className="text-blue-100 mb-8">
            Transforming education through innovative digital solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a href="#privacy" className="text-blue-100 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-blue-100 hover:text-white transition-colors">Terms of Service</a>
            <a href="#support" className="text-blue-100 hover:text-white transition-colors">Support</a>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800/30">
            <p className="text-blue-200 text-sm">
              © 2025 signifyEd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;