import webDev from '../assets/webDevImage.jpg';
import generalProg from '../assets/prorgramming.jpg';
import qatesting from '../assets/qualityAssurance.jpg';

// Services page: list what you offer with small icons
function ServiceItem({ title, iconUrl }) {
    return (
        <li style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.2rem', marginBottom: '1rem' }}>
            <img src={iconUrl} alt="" style={{ width: '40px', height: '40px' }}/>
            {title}
        </li>
    );
}

export default function Services() {
  return (
    <section className="card">
      <h1>Services</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* TODO: adjust services and icons to match your focus */}
        <ServiceItem title="Web Development" iconUrl={webDev} />
        <ServiceItem title="General Programming" iconUrl={generalProg} />
        <ServiceItem title="QA & Testing" iconUrl={qatesting} />
      </ul>
    </section>
  )
}
