import {
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Center,
  Flex,
  HStack,
} from "@chakra-ui/react";

const CourseOutcomesMapping = ({ courseOutcomes }) => {
  const renderOutcomeRows = courseOutcomes.map((outcome, idx) => {
    return (
      <Tr key={idx}>
        <Td>
          {outcome.outcomeName}. {outcome.outcomeDescription}
        </Td>
        <Td>
          <Flex direction="row">
            {outcome.IT && (
              <HStack w="50%">
                <Text>IT: </Text>
                <NumberInput
                  disabled
                  defaultValue={outcome.IT}
                  min={0}
                  w="50%"
                  onChange={(e) => {
                    const newNumber = parseInt(e);
                    handleOutcomesChange("IT", outcome.outcomeName, newNumber);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            )}

            {outcome.CS && (
              <HStack w="50%">
                <Text>CS: </Text>
                <NumberInput
                  disabled
                  defaultValue={outcome.CS}
                  min={0}
                  w="50%"
                  onChange={(e) => {
                    const newNumber = parseInt(e);
                    handleOutcomesChange("CS", outcome.outcomeName, newNumber);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            )}
            {outcome.CE && (
              <HStack w="50%">
                <Text>CE: </Text>
                <NumberInput
                  disabled
                  defaultValue={outcome.CE}
                  min={0}
                  w="50%"
                  onChange={(e) => {
                    const newNumber = parseInt(e);
                    handleOutcomesChange("CE", outcome.outcomeName, newNumber);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            )}
            {outcome.CYS && (
              <HStack w="50%">
                <Text>CYS: </Text>
                <NumberInput
                  disabled
                  defaultValue={outcome.CYS}
                  min={0}
                  w="50%"
                  onChange={(e) => {
                    const newNumber = parseInt(e);
                    handleOutcomesChange("CYS", outcome.outcomeName, newNumber);
                  }}
                >
                  <NumberInputField />
                </NumberInput>
              </HStack>
            )}
          </Flex>
        </Td>
      </Tr>
    );
  });

  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Course Outcomes Mapping
      </Text>
      <Center mt="1em" mb="2em" padding="1em" bg="#edf2f7" borderRadius="4px">
        <Table padding="1em" bg="white">
          <Thead>
            <Tr>
              <Th>Course Outcomes</Th>
              <Th>Student Work Used</Th>
              <Th>Number of Students Who Achieved 75% of this Outcome</Th>
            </Tr>
          </Thead>
          <Tbody>{renderOutcomeRows}</Tbody>
        </Table>
      </Center>
    </>
  );
};

export default CourseOutcomesMapping;
