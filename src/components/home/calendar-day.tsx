import { format, isSameMonth, isToday } from 'date-fns'
import { useState } from 'react'

import { CreateEventForm } from './create-event-form'
import { EventBadge } from './event-badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import type { EventItem } from '@/types/google-events'
import { cn } from '@/utils/cn'

interface EventDialogProps {
    date: Date
    firstDayCurrentMonth: Date
    events: EventItem[]
}

export const CalendarDay: React.FC<EventDialogProps> = ({
    date,
    firstDayCurrentMonth,
    events
}) => {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        'flex flex-col justify-between flex-1 rounded-sm border p-3 gap-y-2 h-[106px]',
                        isToday(date) && 'border-primary',
                        !isSameMonth(date, firstDayCurrentMonth) && 'opacity-50'
                    )}>
                    <span
                        className={cn(
                            'self-end',
                            isToday(date) &&
                                'flex items-center justify-center bg-primary w-8 h-8 rounded-full text-background'
                        )}>
                        {format(date, 'd')}
                    </span>

                    <EventBadge events={events} date={date} />
                </button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Add new event</DialogTitle>
                </DialogHeader>
                <CreateEventForm date={date} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}
