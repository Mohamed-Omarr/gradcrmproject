import { ZodError, ZodIssue } from 'zod'

const formatZodIssue = (issue: ZodIssue): string => {
    const { path, message } = issue
    const pathString = path.join('.') // Convert path array to a dot-separated string

    return `${pathString}: ${message}` // Return formatted string
}

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError): string => {
    const { issues } = error

    if (issues.length > 0) {
        const currentIssue = issues[0]
        return formatZodIssue(currentIssue)
    }

    return 'No issues found in validation.' // Handle the case when there are no issues
}
