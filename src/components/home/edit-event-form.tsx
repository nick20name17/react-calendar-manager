import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDateTime } from '@internationalized/date'
import { useSession } from '@supabase/auth-helpers-react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

import { DateTimePicker } from './datetime/datetime-picker'
import { RemoveEventModal } from './modals/remove-event'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { calendarSchema, eventSchema } from '@/config/schemas'
import { usePatchEventMutation } from '@/store/api/google'
import type { EventItem, EventItemToAdd } from '@/types/google-events'

export type EventData = z.infer<typeof eventSchema>
type DateTimeValue = z.infer<typeof calendarSchema>

interface EventFormProps extends EventItem {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const EditEventForm: React.FC<EventFormProps> = ({ setOpen, ...event }) => {
    const session = useSession()

    const { start, title, end, description, id } = event

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
            summary: title,
            description: description
        }
    })

    const [addEvent] = usePatchEventMutation()

    const createEvent = async (event: EventItemToAdd) => {
        try {
            await addEvent({
                eventId: id,
                calendarId: session?.user?.email!,
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

        createEvent(event)
    }

    // const providers = [
    //     {
    //         id: 'google',
    //         label: 'Google'
    //     },
    //     {
    //         id: 'apple',
    //         label: 'Apple'
    //     },
    //     {
    //         id: 'microsoft',
    //         label: 'Microsoft'
    //     }
    // ] as const

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
                                <Input placeholder='shave teeth' {...field} />
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
                                <Input placeholder='shave teeth' {...field} />
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

                {/* <FormField
                    control={form.control}
                    name='providers'
                    render={() => (
                        <FormItem>
                            <div className='mb-4'>
                                <FormLabel className='text-base'>Providers</FormLabel>
                                <FormDescription>
                                    Select the providers you want to add the event to
                                </FormDescription>
                            </div>
                            {providers.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name='providers'
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className='flex flex-row items-start space-x-3 space-y-0'>
                                                <FormControl>
                                                    <Checkbox
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
                                                <FormLabel className='font-normal'>
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                <div className='flex items-center gap-x-4'>
                    <Button className='flex-1' type='submit'>
                        Edit event
                    </Button>

                    <RemoveEventModal event={event} />
                </div>
            </form>
        </Form>
    )
}
