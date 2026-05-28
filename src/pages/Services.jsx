// Services page: what I offer, presented as cards
import webDev from '../assets/webDevImage.jpg';
import generalProg from '../assets/prorgramming.jpg';
import qatesting from '../assets/qualityAssurance.jpg';
import Reveal from '../components/Reveal.jsx';

const services = [
  {
    title: 'Web Development',
    icon: webDev,
    blurb: 'Responsive, accessible front ends and full-stack apps built with React and modern tooling.',
  },
  {
    title: 'General Programming',
    icon: generalProg,
    blurb: 'Clean, maintainable solutions in Java and C#, from data structures to APIs.',
  },
  {
    title: 'QA & Testing',
    icon: qatesting,
    blurb: 'Thorough test suites covering boundary, negative, and security edge cases.',
  },
];

export default function Services() {
  return (
    <section className="card">
      <Reveal>
        <span className="section-eyebrow">What I do</span>
        <h1>Services</h1>
        <p className="lead">Areas where I can help bring an idea to a shipped product.</p>
      </Reveal>

      <div className="grid grid-3">
        {services.map((s, i) => (
          <Reveal as="div" className="tile" delay={i * 90} key={s.title}>
            <img className="tile-icon" src={s.icon} alt="" />
            <h3>{s.title}</h3>
            <p>{s.blurb}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
