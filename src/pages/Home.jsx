// Home page: welcomes the visitor and shows a success banner after Contact submit
import { Link, useLocation } from "react-router-dom";

export default function Home() {
    const location = useLocation();
    // When Contact form redirects here, it passes { submittedName }
    const submittedName = location.state?.submittedName;
        return (
                <section className="card">
            <h1>Welcome to My Portfolio</h1>
                        {submittedName && (
                            <p style={{ background: '#eaf7ea', color: '#1b5e20', padding: '10px 12px', borderRadius: 8 }}>
                                Thanks, {submittedName}! Your message was captured and I’ll get back to you soon.
                            </p>
                        )}
            {/* TODO: personalize intro text if needed */}
            <p className="intro"> Hi, I'm Anton Ilin a student in AI & Software Engineering at Centennial College.</p>
            <div className ="mission-statement" style={{ margin: '2rem 0'}}>
                <h2>My Mission</h2>
                <p>To leverage my skills in React, Java, and C# to create impactful software solutions that enhance user experiences and drive innovation.</p>
                <Link to="/about" className="button-link" style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    padding: '0.8rem 1.5rem',
                    backgroundColor: '#DC3535',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',

                }}>
                    More About Me
                </Link>
            </div>
        </section>
    )
}