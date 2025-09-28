// Projects page: static data with optional lightbox to view screenshots
import { useEffect, useState } from 'react'
import systemDiagram from '../assets/systemDiagram.jpg'
import rssFeedMain from '../assets/rssFeedMain.png'
import rssFeed1 from '../assets/rssFeed1.png'



// TODO: customize project titles, descriptions, and images as needed
const projectsData = [
        {
            title: 'RSS Aggregator',
            description:
                'Built a feed aggregator that parses multiple RSS sources, normalizes entries, and renders a searchable UI using React.',
            
            images: [rssFeedMain, rssFeed1],
        },
    {
        title: 'TourConnect',
        description:
            'Full‑stack prototype connecting local tour guides with travelers; React front end with simple Node API mock.',
        
        images: [systemDiagram],
    },
    {
        title: 'QA Automation Examples',
        description:
            'Quality Assurance focus with targeted test suites: crafted boundary and negative test cases for the User API (CRUD validation, pagination, error handling, and rate‑limiting) and for user account authentication (signup/login/logout flows, password hashing & salting, JWT/refresh token handling, session expiry, and lockout after repeated failures). Each scenario includes reproducible steps, expected/actual results, and assertions covering success, error, and security edge cases.',
        
        images: [],
    },
]

function ProjectCard({ project, onOpen }) {
    const { title, description, images } = project
    const main = images[0]
    const thumbs = images.slice(1)
    return (
        <li style={{ marginBottom: '28px' }}>
            <h3 style={{ margin: '0 0 10px' }}>{title}</h3>
            <p style={{ margin: '0 0 12px', color: '#666' }}>{description}</p>
            {/* Main image large */}
            {main && (
                <img
                    src={main}
                    alt={`${title} main screenshot`}
                    style={{ width: '100%', maxWidth: 720, height: 'auto', borderRadius: 12, cursor: 'pointer' }}
                    onClick={() => onOpen(images, 0)}
                />
            )}
            {/* Thumbnails (if any) */}
            {thumbs.length > 0 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                    {thumbs.map((src, idx) => (
                        <img
                            key={src}
                            src={src}
                            alt={`${title} extra ${idx + 1}`}
                            style={{ width: 140, height: 90, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                            onClick={() => onOpen(images, idx + 1)}
                        />
                    ))}
                </div>
            )}
        </li>
    )
}

export default function Projects() {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxImages, setLightboxImages] = useState([])
    const [lightboxIndex, setLightboxIndex] = useState(0)

    function openLightbox(images, startIndex = 0) {
        setLightboxImages(images)
        setLightboxIndex(startIndex)
        setLightboxOpen(true)
    }

    function closeLightbox() {
        setLightboxOpen(false)
        setLightboxImages([])
        setLightboxIndex(0)
    }

    function next() {
        setLightboxIndex((i) => (i + 1) % lightboxImages.length)
    }
    function prev() {
        setLightboxIndex((i) => (i - 1 + lightboxImages.length) % lightboxImages.length)
    }

    useEffect(() => {
        function onKey(e) {
            if (!lightboxOpen) return
            if (e.key === 'Escape') closeLightbox()
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [lightboxOpen, lightboxImages.length])

    return (
        <section className="card">
            <h1>Projects</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {projectsData.map((p) => (
                    <ProjectCard key={p.title} project={p} onOpen={openLightbox} />)
                )}
            </ul>

            {/* Lightbox overlay */}
            {lightboxOpen && (
                <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={closeLightbox}>
                    <button className="lightbox-close" aria-label="Close" onClick={closeLightbox}>
                        ×
                    </button>
                    {lightboxImages.length > 1 && (
                        <>
                            <button className="lightbox-nav left" aria-label="Previous" onClick={(e) => { e.stopPropagation(); prev() }}>‹</button>
                            <button className="lightbox-nav right" aria-label="Next" onClick={(e) => { e.stopPropagation(); next() }}>›</button>
                        </>
                    )}
                    <img
                        className="lightbox-img"
                        src={lightboxImages[lightboxIndex]}
                        alt={`Screenshot ${lightboxIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {lightboxImages.length > 1 && (
                        <div className="lightbox-counter">{lightboxIndex + 1} / {lightboxImages.length}</div>
                    )}
                </div>
            )}
        </section>
    )
}