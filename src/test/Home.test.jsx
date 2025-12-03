import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'

// Mock react-router-dom's useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({ state: null }),
  }
})

describe('Home Component', () => {
  it('renders welcome heading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('Welcome to My Portfolio')).toBeInTheDocument()
  })

  it('renders intro text with name', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText(/Anton Ilin/i)).toBeInTheDocument()
  })

  it('renders mission statement section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText('My Mission')).toBeInTheDocument()
  })

  it('renders "More About Me" link', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /more about me/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/about')
  })
})
