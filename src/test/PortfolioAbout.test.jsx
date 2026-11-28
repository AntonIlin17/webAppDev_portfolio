import { render, screen, within } from '@testing-library/react'
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

  it('lists work experience, newest first', () => {
    renderAbout()
    const section = screen.getByRole('region', { name: 'Work experience' })
    const roles = within(section).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(roles).toEqual(['Frontend Developer', 'Sales Manager', 'Painting Crew Chief', 'Crew Trainer'])
    expect(within(section).getByText('Paideum')).toBeInTheDocument()
    expect(within(section).getByText('Apr 2022 to Jan 2025')).toBeInTheDocument()
  })

  it('includes education with the relevant courses', () => {
    renderAbout()
    const section = screen.getByRole('region', { name: 'Education' })
    expect(within(section).getByRole('heading', { level: 3, name: 'Artificial Intelligence and Software Engineering' })).toBeInTheDocument()
    expect(within(section).getByText('Advanced Diploma, Centennial College')).toBeInTheDocument()
    expect(within(section).getByText('Machine Learning')).toBeInTheDocument()
  })

  it('links to the resume, its own sections, services and the Dither Cabinet project', () => {
    renderAbout()
    expect(screen.getByRole('link', { name: /download my resume/i })).toHaveAttribute('download')
    expect(screen.getByRole('link', { name: 'Work experience' })).toHaveAttribute('href', '/about#experience')
    expect(screen.getByRole('link', { name: 'Education' })).toHaveAttribute('href', '/about#education')
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services')
    expect(screen.getByRole('link', { name: 'Dither Cabinet' })).toHaveAttribute('href', '/projects/dither-cabinet')
  })
})
