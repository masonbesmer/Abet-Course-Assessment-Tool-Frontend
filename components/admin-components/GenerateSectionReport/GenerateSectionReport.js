import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import Link from "next/link";

import { SingleSelect } from "react-select-material-ui";

//Table
// import SectionTable from "../EditAssignedCourses/SectionTable";

import { getAllCourses, getInstructorCourses, getCoursesByDepartment, getSemesters, getSectionsByCourse, getUsersByRole } from "../../../api/APIHelper";
import CourseList from "./CourseList";

//THIS IS A TEMP FIX ACCORDING TO CURRENT UNDERSTANDING OF THE REQUIREMENTS
//THIS NEEDS TO BE CHANGED BEFORE FINAL UPDATE AS WELL AS MAKING IT PROPERLY CONNECT TO THE DATES IN THE DATABASE
//CHANFE
const currYear = new Date().getFullYear()

const GenerateSectionReport = ({ user }) => {

  const [refreshKey, setRefreshKey] = useState(0);
  const [theDepartment, setDepartment] = useState("");
  const [semesters, setSemesterList] = useState();
  const [semJson, setSemJson] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [selectCourse, setSelectCourse] = useState();
  const [courseSelectionOptions, setCourseSelectionOptions] = useState();
  const [instructorList, setInstructorList] = useState();
  const [lookupObject, setLookupObject] = useState();
  const [sectionList, setSectionList] = useState();

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

   //Check if the department and semester is select before displaying the table
   const checkIfSelectMajorAndSemester = () => {
     if (!theDepartment || !semJson) {
       return true;
     }
     return false;
   };

   useEffect(() => {
     getSemesterList();
   }, [theDepartment]);

   const getNewCourses = async () => {
     if (!semJson) {
       return;
     }
     const semesterParse = JSON.parse(semJson);
     setYear(semesterParse["year"]);
     setTerm(semesterParse["term"]);
     try {
       const newCourseListRes = await getCoursesByDepartment(
         semesterParse["term"],
         semesterParse["year"],
         theDepartment
       );
       const courseList = newCourseListRes.data;
       const status = newCourseListRes.status;
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

       const courseMapToValueAndLabel = courseList.map((course) => ({
         value: course.courseNumber,
         label: course.displayName,
       }));

       if (_.isEmpty(courseList)) {
         setCourseSelectionOptions(["There are no course for this semester"]);
         setSelectCourse("");
         console.log("Empty courselist");
         return;
       }

       if (courseMapToValueAndLabel) {
         setCourseSelectionOptions(courseMapToValueAndLabel);
       }
     } catch (error) {
       console.log(error);
     }
   };
   useEffect(() => {
     getNewCourses();
     getInstructorList();
   }, [semJson, theDepartment, refreshKey]);

   const getSections = async () => {
     if (!semJson) {
       return;
     }
     try {
       const sectionlistRes = await getSectionsByCourse(
         term,
         year,
         theDepartment,
         selectCourse
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
   }, [selectCourse, refreshKey]);

     const getInstructorList = async () => {
       const lookup = {};
       try {
         const response = await getUsersByRole("Instructor");
         const data = response.data;
         if (response) {
           const instructorMap = data.map((instructor) => ({
             instructorEUID: instructor.euid,
             label: instructor.firstName + " " + instructor.lastName,
           }));
           setInstructorList(instructorMap);
           if (instructorList) {
             console.log(instructorList);
             instructorList.forEach((instructor) => {
               lookup[instructor.instructorEUID] = instructor.label;
             });
             setLookupObject(lookup);
           }
         }
       } catch (error) {
         console.log(error);
       }
     };

   const refreshTable = () => {
     setRefreshKey(refreshKey + 1);
     console.log(refreshKey);
   };


  return (
    <div>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt="1em">
          Find Section Report
        </Text>
      </Center>
      <VStack id="top" w="100%">
        <Grid templateColumns="repeat(3, 1fr)" gap={1}>
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
          <GridItem zIndex="dropdown">
            <SingleSelect
              disabled={checkIfSelectMajorAndSemester()}
              style={{ bottom: "5px" }}
              fullWidth={true}
              value={selectCourse}
              placeholder="Select a course"
              options={courseSelectionOptions}
              onChange={(value) => {
                setSelectCourse(value);
                console.log(value);
              }}
            />
          </GridItem>
        </Grid>
      </VStack>
      </div>
  );
};

export default GenerateSectionReport;
