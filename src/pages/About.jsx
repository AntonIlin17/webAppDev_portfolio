import profilePic from 'webAppDev_portfolio/src/assets/headshot.jpg';
import resumePdf from 'webAppDev_portfolio/src/assets/Anton_Ilin.pdf';
export default function About() {
  return (
    <article className="card">
      <h1>About Me</h1>
      <p>My name is <strong>Anton Ilin</strong>. I build with React, Java, and C#.</p>
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