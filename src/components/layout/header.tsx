import { Link } from 'react-router-dom'

import { Button } from '../ui/button'

import googleIcon from '@/assets/img/google.webp'
import outlookIcon from '@/assets/img/microsoft.png'
import { UserMenu } from '@/components/home/user-menu'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { routes } from '@/config/routes'

export const Header = () => {
    const isGoogle = !!localStorage.getItem('accessGoogleToken')
    const isOutlook = !!localStorage.getItem('accessOutlookToken')

    return (
        <header className='p-4 border-b border-slate-500 flex items-center justify-between'>
            <Link to={routes.home}>
                <svg
                    width='40'
                    height='40'
                    viewBox='0 0 70 75'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <rect
                        x='3'
                        y='8'
                        width='64'
                        height='64'
                        rx='8'
                        stroke='#3B82F6'
                        strokeWidth='5'
                    />
                    <path
                        d='M39.3409 35.7045C39.2652 34.8712 38.928 34.2235 38.3295 33.7614C37.7386 33.2917 36.8939 33.0568 35.7955 33.0568C35.0682 33.0568 34.4621 33.1515 33.9773 33.3409C33.4924 33.5303 33.1288 33.7917 32.8864 34.125C32.6439 34.4508 32.5189 34.8258 32.5114 35.25C32.4962 35.5985 32.5644 35.9053 32.7159 36.1705C32.875 36.4356 33.1023 36.6705 33.3977 36.875C33.7008 37.072 34.0644 37.2462 34.4886 37.3977C34.9129 37.5492 35.3902 37.6818 35.9205 37.7955L37.9205 38.25C39.072 38.5 40.0871 38.8333 40.9659 39.25C41.8523 39.6667 42.5947 40.1629 43.1932 40.7386C43.7992 41.3144 44.2576 41.9773 44.5682 42.7273C44.8788 43.4773 45.0379 44.3182 45.0455 45.25C45.0379 46.7197 44.6667 47.9811 43.9318 49.0341C43.197 50.0871 42.1402 50.8939 40.7614 51.4545C39.3902 52.0152 37.7348 52.2955 35.7955 52.2955C33.8485 52.2955 32.1515 52.0038 30.7045 51.4205C29.2576 50.8371 28.1326 49.9508 27.3295 48.7614C26.5265 47.572 26.1136 46.0682 26.0909 44.25H31.4773C31.5227 45 31.7235 45.625 32.0795 46.125C32.4356 46.625 32.9242 47.0038 33.5455 47.2614C34.1742 47.5189 34.9015 47.6477 35.7273 47.6477C36.4848 47.6477 37.1288 47.5455 37.6591 47.3409C38.197 47.1364 38.6098 46.8523 38.8977 46.4886C39.1856 46.125 39.3333 45.7083 39.3409 45.2386C39.3333 44.7992 39.197 44.4242 38.9318 44.1136C38.6667 43.7955 38.2576 43.5227 37.7045 43.2955C37.1591 43.0606 36.4621 42.8447 35.6136 42.6477L33.1818 42.0795C31.1667 41.6174 29.5795 40.8712 28.4205 39.8409C27.2614 38.803 26.6856 37.4015 26.6932 35.6364C26.6856 34.197 27.072 32.9356 27.8523 31.8523C28.6326 30.7689 29.7121 29.9242 31.0909 29.3182C32.4697 28.7121 34.0417 28.4091 35.8068 28.4091C37.6098 28.4091 39.1742 28.7159 40.5 29.3295C41.8333 29.9356 42.8674 30.7879 43.6023 31.8864C44.3371 32.9848 44.7121 34.2576 44.7273 35.7045H39.3409Z'
                        fill='#3B82F6'
                    />
                    <rect
                        x='52'
                        width='5'
                        height='16'
                        rx='2.5'
                        fill='hsl(var(--foreground))'
                    />
                    <rect
                        x='43'
                        width='5'
                        height='16'
                        rx='2.5'
                        fill='hsl(var(--foreground))'
                    />
                    <rect
                        x='22'
                        width='5'
                        height='16'
                        rx='2.5'
                        fill='hsl(var(--foreground))'
                    />
                    <rect
                        x='13'
                        width='5'
                        height='16'
                        rx='2.5'
                        fill='hsl(var(--foreground))'
                    />
                </svg>
            </Link>

            <div className='flex items-center gap-x-10'>
                <div className='flex items-center gap-x-2 '>
                    <span className='text-sm text-foreground/40 max-[500px]:hidden'>
                        You currently logged in with:{' '}
                    </span>
                    {isGoogle ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant='outline' size='icon'>
                                        <img
                                            className='h-6 w-6'
                                            src={googleIcon}
                                            alt='Google'
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Google</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : null}
                    {isOutlook ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant='outline' size='icon'>
                                        <img
                                            className='h-6 w-6'
                                            src={outlookIcon}
                                            alt='Outlook'
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Outlook</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : null}
                </div>
                <div className='flex items-center gap-x-4'>
                    <UserMenu />
                </div>
            </div>
        </header>
    )
}
