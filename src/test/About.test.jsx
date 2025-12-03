import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import About from '../pages/About'

// Mock the static assets
vi.mock('../assets/headshot.jpg', () => ({ default: 'mocked-headshot.jpg' }))
vi.mock('../assets/Anton_Ilin.pdf', () => ({ default: 'mocked-resume.pdf' }))

describe('About Component', () => {
  it('renders About Me heading', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    expect(screen.getByText('About Me')).toBeInTheDocument()
  })

  it('displays the full name', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    expect(screen.getByText(/Anton Ilin/i)).toBeInTheDocument()
  })

  it('renders headshot image', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    const img = screen.getByAltText('Anton Ilin')
    expect(img).toBeInTheDocument()
  })

  it('renders download resume link', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    const downloadLink = screen.getByRole('link', { name: /download my resume/i })
    expect(downloadLink).toBeInTheDocument()
    expect(downloadLink).toHaveAttribute('download')
  })

  it('mentions skills: React, Java, C#', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    )
    expect(screen.getByText(/React, Java, and C#/i)).toBeInTheDocument()
  })
})
