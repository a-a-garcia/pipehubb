import React, { PropsWithChildren } from 'react'
import { Callout, Flex, Text } from '@radix-ui/themes'
import { FaCircleExclamation } from 'react-icons/fa6'

const ErrorMessage = ( {children} : PropsWithChildren) => {
    if (!children) {
        return null
    } return (
        <Callout.Root color="red" className='mt-4'>
        <Callout.Text>
          <Flex align={"center"} gap="2">
            <FaCircleExclamation color="red" size="15px" />
            <Text>Error: {children}</Text>
          </Flex>
        </Callout.Text>
      </Callout.Root>
    )
}

export default ErrorMessage