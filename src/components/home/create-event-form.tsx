import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDateTime } from '@internationalized/date'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'

import { DateTimePicker } from './datetime/datetime-picker'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { calendarSchema, eventSchema } from '@/config/schemas'
import { useAddGoogleEventMutation } from '@/store/api/google'
import { useAddOutlookEventMutation } from '@/store/api/outlook'
import type { EventItemToAdd } from '@/types/google-events'

export type EventData = z.infer<typeof eventSchema>
type DateTimeValue = z.infer<typeof calendarSchema>

interface EventFormProps {
    date: Date
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export const CreateEventForm: React.FC<EventFormProps> = ({ date, setOpen }) => {
    const form = useForm<EventData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            start: new CalendarDateTime(
                date.getFullYear(),
                date.getMonth() + 1,
                date.getDate(),
                new Date().getHours(),
                new Date().getMinutes()
            )
        }
    })

    const [addOutlookEvent] = useAddOutlookEventMutation()
    const [addGoogleEvent] = useAddGoogleEventMutation()

    const createOutlookEvent = async (event: EventItemToAdd) => {
        const eventToAdd = {
            subject: event.summary,
            body: {
                contentType: 'HTML',
                content: event.description || ''
            },
            start: {
                dateTime: event.start.dateTime,
                timeZone: event.start.timeZone
            },
            end: {
                dateTime: event.end.dateTime,
                timeZone: event.end.timeZone
            }
        }

        try {
            await addOutlookEvent(eventToAdd)
                .unwrap()
                .then((data) => {
                    setOpen(false)
                    toast.success(
                        `Event ${data.subject} in Outlook created successfully`,
                        {
                            description: `Event starts at ${format(data.start.dateTime, 'dd.MM.yyyy HH:mm')}, ends at ${format(data.end.dateTime, 'dd.MM.yyyy HH:mm')}`
                        }
                    )
                })
        } catch (error) {}
    }

    const createGoogleEvent = async (event: EventItemToAdd) => {
        try {
            await addGoogleEvent(event)
                .unwrap()
                .then((data) => {
                    setOpen(false)
                    toast.success(
                        `Event ${data.summary} in Google Calendar created successfully`,
                        {
                            description: `Event starts at ${format(data.start.dateTime, 'dd.MM.yyyy HH:mm')}, ends at ${format(data.end.dateTime, 'dd.MM.yyyy HH:mm')}`
                        }
                    )
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

        if (data.isGoogleProvider) createGoogleEvent(event)

        if (data.isOutlookProvider) createOutlookEvent(event)
    }

    const providers = [
        {
            id: 'google',
            label: 'Google'
        },
        {
            id: 'microsoft',
            label: 'Microsoft'
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

                <FormField
                    control={form.control}
                    name='isGoogleProvider'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>Add to google calendar</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='isOutlookProvider'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel>Add to my outlook calendar</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />

                {/* <FormField
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
                        </>
                    )}
                /> */}

                <Button type='submit'>Set event</Button>
            </form>
        </Form>
    )
}
