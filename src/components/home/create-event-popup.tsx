import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDateTime } from '@internationalized/date'
import { addHours, format } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

import { DateTimePicker } from './datetime/datetime-picker'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormDescription,
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

export const CreateEventPopup: React.FC = () => {
    const [open, setOpen] = useState(false)

    const form = useForm<EventData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            start: new CalendarDateTime(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                new Date().getDate(),
                new Date().getHours(),
                new Date().getMinutes()
            ),
            providers: []
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
        } catch (error: any) {
            toast.error(error.data.error.message)
        }
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
        } catch (error: any) {
            toast.error(error.data.error.message)
        }
    }

    const getFormattedDate = (value: DateTimeValue, addHoursOffset = 0) => {
        const date = new Date(
            value.year,
            value.month - 1,
            value.day,
            value.hour,
            value.minute,
            value.second
        )
        return addHours(date, addHoursOffset).toISOString()
    }

    const onSubmit = async (data: EventData) => {
        const googleEvent = {
            summary: data.summary,
            description: data.description ?? '',
            start: {
                dateTime: getFormattedDate(data.start),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: getFormattedDate(data.end),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }

        const outlookEvent = {
            summary: data.summary,
            description: data.description,
            start: {
                dateTime: getFormattedDate(data.start, 3),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: getFormattedDate(data.end, 3),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        }

        if (data.providers.includes('google')) createGoogleEvent(googleEvent)
        if (data.providers.includes('outlook')) createOutlookEvent(outlookEvent)
    }

    const isGoogle = !localStorage.getItem('accessGoogleToken')
    const isOutlook = !localStorage.getItem('accessOutlookToken')

    const providers = [
        {
            id: 'google',
            label: 'Google',
            disabled: isGoogle
        },
        {
            id: 'outlook',
            label: 'Outlook',
            disabled: isOutlook
        }
    ] as const

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create new event</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create new event</DialogTitle>
                </DialogHeader>
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
                                        <FormLabel className='text-base'>
                                            Providers
                                        </FormLabel>
                                        <FormDescription>
                                            Select the providers you want to add the event
                                            to
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
                                                                disabled={item.disabled}
                                                                checked={field.value?.includes(
                                                                    item.id
                                                                )}
                                                                onCheckedChange={(
                                                                    checked
                                                                ) => {
                                                                    return checked
                                                                        ? field?.onChange(
                                                                              [
                                                                                  ...field?.value,
                                                                                  item.id
                                                                              ]
                                                                          )
                                                                        : field?.onChange(
                                                                              field?.value?.filter(
                                                                                  (
                                                                                      value
                                                                                  ) =>
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
                                                                            You need to
                                                                            sign in to{' '}
                                                                            {item.label}{' '}
                                                                            to use this
                                                                            provider{' '}
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

                        <Button type='submit'>Create event</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
