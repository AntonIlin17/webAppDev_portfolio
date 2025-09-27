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

	function onSubmit(e) {
		e.preventDefault()
		// For now, just log and redirect back to Home as per assignment guidance
		console.log('Contact form submitted', form)
		alert(`Thanks, ${form.firstName}! Your message has been captured.`)
		navigate('/')
	}

	return (
		<section className="card">
			<h1>Contact Me</h1>
			<p>Feel free to reach out using the form below.</p>

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

