// Education page: include program name, institution, and dates per assignment requirements
export default function Education() {
  return (
    <section className="card">
      <h1>Education</h1>
      <ul style={{ lineHeight: 1.6 }}>
        <li>
          {/* TODO: update program name/dates if needed */}
          <strong>Centennial College</strong> — AI & Software Engineering (Advanced Diploma), 2024 – Present
        </li>
        <li>
          {/* TODO: tailor coursework list */}
          Related Coursework: Web Application Development, Data Structures, Object‑Oriented Programming
        </li>
      </ul>
    </section>
  )
}