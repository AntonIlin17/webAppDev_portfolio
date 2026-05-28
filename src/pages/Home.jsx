// Home page: hero intro, mission band, and a success banner after Contact submit
import { Link, useLocation } from "react-router-dom";
import profilePic from "../assets/headshot.jpg";
import Reveal from "../components/Reveal.jsx";

export default function Home() {
  const location = useLocation();
  // When Contact form redirects here, it passes { submittedName }
  const submittedName = location.state?.submittedName;

  return (
    <section className="card hero">
      <div className="hero-inner">
        <Reveal>
          <span className="section-eyebrow">AI &amp; Software Engineering Student</span>
          <h1>Welcome to My Portfolio</h1>
          <p className="lead">
            Hi, I&apos;m Anton Ilin — a student in AI &amp; Software Engineering at Centennial
            College, building clean, reliable software with React, Java, and C#.
          </p>

          {submittedName && (
            <div className="banner">
              Thanks, <strong>{submittedName}</strong>! Your message was captured and I&apos;ll
              get back to you soon.
            </div>
          )}

          <div className="hero-cta">
            <Link to="/projects" className="btn btn-primary">View My Work</Link>
            <Link to="/contact" className="btn btn-ghost">Get in Touch</Link>
          </div>
        </Reveal>

        <Reveal className="hero-portrait" delay={120}>
          <img src={profilePic} alt="Anton Ilin" />
        </Reveal>
      </div>

      <Reveal as="div" className="band mission-statement">
        <span className="section-eyebrow">My Mission</span>
        <h2>Software that earns its keep</h2>
        <p className="lead">
          To leverage my skills in React, Java, and C# to create impactful software solutions
          that enhance user experiences and drive innovation.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/about" className="btn btn-ghost">More About Me</Link>
        </div>
      </Reveal>
    </section>
  );
}
