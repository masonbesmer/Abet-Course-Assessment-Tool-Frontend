//imports
import React, { useState, useEffect } from "react";
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
//api
import {
  getCoursesByDepartment,
  getSemesters,
  getUsersByRole,
  getSectionsByCourse,
} from "../../../api/APIHelper";

//Auto complete Selection
import { SingleSelect } from "react-select-material-ui";

//Table
import SectionTable from "./SectionTable";

const EditAssignedCourses = () => {
  //Selector variables
  const toast = useToast({ position: "top" });
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [theDepartment, setDepartment] = useState("");
  const [semesters, setSemesterList] = useState();
  const [semJson, setSemJson] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [courseSelectionOptions, setCourseSelectionOptions] = useState();
  const [instructorList, setInstructorList] = useState();
  const [lookupObject, setLookupObject] = useState();
  const [selectCourse, setSelectCourse] = useState();
  const [sectionList, setSectionList] = useState();

  //Get Semester List after department is select
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
      setSemesterList(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  //Check if the department is select before enable the dropdown for semester
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

  //End get Semester

  //[Begin]Get the courses list after semester and deparment is selected

  // Get the courses by department from the back-end.
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

  //[End] get course list

  // Get the sections of a course
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

  //Get instructor List
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

  //Refresh table
  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
    console.log(refreshKey);
  };

  const columns = [
    {
      title: "Section Number",
      field: "sectionNumber",
      type: "numeric",
      validate: (rowData) =>
        rowData.sectionNumber
          ? true
          : "Section number can not be empty or contain characters",
    },
    {
      title: "Number of student",
      field: "numberOfStudents",
      type: "numeric",
      validate: (rowData) =>
        rowData.numberOfStudents
          ? true
          : "Number of student can not be empty or contain characters",
    },
    {
      title: "Instructor EUID",
      field: "instructorEUID",
      validate: (rowData) =>
        rowData.instructorEUID ? true : "Instructor EUID can not be empty",
      filtering: false,
      editComponent: (props) => (
        <SingleSelect
          options={lookupObject}
          fullWidth={true}
          value={props.value}
          onChange={(value) => props.onChange(value)}
        />
      ),
    },
    {
      title: "Is section Completed",
      field: "isSectionCompleted",
      validate: (rowData) =>
        rowData.isSectionCompleted != null
          ? true
          : "Is section completed can not be empty",
      lookup: { true: "Yes", false: "No" },
    },
  ];

  return (
    <div>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt="1em">
          Add & Edit Course's Sections
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
      <Box align="center" margin="auto" w={{ sm: "100%", md: "50%" }}>
        {!selectCourse ||
          !semJson ||
          (!theDepartment && (
            <Text
              fontWeight="bold"
              mt="1em"
              mb="1em"
              fontSize="lg"
              align="center"
            >
              [Table] Waiting for department, semester, and course selection
            </Text>
          ))}

        {selectCourse && semJson && theDepartment && (
          <Text
            fontWeight="bold"
            mt="4em"
            mb="1em"
            fontSize="lg"
            align="center"
          >
            Sections Table
          </Text>
        )}

        {selectCourse &&
          semJson &&
          theDepartment &&
          selectCourse != "There are no course for this semester" && (
            <SectionTable
              year={year}
              term={term}
              department={theDepartment}
              courseNumber={selectCourse}
              columns={columns}
              data={sectionList}
              instructorList={instructorList}
              refreshTable={refreshTable}
            />
          )}
      </Box>
    </div>
  );
};
export default EditAssignedCourses;
