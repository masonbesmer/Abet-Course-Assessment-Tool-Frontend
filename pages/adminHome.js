import { useState } from "react";
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  VStack,
  HStack,
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  TableCaption,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import { useRouter } from "next/router";
import Head from "next/head";
import AdminNavigation from "../components/admin-components/AdminNavigation";
import AdminMenu from "../components/admin-components/AdminMenu";
// import FullReport from '../components/admin-components/FullReport/FullReport';
import EditSemesterList from "../components/admin-components/EditSemesters/EditSemesterList";
import EditFacultyList from "../components/admin-components/EditFacultyList/EditFacultyList";
import EditCourseList from "../components/admin-components/EditCourseList/EditCourseList";
import GenerateSectionReport from "../components/admin-components/GenerateSectionReport/GenerateSectionReport";
import GenerateFullReport from "../components/admin-components/GenerateFullReport/GenerateFullReport";
import GenerateStudentSurveys from "../components/admin-components/GenerateStudentSurveys/GenerateStudentSurveys";
import EditAssignedCourses from "../components/admin-components/EditAssignedCourses/EditAssignedCourses";
import CreateNewMajor from "../components/admin-components/EditDepartments/CreateNewMajor";
import LinkedCourseOutcomeToMajorOutcomes from "../components/admin-components/LinkedCourseOutcomeToMajorOutcomes/LinkedCourseOutcomeToMajorOutcomes";
import AddNewCourseOutcome from "../components/admin-components/CourseOutcome/AddNewCourseOutcome";
import AddNewMajorOutcome from "../components/admin-components/MajorsOutcomes/AddNewMajorOutcome/AddNewMajorOutcome";
import AssignOutcomeToCourse from "../components/admin-components/MajorsOutcomes/OldAssignOutcomeToCourse/AssignOutcomeToCourse";
import EditSurveyQuestions from "../components/admin-components/Student-Survey/EditSurveyQuestions";
var role = "super";
var is_super = true;
if (role == "super") {
  is_super = false;
}

const adminHome = () => {
  const [user, setUser] = useState("MT2020");
  const [view, setView] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>UNT ABET: Admin Page</title>
      </Head>
      <AdminNavigation />
      <div>
        <div>
          <Flex justifyContent="left" mt="1em" mr="1em">
            <HStack spacing="10px" w={{ base: "120%", md: "80%" }}>
              <IconButton
                bg="#016a31"
                color="white"
                onClick={onOpen}
                ml="1em"
                _hover={{
                  background: "teal",
                  color: "white",
                }}
                icon={<HamburgerIcon />}
              />
            </HStack>
          </Flex>
          <Drawer
            placement="left"
            onClose={onClose}
            isOpen={isOpen}
            w="33%"
            closeOnOverlayClick="true"
            closeOnEsc="true"
            colorScheme="green"
            preserveScrollBarGap="true"
          >
            <DrawerOverlay>
              <DrawerContent>
                <DrawerHeader
                  borderBottomWidth="1px"
                  textAlign="center"
                  fontSize="1.5em"
                >
                  Admin Menu
                </DrawerHeader>
                <DrawerBody onClick={onClose}>
                  <AdminMenu setView={setView} />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
          <Flex justifyContent="center">
            <VStack
              paddingTop="15"
              paddingLeft="30"
              w={{ base: "120%", md: "80%" }}
            >
              <Box borderWidth="2px" borderRadius="lg" padding="5">
                <Table variant="simple" size="md" width="max">
                  <TableCaption
                    color="black"
                    placement="top"
                    fontWeight="bold"
                    fontSize="2.2em"
                  >
                    Admin Home
                  </TableCaption>
                  <Tbody>
                    <Tr>
                      <Td
                        as="button"
                        mr="12"
                        color="#016a31"
                        onClick={() => {
                          setView("EFL");
                        }}
                      >
                        Edit Faculty List
                      </Td>
                      <Td
                        as="button"
                        mr="3"
                        ml="3"
                        color="#016a31"
                        onClick={() => {
                          setView("CNM");
                        }}
                      >
                        Edit Major List
                      </Td>
                    </Tr>
                    <Tr>
                      {" "}
                      <Td
                        as="button"
                        mr="12"
                        color="#016a31"
                        onClick={() => {
                          setView("CNS");
                        }}
                      >
                        Edit Semesters
                      </Td>
                      <Td
                        as="button"
                        ml="4"
                        color="#016a31"
                        onClick={() => {
                          setView("GSS");
                        }}
                      >
                        Generate Student Surveys
                      </Td>
                    </Tr>
                    <Tr>
                      <Td
                        as="button"
                        mr="12"
                        color="#016a31"
                        onClick={() => {
                          setView("ECL");
                        }}
                      >
                        Edit Course List
                      </Td>
                      <Td
                        as="button"
                        ml="2.5"
                        color="#016a31"
                        onClick={() => {
                          setView("GSR");
                        }}
                      >
                        Generate Section Report
                      </Td>
                    </Tr>
                    <Tr>
                      <Td
                        as="button"
                        mr="3"
                        color="#016a31"
                        onClick={() => {
                          setView("EAC");
                        }}
                      >
                        Edit Course Section
                      </Td>
                      <Td
                        as="button"
                        ml="5"
                        color="#016a31"
                        onClick={() => {
                          setView("LCOTMO");
                        }}
                      >
                        Link Outcome Mapping
                      </Td>
                    </Tr>
                    <Tr>
                      <Td
                        as="button"
                        mr="3"
                        color="#016a31"
                        onClick={() => {
                          setView("ANCO");
                        }}
                      >
                        Edit Course Outcome
                      </Td>
                      <Td
                        as="button"
                        ml="2"
                        color="#016a31"
                        onClick={() => {
                          setView("GFR");
                        }}
                      >
                        Generate Full Report
                      </Td>
                    </Tr>
                    <Tr>
                      <Td
                        as="button"
                        mr="3"
                        color="#016a31"
                        onClick={() => {
                          setView("ANMO");
                        }}
                      >
                        Add Major Outcome
                      </Td>
                      <Td
                        as="button"
                        ml="4"
                        color="#016a31"
                        onClick={() => {
                          setView("ESQ");
                        }}
                      >
                        Edit Survey Questions
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </Flex>
        </div>
        <div>
          {(() => {
            switch (view) {
              default:
                return null;
              case "GFR":
                return <GenerateFullReport />;
              case "GSR":
                return <GenerateSectionReport user={user} />;
              case "OM":
                return <OutcomeMapping />;
              case "CNS":
                return <EditSemesterList />;
              case "CNM":
                return <CreateNewMajor />;
              case "EAC":
                return <EditAssignedCourses />;
              case "EFL":
                return <EditFacultyList />;
              case "ECL":
                return <EditCourseList />;
              case "GSS":
                return <GenerateStudentSurveys />;
              case "LCOTMO":
                return <LinkedCourseOutcomeToMajorOutcomes />;
              case "ANMO":
                return <AddNewMajorOutcome />;
              case "ANCO":
                return <AddNewCourseOutcome />;
              case "AOTC":
                return <AssignOutcomeToCourse />;
              case "ESQ":
                return <EditSurveyQuestions />;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default adminHome;
