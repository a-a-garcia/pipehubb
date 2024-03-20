import { z } from 'zod';

export const createLoanSchema = z.object({
    transactionType: z.string().min(1, "Transaction Type cannot be blank.").max(100).optional(),

    borrowerName: z.string().min(1, "Name must be at least 1 character.").max(255, "Name must be less than 255 characters."),
    
    loanAmount: z.number().min(1, "Loan amount must be at least $1.").optional(),
    
    borrowerEmail: z.string().email().min(1, "Email cannot be blank.").max(255, "Email must be less than 255 characters.").optional(),

    propertyAddress: z.string().max(255, "Property address must be less than 255 characters.").optional(),

    purchasePrice: z.number().min(1, "Purchase price must be at least $1.").optional(),

    creditScore: z.number().min(300, "Credit score must be at least 300.").max(850, "Credit score must be less than 850.").optional(),

    borrowerPhone: z.string().min(1, "Phone number cannot be blank.").max(20, "Phone number must be less than 20 characters.").optional(),

    referralSource: z.string().min(1, "Referral source cannot be blank.").max(255, "Referral source must be less than 255 characters.").optional(),
})

export const createActivityLogSchema = z.object({
    loanId: z.number().min(1, "Loan ID must be at least 1."),

    message: z.string().min(1, "Message cannot be blank.").max(255, "Message must be less than 255 characters.")
})