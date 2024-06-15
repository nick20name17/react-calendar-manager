export interface EventResponse {
    kind: string
    etag: string
    summary: string
    description: string
    updated: string
    timeZone: string
    accessRole: string
    defaultReminders: DefaultReminder[]
    nextSyncToken: string
    items: Item[]
}

export interface DefaultReminder {
    method: string
    minutes: number
}

export interface EventItem {
    googleEventId?: string
    outlookEventId?: string
    title: string
    start: string
    end: string
    description?: string
    originLinks: {
        outlook?: string
        google?: string
        apple?: string
    }
}

export interface EventItemToAdd {
    summary: string
    description?: string
    start: {
        dateTime: string
        timeZone: string
    }
    end: {
        dateTime: string
        timeZone: string
    }
}
export interface EventItemToPatch extends EventDataToRemove {
    summary: string
    description?: string
    start: {
        dateTime: string
        timeZone: string
    }
    end: {
        dateTime: string
        timeZone: string
    }
}

export interface EventDataToRemove {
    calendarId: string
    eventId: string
}

export interface Item {
    kind: string
    etag: string
    id: string
    status: string
    htmlLink: string
    created: string
    updated: string
    summary: string
    creator: Creator
    organizer: Organizer
    start: Start
    end: End
    iCalUID: string
    sequence: number
    guestsCanModify?: boolean
    reminders: Reminders
    eventType: string
    colorId?: string
    recurrence?: string[]
    description?: string
}

export interface Creator {
    email: string
    self: boolean
}

export interface Organizer {
    email: string
    self: boolean
}

export interface Start {
    dateTime: string
    timeZone: string
}

export interface End {
    dateTime: string
    timeZone: string
}

export interface Reminders {
    useDefault: boolean
    overrides?: Override[]
}

export interface Override {
    method: string
    minutes: number
}

export interface SingleEventResponse {
    kind: string
    etag: string
    id: string
    status: string
    htmlLink: string
    created: string
    updated: string
    summary: string
    description: string
    creator: Creator
    organizer: Organizer
    start: Start
    end: End
    iCalUID: string
    sequence: number
    reminders: Reminders
    eventType: string
}
