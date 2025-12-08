import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@/tests/test-utils'
import { PasswordInput } from '@/components/password-input'

describe('PasswordInput Component', () => {
  it('should render password input', () => {
    render(<PasswordInput id='password' data-testid='password-input' />)
    
    const input = screen.getByTestId('password-input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should toggle password visibility when button is clicked', () => {
    render(<PasswordInput id='password' data-testid='password-input' />)
    
    const input = screen.getByTestId('password-input')
    const toggleButton = screen.getByRole('button')
    
    // Initially should be password type
    expect(input).toHaveAttribute('type', 'password')
    
    // Click to show password
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    
    // Click again to hide password
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should accept user input', () => {
    render(<PasswordInput id='password' data-testid='password-input' />)
    
    const input = screen.getByTestId('password-input') as HTMLInputElement
    
    fireEvent.change(input, { target: { value: 'mySecurePassword123' } })
    expect(input.value).toBe('mySecurePassword123')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<PasswordInput id='password' data-testid='password-input' disabled />)
    
    const input = screen.getByTestId('password-input')
    expect(input).toBeDisabled()
  })
})

