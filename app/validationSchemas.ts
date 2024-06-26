import { count } from 'console';
import { z } from 'zod';

export const createLoanSchema = z.object({
    transactionType: z.string().min(1, "Transaction Type cannot be blank.").max(100).optional(),

    borrowerName: z.string().min(1, "Name must be at least 1 character.").max(255, "Name must be less than 255 characters.").refine(value => value.trim().length > 0, { message: "Name cannot be blank."}),

    loanTeamId: z.string().min(1, "You must select a loan team to assign this loan to."),
    
    loanAmount: z.number().min(1, "Loan amount must be at least $1.").optional(),
    
    borrowerEmail: z.string().email().max(255, "Email must be less than 255 characters.").optional(),

    propertyAddress: z.string().max(255, "Property address cannot exceed 255 characters").refine(value => value === undefined || value.trim().length > 0, {
        message: "Property address cannot be only spaces",
      }).optional(),

    purchasePrice: z.number().min(1, "Purchase price must be at least $1.").optional(),

    creditScore: z.number().min(300, "Credit score must be at least 300.").max(850, "Credit score must be less than 850.").optional(),

    borrowerPhone: z.string().max(20, "Phone number must be less than 20 characters.").optional(),

    referralSource: z.string().max(255, "Referral source must be less than 255 characters.").refine(value => value === undefined || value.trim().length > 0, {
        message: "Referral source cannot be only spaces",
      }).optional(),
})

export const editLoanSchema = z.object({
    transactionType: z.string().min(1, "Transaction Type cannot be blank.").max(100).optional(),

    borrowerName: z.string().min(1, "Name must be at least 1 character.").max(255, "Name must be less than 255 characters.").optional(),
    
    loanAmount: z.number().min(1, "Loan amount must be at least $1.").optional(),
    
    borrowerEmail: z.string().email().min(1, "Email cannot be blank.").max(255, "Email must be less than 255 characters.").optional(),

    propertyAddress: z.string().max(255, "Property address must be less than 255 characters.").optional(),

    purchasePrice: z.number().min(1, "Purchase price must be at least $1.").optional(),

    creditScore: z.number().min(300, "Credit score must be at least 300.").max(850, "Credit score must be less than 850.").optional(),

    borrowerPhone: z.string().min(1, "Phone number cannot be blank.").max(20, "Phone number must be less than 20 characters.").optional(),

    referralSource: z.string().min(1, "Referral source cannot be blank.").max(255, "Referral source must be less than 255 characters.").optional(),
})

export const createActivityLogSchema = z.object({
    loanId: z.string().min(1, "Loan ID must be at least 1."),

    message: z.string().min(1, "Message cannot be blank.").max(255, "Message must be less than 255 characters.")
})

export const createFileNoteSchema = z.object({
    loanId: z.string().min(1, "Loan ID must be at least 1."),

    note: z.string().min(1, "Note cannot be blank.").max(1000, "Message must be less than 1000 characters.")
})

export const createTaskUpdateSchema = z.object({
    taskId: z.number().min(1, "Task ID must be at least 1."),

    note: z.string().min(1, "Note cannot be blank.").max(1000, "Message must be less than 1000 characters.")
})

export const editDocumentChecklistStatusSchema = z.object({
    status: z.enum(["PENDING", "REQUESTED", "RECEIVED"])
})

export const editTaskStatusSchema = z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "NOT_STARTED"])
})

export const createUserSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character.").max(255, "Name must be less than 255 characters."),

    email: z.string().email().max(255, "Email must be less than 255 characters."),

    password: z.string().min(8, "Password must be at least 8 characters.").max(255, "Password must be less than 255 characters."),

    confirmPassword: z.string().min(8, "Password must be at least 8 characters.").max(255, "Password must be less than 255 characters."),

}).superRefine(({ password }, checkPwComplexity) => {
    const containsUppercase = /[A-Z]/.test(password);
    const containsLowercase = /[a-z]/.test(password);
    const containsNumber = /\d/.test(password);
    const containsSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!containsUppercase || !containsLowercase || !containsNumber || !containsSpecial) {
        checkPwComplexity.addIssue({
            code: "custom",
            message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
            path: ["password"]
        });
    }
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
})

export const loanTeamExistingUserSchema = z.object({
    existingUserEmail: z.string().email().max(255, "Email must be less than 255 characters.").optional()
})