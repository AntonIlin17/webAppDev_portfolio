// Inline SVG monogram used as the site logo; clicking it routes to Home
import { Link } from 'react-router-dom';

export default function Logo({ size = 56 }) {
  return (
    <Link to="/" className="site-logo" aria-label="Home">
      <svg
        viewBox="0 0 240 240"
        width={size}
        height={size}
        role="img"
        aria-label="Anton Ilin monogram"
      >
        {/* Split circle */}
        <path d="M120 18 a102 102 0 0 0 0 204" fill="none" stroke="#414141" strokeWidth="11" />
        <path d="M120 222 a102 102 0 0 0 0 -204" fill="none" stroke="#DC3535" strokeWidth="11" />

        {/* Stylized A with simple circuits */}
        <g>
          <polygon points="71,173 120,45 125,63 99,119 139,119 144,132 89,132" fill="#414141" />
          <line x1="99" y1="119" x2="89" y2="132" stroke="#fff" strokeWidth="2" />
          <line x1="99" y1="119" x2="120" y2="80" stroke="#fff" strokeWidth="2" />
          <line x1="120" y1="80" x2="110" y2="63" stroke="#fff" strokeWidth="2" />
          <line x1="99" y1="119" x2="120" y2="119" stroke="#fff" strokeWidth="2" />
          <circle cx="89" cy="132" r="5" fill="#fff" />
          <circle cx="120" cy="80" r="4" fill="#fff" />
          <circle cx="110" cy="63" r="3.5" fill="#fff" />
          <circle cx="120" cy="119" r="4" fill="#fff" />
        </g>

        {/* Stylized I with accents */}
        <g>
          <polygon points="140,65 183,65 183,72 175,77 148,77 140,72" fill="#DC3535" />
          <polygon points="155,77 168,77 168,155 155,155" fill="#DC3535" />
          <polygon points="140,155 148,160 175,160 183,167 140,167" fill="#DC3535" />
          <rect x="150" y="90" width="3" height="15" fill="#DC3535" opacity="0.7" />
          <rect x="170" y="105" width="3" height="15" fill="#DC3535" opacity="0.7" />
          <rect x="150" y="125" width="3" height="15" fill="#DC3535" opacity="0.7" />
          <rect x="170" y="140" width="3" height="15" fill="#DC3535" opacity="0.7" />
          <line x1="161.5" y1="77" x2="161.5" y2="95" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          <line x1="161.5" y1="116" x2="175" y2="116" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          <line x1="161.5" y1="135" x2="148" y2="135" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          <line x1="161.5" y1="155" x2="161.5" y2="160" stroke="#fff" strokeWidth="1.5" opacity="0.9" />
          <circle cx="161.5" cy="95" r="3" fill="#fff" opacity="0.9" />
          <circle cx="175" cy="116" r="2.5" fill="#fff" opacity="0.9" />
          <circle cx="148" cy="135" r="2.5" fill="#fff" opacity="0.9" />
          <circle cx="161.5" cy="116" r="4" fill="#fff" />
          <polygon points="183,65 183,72 178,67" fill="#fff" opacity="0.5" />
          <polygon points="140,167 145,162 140,160" fill="#fff" opacity="0.5" />
        </g>
      </svg>
    </Link>
  );
}
