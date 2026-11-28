import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'

describe('Home Component', () => {
  it('renders the monolith name heading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Anton Ilin' })).toBeInTheDocument()
  })

  it('renders intro text with name', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByText(/AI and software engineering student/i)).toBeInTheDocument()
  })

  it('shows confirmation after a contact submission', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: { submittedName: 'Sam' } }]}>
        <Home />
      </MemoryRouter>
    )
    expect(screen.getByRole('status')).toHaveTextContent('Thanks, Sam!')
  })

  it('links to the work filmstrip', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /see the work/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/projects')
  })
})
