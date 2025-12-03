import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Projects from '../pages/Projects'

// Mock static assets
vi.mock('../assets/systemDiagram.jpg', () => ({ default: 'mocked-system-diagram.jpg' }))
vi.mock('../assets/rssFeedMain.png', () => ({ default: 'mocked-rss-main.png' }))
vi.mock('../assets/rssFeed1.png', () => ({ default: 'mocked-rss-1.png' }))

describe('Projects Component', () => {
  it('renders Projects heading', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('renders RSS Aggregator project', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('RSS Aggregator')).toBeInTheDocument()
  })

  it('renders TourConnect project', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('TourConnect')).toBeInTheDocument()
  })

  it('renders QA Automation Examples project', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText('QA Automation Examples')).toBeInTheDocument()
  })

  it('displays project descriptions', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    expect(screen.getByText(/feed aggregator/i)).toBeInTheDocument()
    expect(screen.getByText(/tour guides with travelers/i)).toBeInTheDocument()
  })

  it('renders project images', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })
})
