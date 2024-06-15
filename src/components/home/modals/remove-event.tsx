import { Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { UserAuth } from '@/providers/auth-context'
import { useRemoveGoogleEventMutation } from '@/store/api/google'
import { useRemoveOutlookEventMutation } from '@/store/api/outlook'
import type { EventItem } from '@/types/google-events'

interface RemoveEventModalProps {
    event: EventItem
}

export const RemoveEventModal: React.FC<RemoveEventModalProps> = ({ event }) => {
    const [removeGoogleEvent] = useRemoveGoogleEventMutation()
    const [removeOutlookEvent] = useRemoveOutlookEventMutation()

    const { user } = UserAuth()!

    const handleRemoveGoogleEvent = async () => {
        try {
            await removeGoogleEvent({
                eventId: event.googleEventId!,
                calendarId: user?.email!
            })
                .unwrap()
                .then(() => {
                    toast.success('Event deleted successfully')
                })
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemoveOutlookEvent = async () => {
        try {
            await removeOutlookEvent(event.outlookEventId!)
                .unwrap()
                .then(() => {
                    toast.success('Event deleted successfully')
                })
        } catch (error) {
            console.error(error)
        }
    }

    const handleRemove = () => {
        if (event.originLinks.google) {
            handleRemoveGoogleEvent()
        }

        if (event.originLinks.outlook) {
            handleRemoveOutlookEvent()
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type='button'
                    size='icon'
                    variant='destructive'
                    className='flex-1'>
                    <Trash2 className='w-4 h-4 mr-2' /> Delete event
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure u want to delete this event?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant='destructive'
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemove()
                            }}>
                            Delete event
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
