import { Flex, Badge, Spinner, Text } from "@radix-ui/themes";
import React from "react";
import Image from "next/image";
import logo from "@/public/images/pipeHubb_logo_transparent.png";

const LoadingBadge = () => {
  return (
    <Flex justify={"center"}>
      <Badge size={"3"} color="ruby">
        <Image src={logo} alt="Pipehubb logo" width={25} height={25}></Image>
        <Text size="6">Loading...</Text>
        <Spinner size={"3"} />
      </Badge>
    </Flex>
  );
};

export default LoadingBadge;
