import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isEqual,
    parse,
    startOfToday,
    startOfWeek
} from 'date-fns'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { CalendarDay } from './calendar-day'
import { CreateEventPopup } from './create-event-popup'
import { Button } from '@/components/ui/button'
import { useGetGoogleEventsQuery } from '@/store/api/google'
import { useGetOutlookEventsQuery } from '@/store/api/outlook'
import type { EventItem } from '@/types/google-events'
import { getBodyText } from '@/utils'

export const Calendar = () => {
    const goggleSession = localStorage.getItem('accessGoogleToken')

    const { user } = JSON.parse(goggleSession || '{}') as any

    const { data: googleEvents } = useGetGoogleEventsQuery(user?.email!)

    const { data: outlookEvents } = useGetOutlookEventsQuery()

    const outlookEventItems: EventItem[] =
        outlookEvents?.value?.map((event) => {
            return {
                outlookEventId: event.id,
                title: event?.subject,
                start: event?.start?.dateTime,
                end: event?.end?.dateTime,
                description: getBodyText(event?.body?.content),
                originLinks: {
                    outlook: event?.webLink
                }
            }
        }) ?? []

    const googleEventItems =
        googleEvents?.items?.map((event) => {
            return {
                googleEventId: event.id,
                title: event?.summary,
                start: event?.start?.dateTime,
                end: event?.end?.dateTime,
                description: event?.description ?? '',
                originLinks: {
                    google: event?.htmlLink
                }
            }
        }) ?? []

    const getEvents = (outlookEvents: EventItem[], googleEvents: EventItem[]) => {
        const combinedEvents: EventItem[] = []
        const matchedGoogleEventIds = new Set()

        outlookEvents.forEach((outlookEvent) => {
            const googleEvent = googleEvents.find((googleEvent) => {
                return (
                    googleEvent.title === outlookEvent.title &&
                    isEqual(googleEvent.start, outlookEvent.start) &&
                    isEqual(googleEvent.end, outlookEvent.end) &&
                    googleEvent?.description?.trim() ===
                        getBodyText(outlookEvent?.description!)?.trim()
                )
            })

            if (googleEvent) {
                const combinedEvent = {
                    outlookEventId: outlookEvent.outlookEventId,
                    googleEventId: googleEvent.googleEventId,
                    title: outlookEvent.title,
                    start: outlookEvent.start,
                    end: outlookEvent.end,
                    description: outlookEvent.description,
                    originLinks: {
                        outlook: outlookEvent.originLinks.outlook,
                        google: googleEvent.originLinks.google
                    }
                }
                combinedEvents.push(combinedEvent)
                matchedGoogleEventIds.add(googleEvent.googleEventId)
            } else {
                combinedEvents.push(outlookEvent)
            }
        })

        googleEvents.forEach((googleEvent) => {
            if (!matchedGoogleEventIds.has(googleEvent.googleEventId)) {
                combinedEvents.push(googleEvent)
            }
        })

        return combinedEvents
    }

    const events = getEvents(outlookEventItems, googleEventItems)

    const today = startOfToday()
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM yyyy'))

    const firstDayCurrentMonth = parse(currentMonth, 'MMM yyyy', new Date())

    const getNextMonth = () => {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM yyyy'))
    }

    const getPreviousMonth = () => {
        const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayPreviousMonth, 'MMM yyyy'))
    }

    const getCurrentMonthDays = () => {
        return eachDayOfInterval({
            start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
            end: endOfWeek(endOfMonth(firstDayCurrentMonth), {
                weekStartsOn: 1
            })
        })
    }

    return (
        <>
            <div className='p-5 flex items-center justify-between gap-x-8 gap-y-4 flex-wrap'>
                <CreateEventPopup />
                <div className='max-[420px]:justify-between max-[420px]:flex-1 flex items-center justify-center gap-x-4 '>
                    <Button
                        onClick={getPreviousMonth}
                        variant='outline'
                        className='h-8 w-8 p-0'>
                        <ArrowLeft className='h-4 w-4' />
                    </Button>

                    <h1 className='scroll-m-20 font-bold '>
                        {format(firstDayCurrentMonth, 'MMM yyyy')}
                    </h1>

                    <Button
                        onClick={getNextMonth}
                        variant='outline'
                        className='h-8 w-8 p-0'>
                        <ArrowRight className='h-4 w-4' />
                    </Button>
                </div>
            </div>

            <div className='!w-full !overflow-x-auto'>
                <Weeks />
                <Body
                    events={events}
                    currentDays={getCurrentMonthDays()}
                    firstDayCurrentMonth={firstDayCurrentMonth}
                />
            </div>
        </>
    )
}

const Body = ({
    currentDays,
    firstDayCurrentMonth,
    events
}: {
    currentDays: Date[]
    firstDayCurrentMonth: Date
    events: EventItem[]
}) => {
    return (
        <div className='grid grid-cols-[repeat(7,1fr)] gap-2 px-3'>
            {currentDays.map((currentDate) => (
                <CalendarDay
                    events={events?.filter((event) => {
                        return (
                            (new Date(event.start).getDate() === currentDate.getDate() &&
                                new Date(event.start).getMonth() ===
                                    currentDate.getMonth() &&
                                new Date(event.start).getFullYear() ===
                                    currentDate.getFullYear()) ||
                            (new Date(event.end).getDate() === currentDate.getDate() &&
                                new Date(event.end).getMonth() ===
                                    currentDate.getMonth() &&
                                new Date(event.end).getFullYear() ===
                                    currentDate.getFullYear())
                        )
                    })}
                    date={currentDate}
                    key={currentDate.toString()}
                    firstDayCurrentMonth={firstDayCurrentMonth}
                />
            ))}
        </div>
    )
}

const Weeks = () => {
    return (
        <div className='grid grid-cols-[repeat(7,1fr)] gap-2 px-3 '>
            <div className='text-center p-4 min-w-[187px]'>Monday</div>
            <div className='text-center p-4 min-w-[187px]'>Tuesday</div>
            <div className='text-center p-4 min-w-[187px]'>Wednesday</div>
            <div className='text-center p-4 min-w-[187px]'>Thursday</div>
            <div className='text-center p-4 min-w-[187px]'>Friday</div>
            <div className='text-center p-4 min-w-[187px]'>Saturday</div>
            <div className='text-center p-4 min-w-[187px]'>Sunday</div>
        </div>
    )
}
