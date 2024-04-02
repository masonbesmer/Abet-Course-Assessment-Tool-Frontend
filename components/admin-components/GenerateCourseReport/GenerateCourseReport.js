import { useState, useEffect } from "react";
import NextLink from "next/link";
import Link from "next/link";
import { dividerClasses } from "@mui/material";
import { SingleSelect } from "react-select-material-ui";
import {
  Text,
  Grid,
  GridItem,
  Center,
  Flex,
  Box,
  Select,
  useToast,
  VStack,
  Portal,
  Button,
} from "@chakra-ui/react";
import {
  getAllCourses,
  getInstructorCourses,
  getCoursesByDepartment,
  getSemesters,
  getSectionsByCourse,
  getUsersByRole,
} from "../../../api/APIHelper";
import courseCompletion from "../../../pages/courseCompletion";
import CourseList from "./CourseList";

//don't know why user was being sent but not used in other generates, but did it anyways -- ask group
const GenerateCourseReport = ({ user }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [theDepartment, setDepartment] = useState("");
  const [semesters, setSemesterList] = useState();
  const [semJson, setSemJson] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [selectCourse, setSelectCourse] = useState(); //used to identify if there are no courses in this semester
  const [counter, setCounter] = useState(); //used to count how many sections finished their reports
  //   const [courseSelectionOptions, setCourseSelectionOptions] = useState();
  const [instructorList, setInstructorList] = useState();
  const [lookupObject, setLookupObject] = useState();
  const [courseList, setcourseList] = useState();
  const [sectionList, setSectionList] = useState();
  const [formReadyList, setFormReadyList] = useState(true);

  //used to see if all sections have submitted their forms which will make course report be available to be shown.
  // const checkFormReady = async () => {
  //   const courses = courseList;
  //   console.log(courses);

  //   // let i = 0;
  //   // if(courses != 0){
  //   //   for (i < courses.length; ++i; ) {
  //   //     // getSections(courses[i].courseNumber);
  //   //     let sections = sectionList;

  //   //     console.log(sections);

  //   //     let j = 0;

  //   //     for (j < sections.length; ++j; ) {
  //   //       // if (sections[j].isFormSubmitted == true) {
  //   //       //   setCounter(count+1);
  //   //       // }
  //   //       if (sections.length == counter) setFormReadyList[i] = true;
  //   //     }
  //   //   }
  //   // }
  //   return;
  // };

  const getSemesterList = async () => {
    try {
      const semesterlistRes = await getSemesters();
      const res = semesterlistRes.status;
      if (res != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the data! Error: ${res}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      const sorted = semesterlistRes.data.sort((a, b) => {
        return b.year - a.year;
      });
      console.log(sorted);
      setSemesterList(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfSelectMajor = () => {
    if (!theDepartment) {
      return true;
    }
    return false;
  };

  //   Check if the department and semester is select before displaying the table
  //   const checkIfSelectMajorAndSemester = () => {
  //     if (!theDepartment || !semJson) {
  //       return true;
  //     }
  //     return false;
  //   };

  const getCourses = async () => {
    if (!semJson) {
      return;
    }
    const semesterParse = JSON.parse(semJson);
    setYear(semesterParse["year"]);
    setTerm(semesterParse["term"]);
    try {
      const courselistRes = await getCoursesByDepartment(
        semesterParse["term"],
        semesterParse["year"],
        theDepartment
      );
      const courseListData = courselistRes.data;
      const status = courselistRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the course list! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        if (_.isEmpty(courseListData)) {
          setCourseSelectionOptions(["There are no course for this semester"]);
          setSelectCourse("");
          console.log("Empty courselist");
          return;
        }
        return;
      }
      setcourseList(courseListData);
      console.log(courseListData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, [courseList, semJson, theDepartment, refreshKey]);

  useEffect(() => {
    getSemesterList();
  }, [theDepartment]);

  // const getNewCourses = async () => {
  //   if (!semJson) {
  //     return;
  //   }
  //   const semesterParse = JSON.parse(semJson);
  //   setYear(semesterParse["year"]);
  //   setTerm(semesterParse["term"]);
  //   try {
  //     const newCourseListRes = await getCoursesByDepartment(
  //       semesterParse["term"],
  //       semesterParse["year"],
  //       theDepartment
  //     );
  //     const courseList = newCourseListRes.data;
  //     const status = newCourseListRes.status;
  //     if (status != "SUCCESS") {
  //       toast({
  //         title: "Error",
  //         description: `There was an error fetching the course list! Error: ${status}`,
  //         status: "error",
  //         duration: 9000,
  //         isClosable: true,
  //       });
  //       return;
  //     }

  //     const courseMapToValueAndLabel = courseList.map((course) => ({
  //       value: course.courseNumber,
  //       label: course.displayName,
  //     }));

  //     if (_.isEmpty(courseList)) {
  //       setCourseSelectionOptions(["There are no course for this semester"]);
  //       setSelectCourse("");
  //       console.log("Empty courselist");
  //       return;
  //     }

  //     if (courseMapToValueAndLabel) {
  //       setCourseSelectionOptions(courseMapToValueAndLabel);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getNewCourses();
  //   // getInstructorList();
  // }, [semJson, theDepartment, refreshKey]);

  //   const getInstructorList = async () => {
  //     const lookup = {};
  //     try {
  //       const response = await getUsersByRole("Instructor");
  //       const data = response.data;
  //       if (response) {
  //         const instructorMap = data.map((instructor) => ({
  //           instructorEUID: instructor.euid,
  //           label: instructor.firstName + " " + instructor.lastName,
  //         }));
  //         setInstructorList(instructorMap);
  //         if (instructorList) {
  //           console.log(instructorList);
  //           instructorList.forEach((instructor) => {
  //             lookup[instructor.instructorEUID] = instructor.label;
  //           });
  //           setLookupObject(lookup);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
    console.log(refreshKey);
  };

  const getSections = async (/*{ courseNumber }*/) => {
    if (!semJson) {
      return;
    }
    try {
      const sectionlistRes = await getSectionsByCourse(
        term,
        year,
        theDepartment,
        courseList[0].courseNumber
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
  };
  useEffect(() => {
    getSections();
  }, [refreshKey]);

  //   console.log(course.courseNumber);
  const columns = [
    {
      title: "Course Number",
      field: "courseNumber",
      type: "numeric",
      validate: (rowData) =>
        rowData.courseNumber
          ? true
          : "Course Number cannot be empty or contain characters",
    },
    {
      title: "Course Name",
      field: "displayName",
      validate: (rowData) =>
        rowData.displayName
          ? true
          : "Course Name (displayName) cannot be empty",
      filtering: false,
    },
    {
      title: "Completion Status",
      field: "isFormSubmitted",
      defaultSort: "desc",
      validate: (formReadyList) =>
        formReadyList != null ? true : "isFormSubmitted cannot be empty",
      lookup: { true: "View Report", false: "Incomplete" },
      render: (rowData) => {
        if (formReadyList) {
          return (
            <Button
              color="white"
              bg="#016a31"
              as="a"
              height="10"
              rounded="md"
              width="40"
              _hover={{
                background: "teal",
                color: "white",
              }}
              variant="link"
              onClick={(e) => {
                e.preventDefault();
                // Handle button click action here
                // You can use rowData to access row data
              }}
            >
              <NextLink
                href={{
                  pathname: "/courseCompletion",
                  query: {
                    course: rowData.courseNumber,
                    term: term,
                    year: year,
                    department: "CSCE",
                  },
                }}
              >
                View Report
              </NextLink>
            </Button>
          );
        } else {
          return <p>Incomplete</p>;
        }
      },
    },
  ];

  // useEffect(() => {
  //   checkFormReady();
  // }, [courseList, formReadyList, refreshKey]);

  return (
    <div>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt="1em">
          Find Course Report
        </Text>
      </Center>
      <VStack id="top" w="100%">
        <Grid templateColumns="repeat(2, 1fr)" gap={1}>
          <GridItem>
            <Select
              id="department"
              width="100%"
              mr="1em"
              isRequired={true}
              placeholder="Select Department"
              borderColor="teal"
              value={theDepartment}
              onChange={(e) => {
                if (e.target.value == "") {
                  setDepartment(null);
                } else {
                  setDepartment(e.target.value);
                }
              }}
            >
              <option value="CSCE">Computer Science & Engineering</option>
            </Select>
          </GridItem>
          <GridItem>
            <Select
              id="term"
              placeholder="Select semester"
              borderColor="teal"
              width="100%"
              isRequired={true}
              value={semJson}
              disabled={checkIfSelectMajor()}
              onChange={(e) => {
                if (e.target.value == "") {
                  setSemJson(null);
                } else {
                  setSemJson(e.target.value);
                }
              }}
            >
              {semesters &&
                semesters.map((sem, idx) => {
                  return (
                    <option value={JSON.stringify(sem)} key={idx}>
                      {sem.term} {sem.year}
                    </option>
                  );
                })}
            </Select>
          </GridItem>
        </Grid>
      </VStack>
      <Box align="center" margin="auto" w={{ sm: "100%", md: "50%" }}>
        {!semJson ||
          (!theDepartment && (
            <Text
              fontWeight="bold"
              mt="1em"
              mb="1em"
              fontSize="lg"
              align="center"
            >
              [Table] Waiting for department, and semester
            </Text>
          ))}

        {semJson && theDepartment && (
          <Text
            fontWeight="bold"
            mt="4em"
            mb="1em"
            fontSize="lg"
            align="center"
          >
            Courses Table
          </Text>
        )}

        {semJson &&
          theDepartment &&
          selectCourse != "There are no course for this semester" && (
            <CourseList
              year={year}
              term={term}
              department={theDepartment}
              courseNumber={selectCourse}
              columns={columns}
              data={courseList}
              instructorList={instructorList}
              refreshTable={refreshTable}
            />
          )}
      </Box>
    </div>
  );
};

export default GenerateCourseReport;
