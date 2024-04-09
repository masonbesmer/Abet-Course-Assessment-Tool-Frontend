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
  getGradesByCourse,
  GetCourseStudentOutcomesCompleted,
  getNumberOfSectionsInCourse,
  GetStudentOutcomesCompleted,
  SetStudentOutcomesCompleted,
  getSection,
  getSectionsByCourse,
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
  const [totalStudents, setTotalStudents] = useState();
  const [secNum, setSecNum] = useState();
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const toast = useToast({ position: "top" });
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

  const getGradeByCourse = async () => {
    try {
      const gradesRes = await getGradesByCourse(year, term, department, number);
      const status = gradesRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the data! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      const grades = gradesRes.data;
      console.log(grades);
      let avg = grades;
      let totStud = { //total number of students in this course seperated by major
        CS: 0,
        CE: 0,
        CYS: 0,
        IT: 0,
      };
      let temp = {};
      Object.entries(avg).forEach((key) => {
        if (key[0] == "CS") {
          Object.entries(avg.CS).forEach(([key, value]) => {
            if (key != "totalStudents") {
              temp = (value / avg.CS.totalStudents) * 100;
              if (key == "a") avg.CS.a = temp.toFixed(2);
              if (key == "b") avg.CS.b = temp.toFixed(2);
              if (key == "c") avg.CS.c = temp.toFixed(2);
              if (key == "d") avg.CS.d = temp.toFixed(2);
              if (key == "f") avg.CS.f = temp.toFixed(2);
              if (key == "w") avg.CS.w = temp.toFixed(2);
              if (key == "i") avg.CS.i = temp.toFixed(2);
            }
            if (key == "totalStudents") {
              totStud.CS = avg.CS.totalStudents;
              console.log(avg.CS.totalStudents);
            }
          });
        }
        if (key[0] == "CE") {
          temp = key[0];
          Object.entries(avg.CE).forEach(([key, value]) => {
            if (key != "totalStudents") {
              temp = (value / avg.CE.totalStudents) * 100;
              if (key == "a") avg.CE.a = temp.toFixed(2);
              if (key == "b") avg.CE.b = temp.toFixed(2);
              if (key == "c") avg.CE.c = temp.toFixed(2);
              if (key == "d") avg.CE.d = temp.toFixed(2);
              if (key == "f") avg.CE.f = temp.toFixed(2);
              if (key == "w") avg.CE.w = temp.toFixed(2);
              if (key == "i") avg.CE.i = temp.toFixed(2);
            }
            if (key == "totalStudents") totStud.CE = avg.CE.totalStudents;
          });
        }
        if (key[0] == "CYS") {
          temp = key[0];
          Object.entries(avg.CYS).forEach(([key, value]) => {
            if (key != "totalStudents") {
              temp = (value / avg.CYS.totalStudents) * 100;
              if (key == "a") avg.CYS.a = temp.toFixed(2);
              if (key == "b") avg.CYS.b = temp.toFixed(2);
              if (key == "c") avg.CYS.c = temp.toFixed(2);
              if (key == "d") avg.CYS.d = temp.toFixed(2);
              if (key == "f") avg.CYS.f = temp.toFixed(2);
              if (key == "w") avg.CYS.w = temp.toFixed(2);
              if (key == "i") avg.CYS.i = temp.toFixed(2);
            }
            if (key == "totalStudents") totStud.CYS = avg.CYS.totalStudents;
          });
        }
        if (key[0] == "IT") {
          temp = key[0];
          Object.entries(avg.IT).forEach(([key, value]) => {
            if (key != "totalStudents") {
              temp = (value / avg.IT.totalStudents) * 100;
              if (key == "a") avg.IT.a = temp.toFixed(2);
              if (key == "b") avg.IT.b = temp.toFixed(2);
              if (key == "c") avg.IT.c = temp.toFixed(2);
              if (key == "d") avg.IT.d = temp.toFixed(2);
              if (key == "f") avg.IT.f = temp.toFixed(2);
              if (key == "w") avg.IT.w = temp.toFixed(2);
              if (key == "i") avg.IT.i = temp.toFixed(2);
            }
            if (key == "totalStudents") totStud.IT = avg.IT.totalStudents;
          });
        }
      });
      console.log(totStud);
      setTotalStudents(totStud);
      console.log(avg);
      setGradeForm(avg);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllStudentOutcomes = async () => {
    try {
      const outRes = await GetCourseStudentOutcomesCompleted(
        year,
        term,
        department,
        number
      );
      const status = outRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the data! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      const out = outRes.data;
      console.log(out);
      let avg = out;
      let temp = {};
      for (let i = 0; i < out.length; ++i) {
        Object.entries(out[i]).forEach(key => {
          if (key[0] == "CS") {
            temp = (out[i].CS / totalStudents.CS) * 100;
            console.log(`${key[0]}:`, temp.toFixed(2));
            avg[i].CS = temp.toFixed(2);
          }
          if (key[0] == "CE") {
            temp = (out[i].CE / totalStudents.CE) * 100;
            console.log(`${key[0]}:`, temp.toFixed(2));
            avg[i].CE = temp.toFixed(2);
          }
          if (key[0] == "CYS") {
            temp = (out[i].CYS / totalStudents.CYS) * 100;
            console.log(`${key[0]}:`, temp.toFixed(2));
            avg[i].CYS = temp.toFixed(2);
          }
          if (key[0] == "IT") {
            temp = (out[i].IT / totalStudents.IT) * 100;
            console.log(`${key[0]}:`, temp.toFixed(2));
            avg[i].IT = temp.toFixed(2);
          }
        });
      }
      console.log(avg);
      setOutcomeForm(avg);
    } catch (error) {
      console.log(error);
    }
  };
  // const getNumberSec = async () => {
  //   try {
  //     const numbersRes = await getNumberOfSectionsInCourse(
  //       term,
  //       year,
  //       department,
  //       number
  //     );
  //     const number = numbersRes.data;
  //     console.log(numbersRes.data);
  //     setSecNum(number);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const average = () => {
  //   if(!gradeForm || !outcomeForm) {
  //     return;
  //   }
  //   let avg = gradeForm;
  //   let outAvg = outcomeForm;

  //   for(let i=0; i<avg.length; ++i){
  //     avg.CS = avg.CS/secNum;
  //     avg.CE = avg.CS/secNum;
  //     avg.CYS = avg.CS/secNum;
  //     avg.IT = avg.CS/secNum;
  //   }
  //   console.log(avg);
  // };

  useEffect(() => {
    // getNumberSec();
    getGradeByCourse();
    checkUser();
  }, []);
  useEffect(() => {
    getAllStudentOutcomes();
  }, [totalStudents, refreshKey]);

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
{console.log(outcomeForm.CYS)}
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
