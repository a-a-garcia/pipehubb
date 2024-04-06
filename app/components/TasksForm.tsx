import { Dialog, Button, Card, Flex, TextField, Table, Badge, Text } from '@radix-ui/themes';
import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import { MdOutlineCreate, MdCancel } from 'react-icons/md';
import ImportantBadge from './ImportantBadge';
import MarkAsImportant from './MarkAsImportant';

const TasksForm = ({isEditMode} : {isEditMode: Boolean}) => {
    const [taskName, setTaskName] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [importantInput, setImportantInput] = useState(false)

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        {isEditMode ? (
          <Button className="myCustomButton hover:cursor-pointer" size="1">
            <FaEdit />
          </Button>
        ) : (
          <Button className="myCustomButton hover:cursor-pointer" size="1">
            Create Task <MdOutlineCreate />
          </Button>
        )}
      </Dialog.Trigger>

      <form>
        <Dialog.Content>
          <Dialog.Title>
            {isEditMode ? "Editing Checklist Item..." : "Create Task"}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {!isEditMode &&
              "Add a new task to the task list."}
          </Dialog.Description>
          <Card>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Document Name
                </Text>
                <TextField.Root>
                  <TextField.Input
                    placeholder="Enter task name"
                    onChange={(e) => setTaskName(e.target.value)}
                    value={taskName}
                  />
                </TextField.Root>
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Due Date (Optional)
                </Text>
                <TextField.Root>
                  <TextField.Input
                    type="date"
                    onChange={(e) => setDueDate(e.target.value)}
                    value={dueDate}
                  />
                </TextField.Root>
              </label>
              <label>
                <MarkAsImportant
                  importantInput={importantInput}
                  setImportantInput={setImportantInput}
                />
              </label>
            </Flex>
          </Card>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button
                variant="soft"
                color="gray"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button className='myCustomButton'>
                Submit
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </form>
    </Dialog.Root>
  )
}

export default TasksForm