// Contact page: captures fields and redirects to Home with state
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  })

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: form.firstName,
          lastname: form.lastName,
          phone: form.phone,
          email: form.email,
          message: form.message,
        }),
      })

      if (res.ok) {
        navigate('/', { state: { submittedName: form.firstName } })
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch {
      alert('Error sending message.')
    }
  }

  return (
    <section className="card">
      <Reveal>
        <span className="section-eyebrow">Let&apos;s talk</span>
        <h1>Contact Me</h1>
        <p className="lead">Feel free to reach out using the form below.</p>

        <div className="contact-info">
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:antonilin107@gmail.com">antonilin107@gmail.com</a>
          </p>
          <p>
            <strong>Phone:</strong> (416) 278-9778
          </p>
        </div>
      </Reveal>

      <Reveal as="form" className="form contact-form" delay={80} onSubmit={onSubmit}>
        <div className="row">
          <label>
            First Name
            <input type="text" name="firstName" value={form.firstName} onChange={onChange} required />
          </label>
          <label>
            Last Name
            <input type="text" name="lastName" value={form.lastName} onChange={onChange} required />
          </label>
        </div>

        <div className="row">
          <label>
            Contact Number
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="123-456-7890"
            />
          </label>
          <label>
            Email Address
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
        </div>

        <label>
          Message
          <textarea name="message" rows="5" value={form.message} onChange={onChange} required />
        </label>

        <div>
          <button type="submit" className="btn btn-primary">Send</button>
        </div>
      </Reveal>
    </section>
  )
}
