import { useNavigate } from 'react-router-dom'

import { Button } from '../ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { UserAuth } from '@/providers/auth-context'

export const UserMenu = () => {
    const { logOut } = UserAuth()!
    const navigate = useNavigate()

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
                    {/* <Avatar>
                        <AvatarImage
                            alt={session?.user?.email || 'User'}
                            className='overflow-hidden rounded-full'
                            height={36}
                            src={session?.user?.user_metadata.avatar_url}
                            style={{
                                aspectRatio: '36/36',
                                objectFit: 'cover'
                            }}
                            width={36}
                        />
                        <AvatarFallback>
                            {session?.user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar> */}
                    hey
                    <img />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
