import { describe, it, expect } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import { ThemeSwitch } from '@/components/theme-switch'

describe('ThemeSwitch Component', () => {
  it('should render the theme switch button', () => {
    render(<ThemeSwitch />)
    
    // Check if the button is in the document
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it('should render sun and moon icons', () => {
    const { container } = render(<ThemeSwitch />)
    
    // Check for SVG elements (icons)
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThan(0)
  })
})

