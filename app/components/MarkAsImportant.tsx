import { Flex, Checkbox, Text } from "@radix-ui/themes";
import React, { Dispatch, SetStateAction } from "react";
import ImportantBadge from "./ImportantBadge";

//state is maintained in a higher level component, passed down as props to this component
//you can use the importantInput state in other components by passing it down from the parent component
//Dispatch<SetStateAction<boolean>> is the type of the setter function returned by useState<boolean>

const MarkAsImportant = ({
  importantInput,
  setImportantInput,
}: {
  importantInput: Boolean | undefined;
  setImportantInput: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Flex align="center" gap="2" asChild>
      <Text as="label" size="2">
        {/* Radix UI checkbox has additional possible value for checked - `indeterminate` so must handle that */}
        <Checkbox
          //use `checked` and not `defaultChecked`, or else the initial state of the checkbox will only be set on first render
          checked={importantInput ? true : false}
          onCheckedChange={(value) =>
            value !== "indeterminate" && setImportantInput(value)
          }
        />
        <Text>
          Mark as <ImportantBadge />
        </Text>
      </Text>
    </Flex>
  );
};

export default MarkAsImportant;
