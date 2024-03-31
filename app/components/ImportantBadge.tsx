import { Badge } from "@radix-ui/themes";
import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";

const ImportantBadge = () => {
  return (
    <Badge color="red" variant="surface">
      <FaCircleExclamation color="red" size="10px" />
      Important
    </Badge>
  );
};

export default ImportantBadge;
