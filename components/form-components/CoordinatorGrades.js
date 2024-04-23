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
  Center,
  HStack,
} from "@chakra-ui/react";

const GradesInput = ({ ceGrades, csGrades, itGrades, cysGrades }) => {
  const renderCeGrades = Object.keys(ceGrades).map((entry) => {
    return entry !== "totalStudents" ? (
      <Center>
        <Text fontWeight="bold" textTransform="uppercase" mr="1em">
          {entry}
        </Text>
        <NumberInput
          disabled
          defaultValue={ceGrades[entry]}
          min={0}
          max={100}
          w="50%"
        >
          <NumberInputField />
        </NumberInput>
      </Center>
    ) : null;
  });
  const renderCsGrades = Object.keys(csGrades).map((entry) => {
    return entry !== "totalStudents" ? (
      <Center>
        <Text fontWeight="bold" textTransform="uppercase" mr="1em">
          {entry}
        </Text>
        <NumberInput
          disabled
          defaultValue={csGrades[entry]}
          min={0}
          max={100}
          w="50%"
        >
          <NumberInputField />
        </NumberInput>
      </Center>
    ) : null;
  });
  const renderITGrades = Object.keys(itGrades).map((entry) => {
    return entry !== "totalStudents" ? (
      <Center>
        <Text fontWeight="bold" textTransform="uppercase" mr="1em">
          {entry}
        </Text>
        <NumberInput
          disabled
          defaultValue={itGrades[entry]}
          min={0}
          max={100}
          w="50%"
        >
          <NumberInputField />
        </NumberInput>
      </Center>
    ) : null;
  });
  const renderCGrades = Object.keys(cysGrades).map((entry) => {
    return entry !== "totalStudents" ? (
      <Center>
        <Text fontWeight="bold" textTransform="uppercase" mr="1em">
          {entry}
        </Text>
        <NumberInput
          disabled
          defaultValue={cysGrades[entry]}
          min={0}
          max={100}
          w="50%"
        >
          <NumberInputField />
        </NumberInput>
      </Center>
    ) : null;
  });
  return (
    <>
      <Text fontSize="xl" fontWeight="bold">
        Grades
      </Text>
      <Center mt="1em" mb="1em" padding="1em" bg="#edf2f7" borderRadius="4px">
        <Table padding="1em" bg="white">
          <Thead>
            <Tr>
              <Th>Major</Th>
              <Th>Grades</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Text fontWeight="bold">IT</Text>
              </Td>
              <Td>
                <HStack>{renderITGrades}</HStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Text fontWeight="bold">CS</Text>
              </Td>
              <Td>
                <HStack>{renderCsGrades}</HStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Text fontWeight="bold">CE</Text>
              </Td>
              <Td>
                <HStack>{renderCeGrades}</HStack>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Text fontWeight="bold">CYS</Text>
              </Td>
              <Td>
                <HStack>{renderCGrades}</HStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Center>
    </>
  );
};

export default GradesInput;
