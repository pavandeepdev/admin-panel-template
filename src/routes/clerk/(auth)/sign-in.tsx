import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/clerk/(auth)/sign-in')({
  component: () => <Navigate to='/sign-in' />,
})
