export { default } from 'next-auth/middleware'

export const config = {
    matcher: [
        '/loans/pipeline',
        '/loans/new',
        '/loans/:id+',
        '/api'
    ]
}