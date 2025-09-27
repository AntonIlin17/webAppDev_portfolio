// src/components/Logo/Logo.jsx
import { useEffect, useRef, useState } from 'react';

export default function Logo() {
  const particlesRef = useRef(null);
  const wrapperRef = useRef(null);
  const mainLogoRef = useRef(null);
  const [condensed, setCondensed] = useState(false);
  const condensedRef = useRef(false);

  useEffect(() => {
    // --- Toggle condensed header on scroll ---
    function onScroll() {
      // Threshold can be tuned; higher means user scrolls more before condensing
      const threshold = 140;
      const isCondensed = window.scrollY > threshold;
      setCondensed(isCondensed);
      condensedRef.current = isCondensed;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Floating particles creation ---
    const container = particlesRef.current;
    const particles = [];
    if (container) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = 25 + Math.random() * 10 + 's';
        container.appendChild(particle);
        particles.push(particle);
      }
    }

    // --- 3D tilt effect ---
    const wrapper = wrapperRef.current;
    function onMouseMove(e) {
      if (!wrapper || condensedRef.current) {
        if (wrapper) wrapper.style.transform = '';
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      wrapper.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    }
    function onMouseLeave() {
      if (wrapper) wrapper.style.transform = 'rotateX(0) rotateY(0)';
    }
    if (wrapper) {
      wrapper.addEventListener('mousemove', onMouseMove);
      wrapper.addEventListener('mouseleave', onMouseLeave);
    }

    // --- Restart animation on logo click ---
    const mainLogo = mainLogoRef.current;
    function restartAnimations() {
      const root = wrapperRef.current;
      if (!root) return;
      const animated = root.querySelectorAll(
        '.draw-path-left, .draw-path-right, .letter-a, .letter-i, .circuit-line, .circuit-dot, .circuit-line-i, .circuit-dot-i, .name, .subtitle, .restart-hint'
      );
      animated.forEach((el) => {
        el.style.animation = 'none';
      });
      // Force reflow
      void document.body.offsetHeight;
      // Restore
      animated.forEach((el) => {
        el.style.animation = '';
      });
    }
    if (mainLogo) mainLogo.addEventListener('click', restartAnimations);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (wrapper) {
        wrapper.removeEventListener('mousemove', onMouseMove);
        wrapper.removeEventListener('mouseleave', onMouseLeave);
      }
      if (mainLogo) mainLogo.removeEventListener('click', restartAnimations);
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div className={`ai-logo${condensed ? ' condensed' : ''}`}>
      {/* Scoped styles for this component only (no body/* resets) */}
      <style>{`
        .ai-logo { position: relative; }
        /* Make the whole block behave like a hero that can dock to the top as a header */
        .ai-logo { position: sticky; top: 0; z-index: 100; }

        .ai-logo .logo-container { text-align: center; margin-top: 60px; position: relative; transition: all 0.4s ease; }
        .ai-logo .main-logo { margin: 0 auto 32px auto; display: block; transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease, margin 0.3s ease; cursor: pointer; filter: drop-shadow(0 10px 30px rgba(0,0,0,0.1)); }
        .ai-logo .main-logo:hover { transform: scale(1.05) rotate(3deg); }

        /* Condensed (sticky header) state */
        .ai-logo.condensed { backdrop-filter: saturate(180%) blur(6px); background: rgba(255,255,255,0.7); box-shadow: 0 2px 14px rgba(0,0,0,0.06); }
        .ai-logo.condensed .logo-container { 
          margin: 0; 
          padding: 10px 16px; 
          display: flex; 
          align-items: center; 
          justify-content: flex-start; 
          gap: 12px; 
          text-align: left;
        }
        .ai-logo.condensed .main-logo { 
          width: 42px; height: 42px; 
          margin: 0; 
          transform: none !important; /* avoid hover tilt/scale while condensed */
          filter: none;
        }
        .ai-logo.condensed .name { 
          margin: 0; 
          font-size: 22px; 
          letter-spacing: 2px; 
          background: none; 
          -webkit-text-fill-color: initial; 
          color: #222; 
          opacity: 1; 
          transform: none; 
          animation: none; 
        }
        .ai-logo.condensed .subtitle { display: none; }
        .ai-logo.condensed .perspective-wrapper { perspective: none; }
        .ai-logo.condensed .restart-hint { display: none; }

        /* Animated stroke drawing for circle halves */
        .ai-logo .draw-path-left { stroke-dasharray: 650; stroke-dashoffset: 650; animation: ai-logo-drawPath 1.5s ease forwards; }
        .ai-logo .draw-path-right { stroke-dasharray: 650; stroke-dashoffset: 650; animation: ai-logo-drawPath 1.5s ease forwards 0.2s; }
        @keyframes ai-logo-drawPath { to { stroke-dashoffset: 0; } }

        /* Circuit animations */
        .ai-logo .circuit-line, .ai-logo .circuit-line-i {
          opacity: 0; stroke-dasharray: 100; stroke-dashoffset: 100; animation: ai-logo-drawCircuit 0.5s ease forwards;
        }
        .ai-logo .circuit-line:nth-child(1) { animation-delay: 0.8s; }
        .ai-logo .circuit-line:nth-child(2) { animation-delay: 1.0s; }
        .ai-logo .circuit-line:nth-child(3) { animation-delay: 1.2s; }
        .ai-logo .circuit-line:nth-child(4) { animation-delay: 1.4s; }
        .ai-logo .circuit-line-i:nth-child(1) { animation-delay: 0.9s; }
        .ai-logo .circuit-line-i:nth-child(2) { animation-delay: 1.1s; }
        .ai-logo .circuit-line-i:nth-child(3) { animation-delay: 1.3s; }
        .ai-logo .circuit-line-i:nth-child(4) { animation-delay: 1.5s; }

        @keyframes ai-logo-drawCircuit {
          to { opacity: 1; stroke-dashoffset: 0; filter: drop-shadow(0 0 3px rgba(255,255,255,0.8)); }
        }

        .ai-logo .circuit-dot, .ai-logo .circuit-dot-i {
          opacity: 0; animation: ai-logo-pulseIn 0.6s ease forwards;
        }
        .ai-logo .circuit-dot:nth-child(5) { animation-delay: 1.6s; }
        .ai-logo .circuit-dot:nth-child(6) { animation-delay: 1.8s; }
        .ai-logo .circuit-dot:nth-child(7) { animation-delay: 2.0s; }
        .ai-logo .circuit-dot:nth-child(8) { animation-delay: 2.2s; }
        .ai-logo .circuit-dot-i:nth-child(5) { animation-delay: 1.7s; }
        .ai-logo .circuit-dot-i:nth-child(6) { animation-delay: 1.9s; }
        .ai-logo .circuit-dot-i:nth-child(7) { animation-delay: 2.1s; }
        .ai-logo .circuit-dot-i:nth-child(8) { animation-delay: 2.3s; }

        @keyframes ai-logo-pulseIn {
          0% { opacity: 0; transform: scale(0); }
          50% { transform: scale(1.5); }
          100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 5px rgba(255,255,255,0.9)); }
        }

        /* Letters entrance */
        .ai-logo .letter-a, .ai-logo .letter-i { opacity: 0; }
        .ai-logo .letter-a { animation: ai-logo-slideInLeft 0.8s ease forwards 0.5s; }
        .ai-logo .letter-i { animation: ai-logo-slideInRight 0.8s ease forwards 0.5s; }
        @keyframes ai-logo-slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes ai-logo-slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }

        /* Name & subtitle */
        .ai-logo .name {
          font-size: 38px; font-weight: 900; letter-spacing: 6px; margin-bottom: 10px;
          background: linear-gradient(90deg, #414141 0%, #DC3535 50%, #414141 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          opacity: 0; transform: translateY(20px);
          animation: ai-logo-fadeInUp 1s ease forwards 2.4s, ai-logo-gradientShift 3s linear infinite 3.4s;
        }
        @keyframes ai-logo-gradientShift { to { background-position: 200% center; } }
        @keyframes ai-logo-fadeInUp { to { opacity: 1; transform: translateY(0); } }

        .ai-logo .subtitle { font-size: 19px; letter-spacing: 4px; color: #5d5d5d; font-weight: 400; opacity: 0; transform: translateY(20px); animation: ai-logo-fadeInUp 1s ease forwards 2.7s; }
        .ai-logo .subtitle-line { display: block; }

        /* Perspective wrapper for tilt */
  .ai-logo .perspective-wrapper { perspective: 1000px; transition: transform 0.1s ease; }

        /* Particles */
        .ai-logo .particles { position: absolute; inset: 0; pointer-events: none; z-index: -1; }
        .ai-logo .particle { position: absolute; width: 2px; height: 2px; background: #DC3535; border-radius: 50%; opacity: 0.2; animation: ai-logo-float 25s infinite linear; }
        .ai-logo .particle:nth-child(even) { background: #414141; animation-duration: 30s; }
        @keyframes ai-logo-float {
          0% { transform: translateY(100%) translateX(0); opacity: 0; }
          10% { opacity: 0.2; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-100%) translateX(100px); opacity: 0; }
        }

        /* Restart hint */
        .ai-logo .restart-hint { text-align: center; font-size: 14px; color: #999; opacity: 0; animation: ai-logo-fadeInUp 1s ease forwards 4s; transition: color 0.3s ease; }
        .ai-logo .restart-hint:hover { color: #DC3535; }

        /* Responsive */
        @media (max-width: 600px) {
          .ai-logo .main-logo { width: 160px; height: 160px; }
          .ai-logo .name { font-size: 25px; letter-spacing: 2px; }
          .ai-logo .subtitle { font-size: 12px; letter-spacing: 2px; }
          .ai-logo .restart-hint { font-size: 12px; }
          .ai-logo.condensed .main-logo { width: 36px; height: 36px; }
          .ai-logo.condensed .name { font-size: 18px; letter-spacing: 1.5px; }
        }
      `}</style>

      {/* Particles layer (scoped inside component) */}
      <div className="particles" ref={particlesRef} />

      {/* 3D perspective wrapper */}
      <div className="perspective-wrapper" ref={wrapperRef}>
        <div className="logo-container">
          <svg className="main-logo" ref={mainLogoRef} viewBox="0 0 240 240" width="220" height="220" aria-label="Anton Ilin monogram">
            {/* Circle halves */}
            <path className="draw-path-left" d="M120 18 a102 102 0 0 0 0 204" fill="none" stroke="#414141" strokeWidth="11"/>
            <path className="draw-path-right" d="M120 222 a102 102 0 0 0 0 -204" fill="none" stroke="#DC3535" strokeWidth="11"/>

            {/* Stylized A */}
            <g className="letter-a">
              <polygon points="71,173 120,45 125,63 99,119 139,119 144,132 89,132" fill="#414141"/>
              <line className="circuit-line" x1="99" y1="119" x2="89" y2="132" stroke="#fff" strokeWidth="2"/>
              <line className="circuit-line" x1="99" y1="119" x2="120" y2="80" stroke="#fff" strokeWidth="2"/>
              <line className="circuit-line" x1="120" y1="80" x2="110" y2="63" stroke="#fff" strokeWidth="2"/>
              <line className="circuit-line" x1="99" y1="119" x2="120" y2="119" stroke="#fff" strokeWidth="2"/>
              <circle className="circuit-dot" cx="89" cy="132" r="5" fill="#fff"/>
              <circle className="circuit-dot" cx="120" cy="80" r="4" fill="#fff"/>
              <circle className="circuit-dot" cx="110" cy="63" r="3.5" fill="#fff"/>
              <circle className="circuit-dot" cx="120" cy="119" r="4" fill="#fff"/>
            </g>

            {/* Stylized I */}
            <g className="letter-i">
              <polygon points="140,65 183,65 183,72 175,77 148,77 140,72" fill="#DC3535"/>
              <polygon points="155,77 168,77 168,155 155,155" fill="#DC3535"/>
              <polygon points="140,155 148,160 175,160 183,167 140,167" fill="#DC3535"/>
              <rect x="150" y="90" width="3" height="15" fill="#DC3535" opacity="0.7"/>
              <rect x="170" y="105" width="3" height="15" fill="#DC3535" opacity="0.7"/>
              <rect x="150" y="125" width="3" height="15" fill="#DC3535" opacity="0.7"/>
              <rect x="170" y="140" width="3" height="15" fill="#DC3535" opacity="0.7"/>
              <line className="circuit-line-i" x1="161.5" y1="77" x2="161.5" y2="95" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
              <line className="circuit-line-i" x1="161.5" y1="116" x2="175" y2="116" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
              <line className="circuit-line-i" x1="161.5" y1="135" x2="148" y2="135" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
              <line className="circuit-line-i" x1="161.5" y1="155" x2="161.5" y2="160" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
              <circle className="circuit-dot-i" cx="161.5" cy="95" r="3" fill="#fff" opacity="0.9"/>
              <circle className="circuit-dot-i" cx="175" cy="116" r="2.5" fill="#fff" opacity="0.9"/>
              <circle className="circuit-dot-i" cx="148" cy="135" r="2.5" fill="#fff" opacity="0.9"/>
              <circle className="circuit-dot-i" cx="161.5" cy="116" r="4" fill="#fff"/>
              <polygon points="183,65 183,72 178,67" fill="#fff" opacity="0.5"/>
              <polygon points="140,167 145,162 140,160" fill="#fff" opacity="0.5"/>
            </g>
          </svg>

          <h1 className="name">ANTON ILIN</h1>
          <div className="subtitle">
            <span className="subtitle-line">WEB DEVELOPMENT</span>
            <span className="subtitle-line">PORTFOLIO</span>
          </div>
        </div>
      </div>

      <p className="restart-hint">Click logo to replay animation</p>
    </div>
  );
}
