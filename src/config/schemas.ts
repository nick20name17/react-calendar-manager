import { boolean, number, object, string } from 'zod'

const invalidTypeError = 'Invalid type provided for this field'
const requiredError = 'This field cannot be blank'

export const loginSchema = object({
    email: string({
        invalid_type_error: invalidTypeError,
        required_error: requiredError
    })
        .email('Please provide a valid email')
        .min(1, 'Email is reuqired'),
    password: string({
        invalid_type_error: invalidTypeError,
        required_error: requiredError
    }).min(1, 'Password is required')
})

export const registerSchema = object({
    email: string({
        invalid_type_error: invalidTypeError,
        required_error: requiredError
    })
        .email('Please provide a valid email')
        .min(1, 'Email is reuqired'),
    password: string({
        invalid_type_error: invalidTypeError,
        required_error: requiredError
    }).min(8, 'Password must be at least 8 characters long'),
    name: string({
        invalid_type_error: invalidTypeError,
        required_error: requiredError
    }).min(1, 'Name is required')
})

export const calendarSchema = object({
    day: number().int().min(1).max(31),
    era: string().optional(),
    hour: number().int().min(0).max(23),
    millisecond: number().int().min(0).max(999),
    minute: number().int().min(0).max(59),
    month: number().int().min(1).max(12),
    second: number().int().min(0).max(59),
    year: number().int().min(0)
})

export const eventSchema = object({
    summary: string(),
    description: string().optional(),
    start: calendarSchema,
    end: calendarSchema,
    isGoogleProvider: boolean().optional(),
    isOutlookProvider: boolean().optional()
    // providers: array(string()).refine((value) => value.some((item) => item), {
    //     message: 'You have to select at least one provider.'
    // })
})
