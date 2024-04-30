import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export const UserMenu = () => {
    const session = useSession()
    const supabase = useSupabaseClient()

    const signOut = async () => {
        await supabase.auth.signOut()
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
                    </Avatar>
                    <img />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
