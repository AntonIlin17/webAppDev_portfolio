/// <reference types="cypress" />

describe('Portfolio App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Homepage Tests', () => {
    it('loads homepage successfully', () => {
      cy.get('h1').should('contain', 'Welcome to My Portfolio')
      cy.title().should('not.be.empty')
    })

    it('displays welcome message with name', () => {
      cy.contains('Anton Ilin').should('be.visible')
    })

    it('displays mission statement', () => {
      cy.contains('My Mission').should('be.visible')
    })

    it('has working "More About Me" link', () => {
      cy.contains('More About Me').click()
      cy.url().should('include', '/about')
    })
  })

  describe('Navigation Tests', () => {
    it('navigates to About page', () => {
      cy.get('nav').contains('About').click()
      cy.url().should('include', '/about')
      cy.get('h1').should('contain', 'About Me')
    })

    it('navigates to Projects page', () => {
      cy.get('nav').contains('Projects').click()
      cy.url().should('include', '/projects')
      cy.get('h1').should('contain', 'Projects')
    })

    it('navigates to Education page', () => {
      cy.get('nav').contains('Education').click()
      cy.url().should('include', '/education')
    })

    it('navigates to Services page', () => {
      cy.get('nav').contains('Services').click()
      cy.url().should('include', '/services')
    })

    it('navigates to Contact page', () => {
      cy.get('nav').contains('Contact').click()
      cy.url().should('include', '/contact')
      cy.get('h1').should('contain', 'Contact Me')
    })

    it('navigates to Login page', () => {
      cy.get('nav').contains('Login').click()
      cy.url().should('include', '/login')
    })

    it('can navigate back to Home from any page', () => {
      cy.get('nav').contains('About').click()
      cy.get('nav').contains('Home').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('About Page Tests', () => {
    beforeEach(() => {
      cy.visit('/about')
    })

    it('displays profile image', () => {
      cy.get('img[alt="Anton Ilin"]').should('be.visible')
    })

    it('displays download resume button', () => {
      cy.contains('Download My Resume').should('be.visible')
    })

    it('mentions skills', () => {
      cy.contains('React, Java, and C#').should('be.visible')
    })
  })

  describe('Projects Page Tests', () => {
    beforeEach(() => {
      cy.visit('/projects')
    })

    it('displays project list', () => {
      cy.contains('RSS Aggregator').should('be.visible')
      cy.contains('TourConnect').should('be.visible')
      cy.contains('QA Automation Examples').should('be.visible')
    })

    it('displays project images', () => {
      cy.get('img').should('have.length.at.least', 1)
    })
  })

  describe('Contact Page Tests', () => {
    beforeEach(() => {
      cy.visit('/contact')
    })

    it('displays contact information', () => {
      cy.contains('antonilin107@gmail.com').should('be.visible')
      cy.contains('(416) 278-9778').should('be.visible')
    })

    it('displays contact form', () => {
      cy.get('form.contact-form').should('be.visible')
    })

    it('can fill out contact form', () => {
      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="phone"]').type('123-456-7890')
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('textarea[name="message"]').type('This is a test message for E2E testing.')
      
      // Verify values are entered
      cy.get('input[name="firstName"]').should('have.value', 'Test')
      cy.get('input[name="lastName"]').should('have.value', 'User')
      cy.get('input[name="email"]').should('have.value', 'test@example.com')
    })

    it('has submit button', () => {
      cy.get('button[type="submit"]').should('contain', 'Send')
    })
  })

  describe('Footer Tests', () => {
    it('displays copyright with current year', () => {
      const currentYear = new Date().getFullYear()
      cy.get('footer').should('contain', currentYear.toString())
      cy.get('footer').should('contain', 'Anton Ilin')
    })
  })
})
