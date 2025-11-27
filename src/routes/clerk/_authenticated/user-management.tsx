import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { IconArrowUpRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LearnMore } from '@/components/learn-more'
import { Search } from '@/components/search'
import { columns } from '@/features/users/components/users-columns'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import { UsersTable } from '@/features/users/components/users-table'
import UsersProvider from '@/features/users/context/users-context'
import { userListSchema } from '@/features/users/data/schema'
import { users } from '@/features/users/data/users'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export const Route = createFileRoute('/clerk/_authenticated/user-management')({
  component: UserManagement,
})

function UserManagement() {
  // Parse user list
  const [opened, setOpened] = useState(true)
  const userList = userListSchema.parse(users)
  return (
    <>
      <UsersProvider>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            {/* Reuse the standard theme switch + profile dropdown instead of Clerk */}
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
              <div className='flex gap-1'>
                <p className='text-muted-foreground'>
                  Manage your users and their roles here.
                </p>
                <LearnMore
                  open={opened}
                  onOpenChange={setOpened}
                  contentProps={{ side: 'right' }}
                >
                  <p>
                    This is the same as{' '}
                    <Link
                      to='/users'
                      className='text-blue-500 underline decoration-dashed underline-offset-2'
                    >
                      '/users'
                    </Link>
                    .
                  </p>

                  <p className='mt-4'>
                    The Clerk-based version of this page has been removed in
                    favor of a custom JWT auth flow.
                    <IconArrowUpRight className='inline-block size-4' />
                  </p>
                </LearnMore>
              </div>
            </div>
            <UsersPrimaryButtons />
          </div>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <UsersTable data={userList} columns={columns} />
          </div>
        </Main>

        <UsersDialogs />
      </UsersProvider>
    </>
  )
}