import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import PortfolioAbout from '../pages/PortfolioAbout'

vi.mock('../assets/Anton_Ilin.pdf', () => ({ default: 'mocked-resume.pdf' }))

function renderAbout() {
  return render(<MemoryRouter><PortfolioAbout /></MemoryRouter>)
}

describe('About page', () => {
  it('is headed by the name and lists the facts', () => {
    renderAbout()
    expect(screen.getByRole('heading', { level: 1, name: 'Anton Ilin' })).toBeInTheDocument()
    expect(screen.getByText('Toronto, Canada')).toBeInTheDocument()
    expect(screen.getByText(/React, JavaScript, Java, C#/)).toBeInTheDocument()
    expect(screen.getByText('Cares about')).toBeInTheDocument()
  })

  it('links to the resume, the older pages and the Dither Cabinet project', () => {
    renderAbout()
    expect(screen.getByRole('link', { name: /download my resume/i })).toHaveAttribute('download')
    expect(screen.getByRole('link', { name: 'Education' })).toHaveAttribute('href', '/education')
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('link', { name: 'Dither Cabinet' })).toHaveAttribute('href', '/projects/dither-cabinet')
  })
})
