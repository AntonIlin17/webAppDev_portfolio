// About page: legal name, headshot image, and resume pdf link
import profilePic from '../assets/headshot.jpg';
// TODO: replace with your actual resume file if different
import resumePdf from '../assets/Anton_Ilin.pdf';
export default function About() {
  return (
    <article className="card">
      <h1>About Me</h1>
      {/* TODO: ensure your legal name below */}
      <p>My name is <strong>Anton Ilin</strong>. I build with React, Java, and C#.</p>
      <p>I am passionate about bringing back the tradition of creating free software and making it accessible to everyone.</p>
      <img src={profilePic} alt="Anton Ilin" style={{ width: '150px', borderRadius: '8px' }} />
      <a href={resumePdf} download className="button-link" style={{
        display: 'inline-block',
        marginTop: '1rem',
        padding: '0.8rem 1.5rem',
        backgroundColor: '#DC3535',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
      }}>
        Download My Resume
      </a>
    </article>
  )
}