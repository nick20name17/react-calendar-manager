import { UserMenu } from '@/components/home/user-menu'
import { ModeToggle } from '@/components/mode-toggle'

export const Header = () => {
    return (
        <header className='p-4 border-b border-slate-500 flex items-center justify-between'>
            <div className='w-10 h-10 bg-primary rounded-full'></div>
            <div className='flex items-center gap-x-4'>
                <ModeToggle />
                <UserMenu />
            </div>
        </header>
    )
}
