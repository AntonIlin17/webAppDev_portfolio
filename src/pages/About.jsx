// About page: legal name, headshot image, and resume pdf link
import profilePic from '../assets/headshot.jpg';
import resumePdf from '../assets/Anton_Ilin.pdf';
import Reveal from '../components/Reveal.jsx';

export default function About() {
  return (
    <article className="card">
      <Reveal>
        <span className="section-eyebrow">Get to know me</span>
        <h1>About Me</h1>
      </Reveal>

      <Reveal as="div" className="about-grid" delay={80}>
        <img className="about-photo" src={profilePic} alt="Anton Ilin" />
        <div>
          <p className="lead">
            My name is <strong>Anton Ilin</strong>. I build with React, Java, and C#.
          </p>
          <p>
            I am passionate about bringing back the tradition of creating free software and
            making it accessible to everyone. I care about clean architecture, thoughtful
            interfaces, and code that holds up under real-world use.
          </p>
          <div className="about-actions">
            <a href={resumePdf} download className="btn btn-primary">
              Download My Resume
            </a>
          </div>
        </div>
      </Reveal>
    </article>
  );
}
