'use client';
import LoanHeading from "@/app/components/LoanHeading";
import { Flex, Spinner, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { error } from "console";
import React, { use, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const ActivityLogPage = ({
    children,
    params,
}: Readonly<{ children: React.ReactNode, params: {id: string} }>) => {
    const [isLoading, setIsLoading] = useState(true);
    const { isFetched, error, data: loan } = useQuery({
        queryKey: ["loan", params.id],
        queryFn: () => fetch(`/api/loans/${params.id}`).then((res) => res.json()),
        staleTime: Infinity
    });

    useEffect(() => {
        if (isFetched) {
            setIsLoading(false);
        }
    })

    console.log(loan)
    
    
    return (
        <div>
            <LoanHeading loan={loan!} />
            {/* {isLoading ? (
                <div>
                    <Flex justify={"center"}>
                        <Text size="4">
                            Loading...
                            <Spinner />
                        </Text>
                    </Flex>
                    <Skeleton height={"3rem"} />
                </div>
            ) : (
                <LoanHeading loan={loan!} />
            )} */}
            <div>{children}</div>
        </div>
    );
};

export default ActivityLogPage;
