import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Contact from '../pages/Contact'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Contact Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('renders Contact Me heading', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
    expect(screen.getByText('Contact Me')).toBeInTheDocument()
  })

  it('renders contact email', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
    expect(screen.getByText('antonilin107@gmail.com')).toBeInTheDocument()
  })

  it('renders contact phone number', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
    expect(screen.getByText('(416) 278-9778')).toBeInTheDocument()
  })

  it('renders all form fields', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('allows typing in form fields', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    )
    
    const firstNameInput = screen.getByLabelText(/first name/i)
    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    expect(firstNameInput.value).toBe('John')

    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } })
    expect(emailInput.value).toBe('john@test.com')
  })
})
