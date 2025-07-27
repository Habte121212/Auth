import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../login/Login'
import { AuthContext } from '../context/AuthContext'

function renderWithProviders(ui, { providerProps, ...renderOptions } = {}) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={providerProps}>{ui}</AuthContext.Provider>
    </MemoryRouter>,
    renderOptions,
  )
}

describe('Login component', () => {
  const providerProps = { setUser: vi.fn(), user: null }

  it('renders email and password fields', () => {
    renderWithProviders(<Login />, { providerProps })
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('shows error on empty submit', () => {
    renderWithProviders(<Login />, { providerProps })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument()
  })

  // Add more tests for successful login, error states, etc.
})
