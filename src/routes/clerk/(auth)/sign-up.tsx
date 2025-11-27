import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/clerk/(auth)/sign-up')({
  component: () => <Navigate to='/sign-up' />,
})
