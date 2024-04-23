import { format, parseISO } from "date-fns";


// Function to format date for display
// we must pass a boolean, adjustForTimezone, because for reasons currently unknown, the createdAt date is already in local timezone, but dueDate isn't. This may be by virtue of dueDate coming from a form input, but createdAt coming from the database. adjustForTimezone applies a timezone offset to the date to correct for this.
export const formatDateDisplay = (date: Date | string, adjustForTimezone: boolean = false) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const offset = dateObj.getTimezoneOffset();
    const localDate = adjustForTimezone ? new Date(dateObj.getTime() + offset * 60 * 1000) : dateObj;
    //only want to display the time if we're showing createdAt or updatedAt. Otherwise, we just want the date (for due date field)
    return !adjustForTimezone ? format(localDate, "MM/dd/yyyy, h:mm a") : format(localDate, "MM/dd/yyyy");
};

