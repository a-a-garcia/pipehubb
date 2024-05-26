import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

//Note, for all API endpoints, the request object is passed as the first argument, and the response object is passed as the second argument. The request object contains information about the incoming request, such as the request body, headers, and query parameters. The response object is used to send a response back to the client. The response object can be used to send a JSON response, set response headers, and set the status code of the response.

//Even if the request object is not used in the function, it should still be included in the function signature to maintain consistency with the Next.js API route structure. You'll get errors if you omit the request object from the function signature. 

//Also, you cannot just include the response object in the function signature without the request object. 

//Also, you cannot put the response object before the request object in the function signature. It must always be request, response, and then any other arguments (params for example).

export async function GET(request: NextRequest, {params} : {params: {id: string}}) {
    try {
        const user = await prisma.user.findUnique({
            where: {id: params.id}
        })
        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        const userTeams = await prisma.loanTeamMember.findMany({
            where: {userId: user.id}
        })


        if (userTeams.length === 0) {
            return NextResponse.json([user,{message: "userTeams=0"}], {status: 404})
        }

        return NextResponse.json([user, {message: "userTeams>=1"}], {status: 200})
    }
    catch {
        return NextResponse.json({message: "An error occurred"}, {status: 500})
    }
}

interface RequestsData {
    requesteeId: string;
    requestorId: string;
    loanTeamId: bigint;
}

export async function PUT(request: NextRequest, response: NextResponse) {
    const body = await request.json();

    const newUser = await prisma.user.findUnique({
        where: {id: body.id}
    })

    if (!newUser) {
        return NextResponse.json({error: "User not found."}, {status: 404})
    }

    if (body.existingUserEmail) {
        if (body.existingUserEmail === newUser?.email) {
            return NextResponse.json({error: "Existing user email and new user email can't be the same. If you want to create a new team, continue without providing an existing user email."}, {status: 400})
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { email: body?.existingUserEmail }
        })

        if (!existingUser) {
            return NextResponse.json({error: "Couldn't find a user with that email."}, {status: 400})
        }

        const existingUsersLoanTeamMemberships = await prisma.loanTeamMember.findMany({
            where: {userId: existingUser.id}
        })

        if (!existingUsersLoanTeamMemberships) {
            return NextResponse.json({error: "Existing user is not a member of any loan teams. Existing user should be a member of at least one team."}, {status: 400})
        }

        const requestsData: RequestsData[] = []

        await Promise.all(existingUsersLoanTeamMemberships.map(async (membership) => {
            const userAlreadyInTeam = await prisma.loanTeamMember.findFirst({
                where: {
                    userId: newUser.id,
                    loanTeamId: membership.loanTeamId
                }
            })

            if (!userAlreadyInTeam) {
                requestsData.push({
                    requesteeId: existingUser.id,
                    requestorId: body.id,
                    loanTeamId: membership.loanTeamId,
                })
            }
        }))

        const existingRequest = await prisma.loanTeamRequest.findFirst({
            where: {
                requestorId: newUser.id,
                requesteeId: existingUser.id
              }
          })

        if (existingRequest) {
            await prisma.loanTeamRequest.update({
                where: {id: existingRequest.id},
                data: {status: "PENDING"}
            })
        } else await prisma.loanTeamRequest.createMany({
            data: requestsData
        })

    } else {
        const newLoanTeam = await prisma.loanTeam.create({
            data: {
                teamName: body.teamName
            }
        })
        await prisma.loanTeamMember.create({
            data: {
                userId: body.id,
                loanTeamId: newLoanTeam.id
            }
        })
    }

    if (newUser.firstTimeLogin === true) {
        await prisma.user.update({
            where: {id: newUser.id},
            data: {
                firstTimeLogin: false
            }
        })
    }

    return NextResponse.json(newUser, {status: 200})
}

