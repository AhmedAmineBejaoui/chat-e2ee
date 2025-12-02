import React, { useState } from "react";
import { createChatInstance, LinkObjType } from "@chat-e2ee/service";
import { ArrowRight, Copy, Mail, Phone, Instagram } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import HoloButton from "../../components/HoloButton";

const LandingPage = () => {
  const [chatLink, setChatLink] = useState<LinkObjType>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const chate2ee = createChatInstance();
      const linkResp = await chate2ee.getLink();
      setChatLink(linkResp);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (chatLink) {
      navigator.clipboard.writeText(chatLink.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative min-h-screen text-white font-sans selection:bg-cyan-400 selection:text-black overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a1929 0%, #001e3c 50%, #0a1929 100%)",
      }}
    >
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 md:px-12 lg:px-20 py-6 flex justify-between items-center">
        <div className="inline-block px-5 py-2 border-2 border-white/30 rounded-full text-sm font-medium text-white tracking-wide">
          Secure Communication
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-16">
        {!chatLink ? (
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-140px)]">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl xl:text-8xl font-bold leading-[1.1] text-white">
                  Encrypted
                  <br />
                  Moments
                </h1>
                
                <p className="text-lg text-white/80 max-w-lg leading-relaxed">
                  Military-grade end-to-end encryption. Zero logs. Zero registration. Pure privacy.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">No Login Required</h3>
                    <p className="text-white/60 text-sm">Start chatting instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Zero Tracker</h3>
                    <p className="text-white/60 text-sm">Complete privacy guaranteed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Disposable Links</h3>
                    <p className="text-white/60 text-sm">Share & auto-expire</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-4">
                <button
                  onClick={generateLink}
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold uppercase text-sm tracking-wider hover:bg-cyan-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Get Started"}
                </button>
                
                <a
                  href="https://github.com/muke1908/chat-e2ee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-semibold uppercase text-sm tracking-wider hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 no-underline"
                >
                  View Source
                </a>
              </div>
            </div>

            {/* Right Isometric Illustration */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Glowing effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse" />
              </div>

              {/* Isometric Phone Container */}
              <div className="relative" style={{ perspective: "1000px" }}>
                {/* Animated Orange Border Container */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(20px)" }}>
                  <svg width="600" height="550" viewBox="0 0 600 550" className="absolute" style={{ filter: "drop-shadow(0 10px 40px rgba(255, 165, 0, 0.6))" }}>
                    <defs>
                      <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#ff9500", stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: "#ffb347", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#ff9500", stopOpacity: 1 }} />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Animated Wavy Border Path */}
                    <path
                      d="M 150 180 
                         Q 120 160, 110 200
                         Q 100 240, 90 280
                         Q 80 340, 100 380
                         Q 120 420, 160 440
                         Q 200 460, 250 470
                         Q 320 485, 390 480
                         Q 450 475, 490 450
                         Q 520 430, 535 400
                         Q 550 360, 545 310
                         Q 540 260, 520 220
                         Q 500 180, 470 150
                         Q 430 110, 380 90
                         Q 320 65, 260 75
                         Q 200 85, 160 110
                         Q 140 125, 150 180 Z"
                      fill="none"
                      stroke="url(#orangeGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    >
                      <animate
                        attributeName="d"
                        dur="8s"
                        repeatCount="indefinite"
                        values="
                          M 150 180 Q 120 160, 110 200 Q 100 240, 90 280 Q 80 340, 100 380 Q 120 420, 160 440 Q 200 460, 250 470 Q 320 485, 390 480 Q 450 475, 490 450 Q 520 430, 535 400 Q 550 360, 545 310 Q 540 260, 520 220 Q 500 180, 470 150 Q 430 110, 380 90 Q 320 65, 260 75 Q 200 85, 160 110 Q 140 125, 150 180 Z;
                          
                          M 145 175 Q 115 165, 105 205 Q 95 245, 85 290 Q 75 345, 95 390 Q 115 430, 155 450 Q 195 470, 245 480 Q 315 495, 385 490 Q 445 485, 485 460 Q 515 440, 530 410 Q 545 370, 540 320 Q 535 270, 515 230 Q 495 190, 465 160 Q 425 120, 375 100 Q 315 75, 255 85 Q 195 95, 155 120 Q 135 135, 145 175 Z;
                          
                          M 155 185 Q 125 155, 115 195 Q 105 235, 95 275 Q 85 335, 105 375 Q 125 415, 165 435 Q 205 455, 255 465 Q 325 480, 395 475 Q 455 470, 495 445 Q 525 425, 540 395 Q 555 355, 550 305 Q 545 255, 525 215 Q 505 175, 475 145 Q 435 105, 385 85 Q 325 60, 265 70 Q 205 80, 165 105 Q 145 120, 155 185 Z;
                          
                          M 150 180 Q 120 160, 110 200 Q 100 240, 90 280 Q 80 340, 100 380 Q 120 420, 160 440 Q 200 460, 250 470 Q 320 485, 390 480 Q 450 475, 490 450 Q 520 430, 535 400 Q 550 360, 545 310 Q 540 260, 520 220 Q 500 180, 470 150 Q 430 110, 380 90 Q 320 65, 260 75 Q 200 85, 160 110 Q 140 125, 150 180 Z"
                      />
                    </path>
                    
                    {/* Inner border glow */}
                    <path
                      d="M 150 180 
                         Q 120 160, 110 200
                         Q 100 240, 90 280
                         Q 80 340, 100 380
                         Q 120 420, 160 440
                         Q 200 460, 250 470
                         Q 320 485, 390 480
                         Q 450 475, 490 450
                         Q 520 430, 535 400
                         Q 550 360, 545 310
                         Q 540 260, 520 220
                         Q 500 180, 470 150
                         Q 430 110, 380 90
                         Q 320 65, 260 75
                         Q 200 85, 160 110
                         Q 140 125, 150 180 Z"
                      fill="none"
                      stroke="#00d9ff"
                      strokeWidth="4"
                      opacity="0.6"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="d"
                        dur="8s"
                        repeatCount="indefinite"
                        values="
                          M 150 180 Q 120 160, 110 200 Q 100 240, 90 280 Q 80 340, 100 380 Q 120 420, 160 440 Q 200 460, 250 470 Q 320 485, 390 480 Q 450 475, 490 450 Q 520 430, 535 400 Q 550 360, 545 310 Q 540 260, 520 220 Q 500 180, 470 150 Q 430 110, 380 90 Q 320 65, 260 75 Q 200 85, 160 110 Q 140 125, 150 180 Z;
                          
                          M 145 175 Q 115 165, 105 205 Q 95 245, 85 290 Q 75 345, 95 390 Q 115 430, 155 450 Q 195 470, 245 480 Q 315 495, 385 490 Q 445 485, 485 460 Q 515 440, 530 410 Q 545 370, 540 320 Q 535 270, 515 230 Q 495 190, 465 160 Q 425 120, 375 100 Q 315 75, 255 85 Q 195 95, 155 120 Q 135 135, 145 175 Z;
                          
                          M 155 185 Q 125 155, 115 195 Q 105 235, 95 275 Q 85 335, 105 375 Q 125 415, 165 435 Q 205 455, 255 465 Q 325 480, 395 475 Q 455 470, 495 445 Q 525 425, 540 395 Q 555 355, 550 305 Q 545 255, 525 215 Q 505 175, 475 145 Q 435 105, 385 85 Q 325 60, 265 70 Q 205 80, 165 105 Q 145 120, 155 185 Z;
                          
                          M 150 180 Q 120 160, 110 200 Q 100 240, 90 280 Q 80 340, 100 380 Q 120 420, 160 440 Q 200 460, 250 470 Q 320 485, 390 480 Q 450 475, 490 450 Q 520 430, 535 400 Q 550 360, 545 310 Q 540 260, 520 220 Q 500 180, 470 150 Q 430 110, 380 90 Q 320 65, 260 75 Q 200 85, 160 110 Q 140 125, 150 180 Z"
                      />
                      <animate
                        attributeName="opacity"
                        dur="3s"
                        repeatCount="indefinite"
                        values="0.3;0.8;0.3"
                      />
                    </path>
                  </svg>
                </div>

                {/* Background geometric shapes with animations */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Diagonal lines and shapes */}
                  <svg width="600" height="600" viewBox="0 0 600 600" className="absolute" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#0ff", stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: "#0ff", stopOpacity: 0.2 }} />
                      </linearGradient>
                    </defs>

                    {/* Animated diagonal lines - bottom left area */}
                    <g opacity="0.6">
                      <path d="M 80 520 L 200 450" stroke="#0ff" strokeWidth="3" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; -5,5; 0,0" dur="4s" repeatCount="indefinite" />
                      </path>
                      <path d="M 50 480 L 180 400" stroke="#0ff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M 100 550 L 220 480" stroke="url(#cyanGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3.5s" begin="1s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; 3,-3; 0,0" dur="5s" repeatCount="indefinite" />
                      </path>
                    </g>

                    {/* Animated diagonal lines - top right area */}
                    <g opacity="0.7">
                      <path d="M 520 80 L 400 150" stroke="#0ff" strokeWidth="3" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.8s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; 5,-5; 0,0" dur="4.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M 550 50 L 420 130" stroke="#0ff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.2s" begin="0.8s" repeatCount="indefinite" />
                      </path>
                      <path d="M 490 110 L 360 180" stroke="url(#cyanGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; -4,4; 0,0" dur="5.5s" repeatCount="indefinite" />
                      </path>
                    </g>

                    {/* Animated diagonal lines - bottom right area */}
                    <g opacity="0.6">
                      <path d="M 550 480 L 420 410" stroke="#0ff" strokeWidth="3" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3.3s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; 4,4; 0,0" dur="4.2s" repeatCount="indefinite" />
                      </path>
                      <path d="M 520 520 L 400 450" stroke="#0ff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.7s" begin="0.6s" repeatCount="indefinite" />
                      </path>
                      <path d="M 570 450 L 440 380" stroke="url(#cyanGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.5;0.95;0.5" dur="3.8s" begin="0.3s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; -3,3; 0,0" dur="5.2s" repeatCount="indefinite" />
                      </path>
                    </g>

                    {/* Animated diagonal lines - left side */}
                    <g opacity="0.5">
                      <path d="M 60 300 L 150 250" stroke="#0ff" strokeWidth="2.5" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.6s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; -5,0; 0,0" dur="4.8s" repeatCount="indefinite" />
                      </path>
                      <path d="M 40 350 L 140 290" stroke="url(#cyanGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.9s" begin="1s" repeatCount="indefinite" />
                      </path>
                    </g>

                    {/* Animated diagonal lines - right side */}
                    <g opacity="0.5">
                      <path d="M 540 300 L 450 250" stroke="#0ff" strokeWidth="2.5" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.4;0.85;0.4" dur="3.4s" repeatCount="indefinite" />
                        <animateTransform attributeName="transform" type="translate" values="0,0; 5,0; 0,0" dur="4.6s" repeatCount="indefinite" />
                      </path>
                      <path d="M 560 350 L 460 290" stroke="url(#cyanGrad)" strokeWidth="2" fill="none" strokeLinecap="round">
                        <animate attributeName="opacity" values="0.3;0.75;0.3" dur="3.1s" begin="0.7s" repeatCount="indefinite" />
                      </path>
                    </g>

                    {/* Animated glowing circles */}
                    <circle cx="120" cy="500" r="8" fill="#0ff" opacity="0.6">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                    </circle>
                    
                    <circle cx="480" cy="100" r="10" fill="#00f" opacity="0.5">
                      <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="r" values="8;12;8" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    
                    <circle cx="500" cy="480" r="9" fill="#0f0" opacity="0.6">
                      <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="r" values="7;11;7" dur="1.8s" repeatCount="indefinite" />
                    </circle>

                    <circle cx="90" cy="250" r="6" fill="#0ff" opacity="0.5">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
                      <animate attributeName="r" values="5;9;5" dur="2.2s" begin="0.5s" repeatCount="indefinite" />
                    </circle>

                    <circle cx="510" cy="350" r="7" fill="#0ff" opacity="0.6">
                      <animate attributeName="opacity" values="0.4;0.95;0.4" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                      <animate attributeName="r" values="6;10;6" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>

                {/* Main Phone */}
                <div
                  className="relative w-64 h-96 bg-gradient-to-br from-cyan-500 via-blue-600 to-blue-800 rounded-[40px] shadow-[0_30px_90px_rgba(0,255,255,0.4)] border-4 border-cyan-400/30"
                  style={{
                    transform: "rotateX(8deg) rotateY(-12deg) rotateZ(-2deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Screen */}
                  <div className="absolute inset-6 bg-gradient-to-br from-blue-900 to-black rounded-[32px] overflow-hidden border-2 border-cyan-400/20">
                    {/* Lock Icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_20px_60px_rgba(0,255,255,0.5)]">
                      <div className="relative">
                        {/* Lock body */}
                        <div className="w-10 h-6 bg-blue-900 rounded-md" />
                        {/* Lock shackle */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 border-4 border-blue-900 rounded-full border-b-transparent" />
                      </div>
                    </div>
                  </div>

                  {/* Phone notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />

                  {/* Side lighting effects */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent" />
                  <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />
                </div>

                {/* Floating cards/elements around phone */}
                <div
                  className="absolute -left-16 top-12 w-20 h-20 bg-gradient-to-br from-white to-gray-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                  style={{ transform: "rotateX(8deg) rotateY(-25deg)" }}
                />
                <div
                  className="absolute -left-20 bottom-16 w-16 h-16 bg-gradient-to-br from-white to-gray-200 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                  style={{ transform: "rotateX(8deg) rotateY(-25deg)" }}
                />
                <div
                  className="absolute -right-16 bottom-24 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-[0_20px_50px_rgba(0,255,0,0.4)]"
                  style={{ transform: "rotateX(8deg) rotateY(15deg)" }}
                >
                  <div className="absolute inset-2 border-2 border-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-12 min-h-[calc(100vh-140px)] flex flex-col justify-center">
            <div className="space-y-2 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white">Your Secure Chat Link</h2>
              <p className="text-white/60">Share this encrypted link to start chatting</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-2 border-cyan-400/30 rounded-3xl p-8 md:p-12 shadow-[0_30px_90px_rgba(0,255,255,0.2)] text-left relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent pointer-events-none" />
              
              <div className="space-y-3 mb-10 relative">
                <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Encrypted Link</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-black/40 border-2 border-cyan-400/40 rounded-2xl px-5 py-4 text-white truncate font-mono shadow-inner backdrop-blur-sm">
                    {chatLink.hash}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="px-8 py-4 rounded-2xl border-2 border-cyan-400 bg-cyan-400 text-black font-semibold uppercase text-sm tracking-wider hover:bg-transparent hover:text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                    {!copied && <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative">
                <div className="bg-black/40 border-2 border-cyan-400/30 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center gap-4 hover:border-cyan-400/60 transition-all backdrop-blur-sm">
                  <div className="bg-white p-3 rounded-xl shadow-[0_10px_40px_rgba(0,255,255,0.3)]">
                    <QRCodeCanvas value={chatLink.hash} size={140} />
                  </div>
                  <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wide">Scan QR Code</span>
                </div>

                <a
                  href={chatLink.hash}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-cyan-400/10 to-blue-600/10 border-2 border-cyan-400 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center gap-3 hover:bg-cyan-400 hover:text-black transition-all duration-300 group cursor-pointer text-center no-underline backdrop-blur-sm shadow-[0_20px_60px_rgba(0,255,255,0.2)]"
                >
                  <ArrowRight className="w-12 h-12 text-cyan-400 group-hover:text-black transition-colors" />
                  <span className="text-cyan-400 group-hover:text-black font-bold text-xl uppercase tracking-wide transition-colors">Open Chat</span>
                  <span className="text-white/60 group-hover:text-black/80 text-sm transition-colors">Start encrypted conversation</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LandingPage;
