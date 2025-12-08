import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@/tests/test-utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Example component that fetches data
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>No user found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

// Mock API handlers
const handlers = [
  http.get('/api/users/:userId', ({ params }) => {
    const { userId } = params
    
    if (userId === '1') {
      return HttpResponse.json({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      })
    }
    
    return HttpResponse.json(
      { message: 'User not found' },
      { status: 404 }
    )
  }),
]

// Setup MSW server
const server = setupServer(...handlers)

describe('API Mocking with MSW', () => {
  // Start server before all tests
  beforeAll(() => server.listen())
  
  // Reset handlers after each test
  afterEach(() => server.resetHandlers())
  
  // Close server after all tests
  afterAll(() => server.close())

  it('should fetch and display user data', async () => {
    const queryClient = new QueryClient()
    
    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId='1' />
      </QueryClientProvider>
    )

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    const queryClient = new QueryClient()
    
    // Override the handler to return an error
    server.use(
      http.get('/api/users/:userId', () => {
        return HttpResponse.json(
          { message: 'Server error' },
          { status: 500 }
        )
      })
    )

    render(
      <QueryClientProvider client={queryClient}>
        <UserProfile userId='999' />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
  })
})
