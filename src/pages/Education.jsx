// Education page: program name, institution, and dates
import Reveal from '../components/Reveal.jsx';

export default function Education() {
  return (
    <section className="card">
      <Reveal>
        <span className="section-eyebrow">Background</span>
        <h1>Education</h1>
      </Reveal>

      <Reveal as="ul" className="timeline" delay={80}>
        <li>
          <h3>Centennial College</h3>
          <p className="meta">AI &amp; Software Engineering (Advanced Diploma) · 2024 – Present</p>
          <p>
            Focused on building full-stack applications and engineering reliable, well-tested
            software.
          </p>
        </li>
        <li>
          <h3>Related Coursework</h3>
          <p>Web Application Development, Data Structures, Object‑Oriented Programming.</p>
        </li>
      </Reveal>
    </section>
  );
}
