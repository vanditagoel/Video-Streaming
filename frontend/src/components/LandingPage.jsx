import React from "react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import "../App.css";

function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="spline-bg-absolute">
        <Spline
          scene="https://prod.spline.design/SZU0Dp9zzmMdyO1E/scene.splinecode"
          style={{ width: '100vw', height: '100vh', position: 'absolute', inset: 0, zIndex: 0 }}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div style={{marginTop: '100px', width: '100%'}}>
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg mb-1"
            style={{
              letterSpacing: '0.1em',
              fontFamily: "'Belleza', sans-serif",
              lineHeight: 1,
              textAlign: 'center',
              fontSize: '5.25rem',
            }}
          >
            NEXTFLIX
          </h1>
          <div className="text-xl md:text-2xl font-medium mb-0" style={{textAlign: 'center', fontFamily: "'Belleza', sans-serif", color: '#14b8a6', opacity: 0.7}}>
            All access. All entertainment. All yours.
          </div>
        </div>
        <Link
          to="/main"
          className="get-started-btn px-12 py-5 text-3xl font-bold shadow-lg glass-card text-black rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-white/70 focus:outline-none focus:ring-4 focus:ring-blue-200"
          style={{
            transition: 'color 0.3s',
          }}
          onMouseOver={e => e.currentTarget.style.color = '#048c7f'}
          onMouseOut={e => e.currentTarget.style.color = 'black'}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
