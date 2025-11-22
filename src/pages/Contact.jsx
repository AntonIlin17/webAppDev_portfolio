// Contact page: captures fields and redirects to Home with state
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Contact() {
	const navigate = useNavigate()
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		email: '',
		message: ''
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
						message: form.message
					})
				});

				if (res.ok) {
					console.log('Contact form submitted', form)
					// Redirect to Home and show a confirmation banner
					navigate('/', { state: { submittedName: form.firstName } })
				} else {
					console.error('Failed to submit contact form');
					alert('Failed to send message. Please try again.');
				}
			} catch (err) {
				console.error('Error submitting contact form:', err);
				alert('Error sending message.');
			}
	}

	return (
		<section className="card">
			<h1>Contact Me</h1>
			<p>Feel free to reach out using the form below.</p>

			{/* Static contact info (personalize as needed) */}
			<div className="contact-info" style={{ marginBottom: '16px' }}>
				<p style={{ margin: 0 }}>
					<strong>Email:</strong>
					{' '}
					{/* TODO: update to your preferred email */}
					<a href="mailto:antonilin107@gmail.com">antonilin107@gmail.com</a>
				</p>
				<p style={{ margin: '6px 0 0' }}>
					{/* TODO: update to your preferred phone or remove */}
					<strong>Phone:</strong> (416) 278-9778
				</p>
			</div>

			<form className="contact-form" onSubmit={onSubmit}>
				<div className="row">
					<label>
						First Name
						<input
							type="text"
							name="firstName"
							value={form.firstName}
							onChange={onChange}
							required
						/>
					</label>
					<label>
						Last Name
						<input
							type="text"
							name="lastName"
							value={form.lastName}
							onChange={onChange}
							required
						/>
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
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={onChange}
							required
						/>
					</label>
				</div>

				<label>
					Message
					<textarea
						name="message"
						rows="5"
						value={form.message}
						onChange={onChange}
						required
					/>
				</label>

				<button type="submit">Send</button>
			</form>
		</section>
	)
}

