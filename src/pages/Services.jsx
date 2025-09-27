import webDev from 'webAppDev_portfolio/src/assets/webDevImage.png';
import generalProg from 'webAppDev_portfolio/src/assets/prorgramming.png';
import qatesting from 'webAppDev_portfolio/src/assets/qualityAssurance.png';

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
        <ServiceItem title="Web Development" iconUrl={webDev} />
        <ServiceItem title="General Programming" iconUrl={generalProg} />
        <ServiceItem title="QA & Testing" iconUrl={qatesting} />
      </ul>
    </section>
  )
}
