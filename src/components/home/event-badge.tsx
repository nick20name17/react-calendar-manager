import { format } from 'date-fns'
import { useState } from 'react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'

import { EditEventForm } from './edit-event-form'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import type { EventItem } from '@/types/google-events'

interface EventBadgeProps {
    events: EventItem[]
    date: Date
}
export const EventBadge: React.FC<EventBadgeProps> = ({ events, date }) => {
    const [open, setOpen] = useState(false)

    return events?.length ? (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className='w-full flex items-center justify-between'
                    variant='outline'>
                    <Badge className='pointer-events-none'>{events?.length}</Badge>
                    Event(s)
                </Button>
            </DialogTrigger>
            <DialogContent
                className='sm:max-w-[425px]'
                onClick={(e) => {
                    e.stopPropagation()
                }}>
                <DialogHeader>
                    <DialogTitle>Events at {format(date, 'do MMM')}</DialogTitle>
                </DialogHeader>

                <ScrollArea className='h-96 rounded-md border p-2'>
                    <div className='flex flex-col gap-y-2'>
                        {events?.map((event) => {
                            return (
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant='secondary'
                                            key={event.id}
                                            size='lg'
                                            className='justify-between text-left w-full'>
                                            <div>{event.title}</div>

                                            <div>
                                                {format(event.start, 'HH:mm')} -{' '}
                                                {format(event.end, 'HH:mm')}
                                            </div>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-[425px]'>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Edit Event{' '}
                                                <span className='text-blue-500'>
                                                    {event.title}
                                                </span>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <EditEventForm {...event} setOpen={setOpen} />
                                    </DialogContent>
                                </Dialog>
                            )
                        })}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    ) : null
}
