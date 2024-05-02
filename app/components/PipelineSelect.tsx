import { User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React from "react";


const PipelineSelect = () => {
  const { status, data: session } = useSession();
  const {
    data,
    isPending,
    error
  } = useQuery({
    queryKey: ["allPipelines", { userId : session?.user.id}],
    queryFn: () => fetch(`/api/pipelines/${session?.user.id}`).then((res) => res.json())
  })

  return (
    <Select.Root defaultValue="apple">
      <Select.Trigger />
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="orange">Orange</Select.Item>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="grape" disabled>
            Grape
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default PipelineSelect;
