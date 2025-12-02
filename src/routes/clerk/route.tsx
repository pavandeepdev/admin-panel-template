import { createFileRoute, Link } from '@tanstack/react-router'
import { IconKeyOff } from '@tabler/icons-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Main } from '@/components/layout/main'
import { ThemeSwitch } from '@/components/theme-switch'

export const Route = createFileRoute('/clerk')({
  component: RouteComponent,
})

function RouteComponent() {
  // Legacy Clerk routes: we keep this wrapper so existing /clerk URLs still work,
  // but the actual auth implementation is now custom JWT-based.
  return <MissingClerkPubKey />
}

function MissingClerkPubKey() {
  const codeBlock =
    'bg-foreground/10 rounded-sm py-0.5 px-1 text-xs text-foreground font-bold'
  return (
    <AuthenticatedLayout>
      <div className='bg-background flex h-16 justify-between p-4'>
        <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
        <ThemeSwitch />
      </div>
      <Main className='flex flex-col items-center justify-start'>
        <div className='max-w-2xl'>
          <Alert>
            <IconKeyOff className='size-4' />
            <AlertTitle>Clerk integration removed</AlertTitle>
            <AlertDescription>
              <p className='text-balance'>
                This project now uses a custom JWT-based authentication flow
                instead of Clerk.
              </p>
            </AlertDescription>
          </Alert>

          <h1 className='mt-4 text-2xl font-bold'>Set your Clerk API key</h1>
          <div className='text-foreground/75 mt-4 flex flex-col gap-y-4'>
            <ol className='list-inside list-decimal space-y-1.5'>
              <li>
                To sign in, please use the standard{' '}
                <Link
                  to='/sign-in'
                  className='underline decoration-dashed underline-offset-4 hover:decoration-solid'
                >
                  sign-in
                </Link>{' '}
                route backed by JWT auth.
              </li>
              <li>
                The old Clerk demo routes under{' '}
                <code className={codeBlock}>/clerk</code> are kept only as
                examples and no longer talk to Clerk.
              </li>
              <li>
                You can safely remove the{' '}
                <code className={codeBlock}>src/routes/clerk</code> directory if
                you don&apos;t need these example pages.
              </li>
            </ol>
            <p>The final result should resemble the following:</p>

            <div className='@container space-y-2 rounded-md bg-slate-800 px-3 py-3 text-sm text-slate-200'>
              <span className='pl-1'>.env</span>
              <pre className='overflow-auto overscroll-x-contain rounded bg-slate-950 px-2 py-1 text-xs'>
                <code>
                  <span className='before:text-slate-400 md:before:pr-2 md:before:content-["1."]'>
                    VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
                  </span>
                </code>
              </pre>
            </div>
          </div>

          <Separator className='my-4 w-full' />

          <Alert>
            <AlertTitle>Clerk Integration is Optional</AlertTitle>
            <AlertDescription>
              <p className='text-balance'>
                Clerk is no longer required for this starter. Authentication is
                now handled via a reusable JWT-based API layer.
              </p>
              <p>
                If you want to reintroduce Clerk in your own fork, you can
                restore the previous implementation or add a new provider-based
                integration under a different route.
              </p>
              <p className='mt-2 text-sm'>
                This setup is modular by design and won't affect the rest of the
                application.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </Main>
    </AuthenticatedLayout>
  )
}
