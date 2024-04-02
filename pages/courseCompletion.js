//imports
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";

import {
  Button,
  Text,
  Box,
  Flex,
  useToast,
  Center,
  Textarea,
} from "@chakra-ui/react";

//submitconfirmation
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";

//api
import {
  GetStudentOutcomesCompleted,
  SetStudentOutcomesCompleted,
  getSection,
  getSectionAssistant,
  getGrades,
  setGrades,
  editComments,
  editSection,
} from "../api/APIHelper";
//components
import GradesInput from "../components/form-components/GradesInput";
import CourseOutcomesMapping from "../components/form-components/CourseOutcomesMapping";
import blankForm from "../components/form-components/blankForm.json";
import CoordinatorGrades from "../components/form-components/CoordinatorGrades"; //used since it's shows the grades as only visible
import CoordinatorOutcomes from "../components/form-components/CoordinatorOutcomes"; //used since it shows the outcomes as only visible
import Navigation from "../components/instructor-components/Navigation";
import { dividerClasses } from "@mui/material";

const courseCompletion = ({ number, term, year, department }) => {
  const router = useRouter();
  const [gradeForm, setGradeForm] = useState();
  const [outcomeForm, setOutcomeForm] = useState();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [commentField, setCommentField] = useState(""); // instructor comments textarea-------create way to save
  const [fileInputField, setFileInputField] = useState(); //^^
  const [sectionList, setSectionList] = useState();
  const toast = useToast({ position: "top" });
  //------------------------------------
  const [instructorID, setInstructorID] = useState(0);
  const [isSectionCompleted, setIsSectionCompleted] = useState(false);
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  //--------------------------------------------
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
  };

  const checkUser = async () => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      const token = cookieCutter.get("token");
      const json = jwt.decode(token);
      if (!json) {
        router.push("/Login");
        return;
      }

      const jsonUserId = json.unique_name;
      if (json == null) {
        router.push("/");
      } else {
        if (json.role != "Admin") {
          toast({
            title: "Error",
            description: `User is not assigned to selected section!`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          router.push("/");
        } else if (json.role == "Admin") {
          setIsAdmin(true);
        }
      }
    }
  };

  const average = async () => {
    //   let grades = {
    //     CS: {
    //       a: 0,
    //       b: 0,
    //       c: 0,
    //       d: 0,
    //       f: 0,
    //       w: 0,
    //       i: 0,
    //       totalStudents: 0,
    //     },
    //     CE: {
    //       a: 0,
    //       b: 0,
    //       c: 0,
    //       d: 0,
    //       f: 0,
    //       w: 0,
    //       i: 0,
    //       totalStudents: 0,
    //     },
    //     CYS: {
    //       a: 0,
    //       b: 0,
    //       c: 0,
    //       d: 0,
    //       f: 0,
    //       w: 0,
    //       i: 0,
    //       totalStudents: 0,
    //     },
    //     IT: {
    //       a: 0,
    //       b: 0,
    //       c: 0,
    //       d: 0,
    //       f: 0,
    //       w: 0,
    //       i: 0,
    //       totalStudents: 0,
    //     },
    //   };
    //   let outcomes = [
    //     {},
    //   ];
    //   let outcomef = [
    //     [
    //       {},
    //     ],
    //   ];
    //   for (let i = 0; i < sectionList.length; ++i) {
    //     const section = sectionList[i].courseNumber;
    //     try {
    //       const res = await getGrades(year, term, department, number, section);
    //       grades += res.data;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //   grades = grades / sectionList.length;
    //   for (let i = 0; i < sectionList.length; i++) {
    //     const section = sectionList[i].courseNumber;
    //     try {
    //       const res = await GetStudentOutcomesCompleted(
    //         year,
    //         term,
    //         department,
    //         number,
    //         section
    //       );
    //       outcomes[i] = res.data;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //   console.log(outcomes);
    //   for ( let i = 0; i < sectionList.length; i++){
    //     outcomef[i].CS = outcomes[i.CS];
    //     outcomef[i].CS = outcomes[i.CE];
    //     outcomef[i].CYS = outcomes[i.CYS];
    //   }
  };

  const getCourseSections = async () => {
    try {
      const sectionlistRes = await getSectionsByCourse(
        term,
        year,
        department,
        number
      );
      const sectionListData = sectionlistRes.data;
      const status = sectionlistRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the course list! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      setSectionList(sectionListData);
      console.log(sectionListData);
    } catch (error) {
      console.log(error);
    }
    console.log(sectionList);
  };

  const getGradeForm = async () => {
    try {
      const res = await getGrades(year, term, department, number, section);
      const gradesData = res.data;
      if (gradesData) {
        if (Object.keys(gradesData).length < 1) {
          //If the is the first time working on the form then create a blank form
          await setGrades(year, term, department, number, section, blankForm);
          setGradeForm(blankForm);
        } else if (Object.keys(gradesData).length >= 1) {
          setGradeForm(gradesData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOutcomeForm = async () => {
    try {
      const outcomeFormRes = await GetStudentOutcomesCompleted(
        year,
        term,
        department,
        number,
        section
      );
      const outcomeFormData = outcomeFormRes.data;
      console.log(outcomeFormData);
      setOutcomeForm(outcomeFormData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    average();
  }, [outcomeForm, gradeForm]);

  useEffect(() => {
    getCourseSections();
    checkUser();
  }, [setSectionList, sectionList]);

  return (
    <div>
      <Navigation />
      <Center>
        {gradeForm && outcomeForm ? ( //create condition for form
          <>
            <Flex mt="2em" direction="column" w="90%">
              <Box w="80%">
                <Text fontSize="2xl" fontWeight="bold">
                  {department} {number}
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="green" mb="2em">
                  ABET Course Assesment
                </Text>
              </Box>

              <CoordinatorGrades
                csGrades={gradeForm.CS}
                ceGrades={gradeForm.CE}
                itGrades={gradeForm.IT}
                cysGrades={gradeForm.CYS}
              />
              <CoordinatorOutcomes courseOutcomes={outcomeForm} />
              {/** CREATE A WAY TO SAVE THE INSTRUCTORS COMMENTS */}
            </Flex>
          </>
        ) : (
          <Flex mt="2em" direction="column" w="90%">
            <Box w="80%">
              <Text fontSize="2xl" fontWeight="bold">
                {department} {number}
              </Text>

              {outcomeForm ? (
                <Text fontSize="2xl" fontWeight="bold" color="red" mb="2em">
                  Error: gradeForm data could not be retrieved. Contact your
                  admin for help!
                </Text>
              ) : gradeForm ? (
                <Text fontSize="2xl" fontWeight="bold" color="red" mb="2em">
                  No course outcome data could be retrieved for this course.
                  Contact your admin for help!
                </Text>
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color="red" mb="2em">
                  No course outcomes and grades were retrieved for this course.
                  Contact your admin for help!
                </Text>
              )}
            </Box>
          </Flex>
        )}
      </Center>
    </div>
  );
};
courseCompletion.getInitialProps = ({ query }) => {
  console.log(query);
  return {
    number: query.number,
    term: query.term,
    year: query.year,
    department: query.department,
  };
};
export default courseCompletion;
