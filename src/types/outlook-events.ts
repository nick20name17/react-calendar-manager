export interface OutlookEventResponse {
    '@odata.context': string
    '@odata.etag': string
    id: string
    createdDateTime: string
    lastModifiedDateTime: string
    changeKey: string
    categories: any[]
    originalStartTimeZone: string
    originalEndTimeZone: string
    iCalUId: string
    reminderMinutesBeforeStart: number
    isReminderOn: boolean
    hasAttachments: boolean
    hideAttendees: boolean
    subject: string
    bodyPreview: string
    importance: string
    sensitivity: string
    isAllDay: boolean
    isCancelled: boolean
    isDraft: boolean
    isOrganizer: boolean
    responseRequested: boolean
    seriesMasterId: any
    transactionId: string
    showAs: string
    type: string
    webLink: string
    onlineMeetingUrl: any
    isOnlineMeeting: boolean
    onlineMeetingProvider: string
    onlineMeeting: any
    recurrence: any
    responseStatus: ResponseStatus
    body: Body
    start: Start
    end: End
    location: Location
    locations: Location2[]
    attendees: Attendee[]
    organizer: Organizer
}

export interface OutlookEventItemToAdd {
    subject: string
    body: Body
    start: Start
    end: End
    location?: {
        displayName: string
    }
    attendees?: Attendees[]
    transactionId?: string
}

export interface ResponseStatus {
    response: string
    time: string
}

export interface Body {
    contentType: string
    content: string
}

export interface Start {
    dateTime: string
    timeZone: string
}

export interface End {
    dateTime: string
    timeZone: string
}

export interface Location {
    displayName: string
    locationType: string
    uniqueId: string
    uniqueIdType: string
}

export interface Location2 {
    displayName: string
    locationType: string
    uniqueId: string
    uniqueIdType: string
}

export interface Attendee {
    type: string
    status: Status
    emailAddress: EmailAddress
}
export interface Attendees {
    emailAddress: EmailAddress
    type: string
}

export interface Status {
    response: string
    time: string
}

export interface EmailAddress {
    name: string
    address: string
}

export interface Organizer {
    emailAddress: EmailAddress2
}

export interface EmailAddress2 {
    name: string
    address: string
}
