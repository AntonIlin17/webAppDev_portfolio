// Cards for the Colab notebooks: one figure, two headline metrics, a link.
import KsiChart from './KsiChart.jsx'
import { NOTEBOOKS } from '../data/notebooks.js'

export default function NotebookCards({ onOpenImage }) {
  const images = NOTEBOOKS.filter((n) => n.image).map((n) => n.image)
  return (
    <div className="nb-grid">
      {NOTEBOOKS.map((nb) => (
        <article className="nb" key={nb.url}>
          {nb.chart ? (
            <KsiChart />
          ) : (
            <img src={nb.image} alt={nb.alt} loading="lazy" onClick={() => onOpenImage && onOpenImage(images, images.indexOf(nb.image))} />
          )}
          <span className="nb-course">{nb.course}</span>
          <h4>{nb.title}</h4>
          <div className="nb-metrics">{nb.metrics.map((m) => <div key={m}>{m}</div>)}</div>
          <a href={nb.url} target="_blank" rel="noopener noreferrer">Open in Colab ↗</a>
        </article>
      ))}
    </div>
  )
}
