import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  VStack,
  Button,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";
import NextLink from "next/link";

const FormsView = ({ instructorCourses, coordinatorCourses, term, year }) => {
  const token = cookieCutter.get("token");
  const json = jwt.decode(token);
  var roleArray = json.role;
  var role = "";
  if (roleArray.length > 1) {
    for (var i = 0; i < roleArray.length; i++) {
      if (roleArray[i] == "Instructor" || roleArray[i] == "Coordinator") {
        role = roleArray[i];
      }
    }
  }
  if (instructorCourses) {
    instructorCourses.sort((a, b) =>
      a.courseNumber + a.sectionNumber > b.courseNumber + b.sectionNumber
        ? 1
        : -1
    );
  }
  if (coordinatorCourses) {
    coordinatorCourses.sort((a, b) =>
      a.courseNumber + a.sectionNumber > b.courseNumber + b.sectionNumber
        ? 1
        : -1
    );
  }

  const handleClick = async (course, section) => {
    document.cookie = `course=${course}; path=/`;
    document.cookie = `section=${section}; path=/`;
  };

  const renderInstructorCourses =
    instructorCourses &&
    instructorCourses.map((course, idx) => {
      console.log(instructorCourses);
      return (
        <Tr key={idx}>
          <Td>{course.courseFriendlyName}</Td>
          <Td>
            {course.courseNumber}.{course.sectionNumber}
          </Td>
          <Td>
            <Button
              color="white"
              bg="#016a31"
              as="a"
              height="10"
              rounded="md"
              width="20"
              _hover={{
                background: "teal",
                color: "white",
              }}
              variant="link"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <NextLink
                href={{
                  pathname: "/formCompletion",
                  query: {
                    department: "CSCE",
                    number: course.courseNumber,
                    section: course.sectionNumber,
                    term: term,
                    year: year,
                  },
                }}
              >
                {course.isFormSubmitted ? "View" : "Start"}
              </NextLink>
            </Button>
          </Td>
          <Td>{course.isFormSubmitted ? "Yes" : "No"}</Td>
        </Tr>
      );
    });

  const renderCoordinatorCourses =
    coordinatorCourses &&
    coordinatorCourses.map((course, idx) => {
      console.log(course);
      return (
        <Tr key={idx}>
          <Td>{course.courseFriendlyName}</Td>
          <Td>
            {course.courseNumber}.{course.sectionNumber}
          </Td>
          <Td>
            <Button
              color="white"
              bg="#016a31"
              height="10"
              rounded="md"
              width="20"
              _hover={{
                background: "teal",
                color: "white",
              }}
              variant="link"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Link
                href={{
                  pathname: "/coordinatorForms",
                  query: {
                    department: "CSCE",
                    number: course.courseNumber,
                    section: course.sectionNumber,
                    term: term,
                    year: year,
                  },
                }}
              >
                Comment
              </Link>
            </Button>
          </Td>
          <Td>{course.isFormSubmitted ? "Yes" : "No"}</Td>
        </Tr>
      );
    });

  if (roleArray.includes("Instructor") && roleArray.includes("Coordinator")) {
    return (
      <VStack w="75%">
        <Box
          bg="#edf2f7"
          align="center"
          w={{ lg: "75%" }}
          margin="auto"
          padding="1em"
        >
          <Table variant="striped" colorScheme="green" padding="1em">
            <TableCaption placement="top" fontWeight="bold" fontSize="xl">
              Instructor Forms
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Code</Th>
                <Th>Form</Th>
                <Th>Completed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {instructorCourses?.length ? (
                renderInstructorCourses
              ) : (
                <div>No courses available!</div>
              )}
            </Tbody>
          </Table>
        </Box>
        {coordinatorCourses && (
          <Box
            bg="#edf2f7"
            align="center"
            w={{ lg: "75%" }}
            margin="auto"
            padding="1em"
          >
            <Table variant="striped" colorScheme="green" padding="1em">
              <TableCaption placement="top" fontWeight="bold" fontSize="xl">
                Coordinator Forms
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Code</Th>
                  <Th>Form</Th>
                  <Th>Completed</Th>
                </Tr>
              </Thead>
              <Tbody>
                {renderCoordinatorCourses?.length ? (
                  renderCoordinatorCourses
                ) : (
                  <div>No courses available!</div>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    );
  }
  if (roleArray.includes("Instructor")) {
    return (
      <VStack w="75%">
        <Box
          bg="#edf2f7"
          align="center"
          w={{ lg: "75%" }}
          margin="auto"
          padding="1em"
        >
          <Table variant="striped" colorScheme="green" padding="1em">
            <TableCaption placement="top" fontWeight="bold" fontSize="xl">
              Instructor Forms
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Code</Th>
                <Th>Form</Th>
                <Th>Completed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {instructorCourses?.length ? (
                renderInstructorCourses
              ) : (
                <div>No courses available!</div>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    );
  }

  if (roleArray.includes("Coordinator")) {
    return (
      <VStack w="75%">
        <Box
          bg="#edf2f7"
          align="center"
          w={{ lg: "75%" }}
          margin="auto"
          padding="1em"
        >
          <Table variant="striped" colorScheme="green" padding="1em">
            <TableCaption placement="top" fontWeight="bold" fontSize="xl">
              Coordinator Forms
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Code</Th>
                <Th>Form</Th>
                <Th>Completed</Th>
              </Tr>
            </Thead>
            <Tbody>
              {renderCoordinatorCourses?.length ? (
                renderCoordinatorCourses
              ) : (
                <div>No courses available!</div>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    );
  }
};

export default FormsView;
