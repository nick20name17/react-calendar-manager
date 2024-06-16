import { Link, useNavigate } from 'react-router-dom'

import { ThemeToggle } from '../mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { routes } from '@/config/routes'
import { UserAuth } from '@/providers/auth-context'

export const UserMenu = () => {
    const { logOut } = UserAuth()!
    const navigate = useNavigate()

    const session =
        localStorage.getItem('accessGoogleToken') ||
        localStorage.getItem('accessOutlookToken')

    const { user } = JSON.parse(session || '{}') as any

    const handleSignOut = () => {
        localStorage.clear()
        logOut()
        navigate('/login')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className='overflow-hidden rounded-full'
                    size='icon'
                    variant='outline'>
                    <Avatar>
                        <AvatarImage
                            alt={user?.email || 'User'}
                            className='overflow-hidden rounded-full'
                            height={36}
                            src={user?.photoURL}
                            style={{
                                aspectRatio: '36/36',
                                objectFit: 'cover'
                            }}
                            width={36}
                        />
                        <AvatarFallback>
                            {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <img />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ThemeToggle />
                <DropdownMenuItem asChild>
                    <Link to={routes.login}>Link new provider</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
