import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDateTime } from '@internationalized/date'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'

import { DateTimePicker } from './datetime/datetime-picker'
import { RemoveEventModal } from './modals/remove-event'
import googleIcon from '@/assets/img/google.webp'
import outlookIcon from '@/assets/img/microsoft.png'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { calendarSchema, eventSchema } from '@/config/schemas'
import { usePatchGoogleEventMutation } from '@/store/api/google'
import type { EventItem, EventItemToAdd } from '@/types/google-events'

export type EventData = z.infer<typeof eventSchema>
type DateTimeValue = z.infer<typeof calendarSchema>

interface EventFormProps extends EventItem {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const EditEventForm: React.FC<EventFormProps> = ({ setOpen, ...event }) => {
    const { start, title, end, description, id } = event

    const sessionFromLocalStorage = localStorage.getItem('accessGoogleToken')

    const { user } = JSON.parse(sessionFromLocalStorage || '{}') as any

    const form = useForm<EventData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            start: new CalendarDateTime(
                new Date(start).getFullYear(),
                new Date(start).getMonth() + 1,
                new Date(start).getDate(),
                new Date(start).getHours(),
                new Date(start).getMinutes()
            ),
            end: new CalendarDateTime(
                new Date(end).getFullYear(),
                new Date(end).getMonth() + 1,
                new Date(end).getDate(),
                new Date(end).getHours(),
                new Date(end).getMinutes()
            ),
            providers: [],
            summary: title,
            description: description
        }
    })

    const [patchGoogleEvent] = usePatchGoogleEventMutation()

    const editGoogleEvent = async (event: EventItemToAdd) => {
        try {
            await patchGoogleEvent({
                eventId: id,
                calendarId: user?.email!,
                ...event
            })
                .unwrap()
                .then((data) => {
                    setOpen(false)
                    toast.success(`Event ${data.summary} created successfully`, {
                        description: `Event starts at ${format(data.start.dateTime, 'dd.MM.yyyy HH:mm')}, ends at ${format(data.end.dateTime, 'dd.MM.yyyy HH:mm')}`
                    })
                })
        } catch (error) {}
    }

    const getFormattedDate = (value: DateTimeValue) =>
        new Date(
            value.year,
            value.month - 1,
            value.day,
            value.hour,
            value.minute,
            value.second
        ).toISOString()

    const onSubmit = async (data: EventData) => {
        const event = {
            summary: data.summary,
            description: data.description,
            start: {
                dateTime: getFormattedDate(data.start),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: getFormattedDate(data.end),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }

        if (data.providers.includes('google')) editGoogleEvent(event)
    }

    const isGoogle = !!localStorage.getItem('accessGoogleToken')
    const isOutlook = !!localStorage.getItem('accessOutlookToken')

    const providers = [
        {
            id: 'google',
            label: 'Google',
            disabled: !isGoogle
        },
        {
            id: 'outlook',
            label: 'Outlook',
            disabled: !isOutlook
        }
    ] as const

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='summary'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                                <Input placeholder='Do homework' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Description</FormLabel>
                            <FormControl>
                                <Input placeholder='Do homework' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='start'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                {/* @ts-ignore */}
                                <DateTimePicker granularity='minute' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='end'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                {/* @ts-ignore */}
                                <DateTimePicker granularity='minute' {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='providers'
                    render={() => (
                        <>
                            <div className='mb-4'>
                                <FormLabel className='text-base'>Providers</FormLabel>
                                <FormDescription>
                                    Select the providers you want to add the event to
                                </FormDescription>
                            </div>
                            {providers.map((item) => (
                                <FormField
                                    key={item.id}
                                    disabled={true}
                                    control={form.control}
                                    name='providers'
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className='flex flex-row items-start space-x-3 space-y-0'>
                                                <FormControl>
                                                    <Checkbox
                                                        disabled={item.disabled}
                                                        checked={field.value?.includes(
                                                            item.id
                                                        )}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field?.onChange([
                                                                      ...field?.value,
                                                                      item.id
                                                                  ])
                                                                : field?.onChange(
                                                                      field?.value?.filter(
                                                                          (value) =>
                                                                              value !==
                                                                              item.id
                                                                      )
                                                                  )
                                                        }}
                                                    />
                                                </FormControl>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <FormLabel className='font-normal'>
                                                                {item.label}
                                                            </FormLabel>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            {item.disabled ? (
                                                                <span className='text-gray-500'>
                                                                    You need to sign in to{' '}
                                                                    {item.label} to use
                                                                    this provider{' '}
                                                                </span>
                                                            ) : null}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </>
                    )}
                />

                <div className='flex items-center gap-x-4'>
                    <Button className='flex-1' type='submit'>
                        Edit event
                    </Button>

                    <RemoveEventModal event={event} />
                </div>
            </form>
            <div>
                <TooltipProvider>
                    <div className='flex items-center gap-x-4'>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    disabled={!event.originLinks?.outlook}
                                    size='icon'>
                                    <Link
                                        to={event.originLinks?.outlook!}
                                        target='_blank'>
                                        <img
                                            className='h-4 w-4'
                                            src={outlookIcon}
                                            alt='Outlook'
                                        />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {!event.originLinks?.outlook
                                        ? 'This event was not created in Outlook'
                                        : 'View the event in Outlook'}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button disabled={!event.originLinks?.google} size='icon'>
                                    <Link to={event.originLinks?.google!} target='_blank'>
                                        <img
                                            className=' h-6 w-6'
                                            src={googleIcon}
                                            alt='Google'
                                        />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {!event.originLinks?.google
                                        ? 'This event was not created in Google Calendar'
                                        : 'View the event in Google Calendar'}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            </div>
        </Form>
    )
}
