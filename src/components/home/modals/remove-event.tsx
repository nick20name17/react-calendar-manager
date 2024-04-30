import { useSession } from '@supabase/auth-helpers-react'
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
import { useRemoveEventMutation } from '@/store/api/google'
import type { EventItem } from '@/types/google-events'

interface RemoveEventModalProps {
    event: EventItem
}

export const RemoveEventModal: React.FC<RemoveEventModalProps> = ({ event }) => {
    const [removeEvent] = useRemoveEventMutation()

    const session = useSession()

    const deleteEvent = async () => {
        try {
            await removeEvent({
                eventId: event.id,
                calendarId: session?.user?.email!
            })
                .unwrap()
                .then(() => {
                    toast.success('Event deleted successfully')
                })
        } catch (error) {
            console.error(error)
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
                                deleteEvent()
                            }}>
                            Delete event
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
