/// <reference types="cypress" />
/* global beforeEach, cy, Cypress, describe, it */

describe('Portfolio App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Homepage Tests', () => {
    it('loads homepage successfully', () => {
      cy.get('h1').should('contain', 'Anton Ilin')
      cy.title().should('not.be.empty')
    })

    it('displays welcome message with name', () => {
      cy.contains('Anton Ilin').should('be.visible')
    })

    it('displays the school and location', () => {
      cy.contains('Centennial College, Toronto').should('be.visible')
    })

    it('links the landing page to the filmstrip', () => {
      cy.contains('See the work').click()
      cy.url().should('include', '/projects')
    })
  })

  describe('Navigation Tests', () => {
    it('navigates to About page', () => {
      cy.get('nav').contains('About').click()
      cy.url().should('include', '/about')
      cy.get('h1').should('contain', 'free software')
    })

    it('navigates to Projects page', () => {
      cy.get('nav').contains('Work').click()
      cy.url().should('include', '/projects')
      cy.get('h1').should('contain', 'Selected work')
    })

    it('navigates to Education page', () => {
      cy.visit('/about')
      cy.contains('a', 'Education').click()
      cy.url().should('include', '/education')
    })

    it('navigates to Services page', () => {
      cy.visit('/about')
      cy.contains('a', 'Services').click()
      cy.url().should('include', '/services')
    })

    it('navigates to Contact page', () => {
      cy.get('nav').contains('Contact').click()
      cy.url().should('include', '/contact')
      cy.get('h1 a').should('have.attr', 'href', 'mailto:antonilin107@gmail.com')
    })

    it('navigates to Login page', () => {
      cy.visit('/contact')
      cy.contains('a', 'Login').click()
      cy.url().should('include', '/login')
    })

    it('can navigate back to Home from any page', () => {
      cy.get('nav').contains('About').click()
      cy.get('[aria-label="Anton Ilin, home"]').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
    })
  })

  describe('About Page Tests', () => {
    beforeEach(() => {
      cy.visit('/about')
    })

    it('displays the fact sheet', () => {
      cy.contains('Toronto, Canada').should('be.visible')
    })

    it('displays download resume button', () => {
      cy.contains('Download my resume').should('be.visible')
    })

    it('mentions skills', () => {
      cy.contains('React, Java and C#').should('be.visible')
    })
  })

  describe('Projects Page Tests', () => {
    beforeEach(() => {
      cy.visit('/projects')
    })

    it('displays project list', () => {
      cy.contains('Autonomous Warehouse Robot').should('be.visible')
      cy.get('[aria-label^="Open project:"]').should('have.length', 5)
    })

    it('displays a gallery with directional buttons only where applicable', () => {
      cy.get('[aria-label="Open project: Autonomous Warehouse Robot"]').click()
      cy.get('[aria-label="Enlarge The warehouse in Gazebo"]').click()
      cy.get('.lightbox-overlay').should('be.visible').within(() => {
        cy.get('[aria-label="Previous image"]').should('not.exist')
        cy.get('[aria-label="Next image"]').click()
        cy.get('[aria-label="Previous image"]').should('be.visible')
        cy.get('[aria-label="Next image"]').click()
        cy.get('[aria-label="Next image"]').should('not.exist')
        cy.get('[aria-label="Close gallery"]').click()
      })
      cy.get('.lightbox-overlay').should('not.exist')
      cy.get('[aria-label="Close project"]').click()
    })
  })

  describe('Contact Page Tests', () => {
    beforeEach(() => {
      cy.visit('/contact/form')
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
    it('displays the signature with current year', () => {
      cy.visit('/contact')
      const currentYear = new Date().getFullYear()
      cy.get('footer').should('contain', currentYear.toString())
      cy.get('footer').should('contain', 'Anton Ilin')
    })
  })
})
