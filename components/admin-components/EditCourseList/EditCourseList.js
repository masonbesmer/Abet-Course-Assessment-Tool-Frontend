import React, { useState, useEffect } from "react";
import { Box, Text, Select, Flex, VStack, useToast } from "@chakra-ui/react";
import {
  getCoursesByDepartment,
  getSemesters,
  getUsersByRole,
} from "../../../api/APIHelper";
import CourseTable from "./CourseTable";
import { SingleSelect } from "react-select-material-ui";

const EditCourseList = () => {
  useEffect(() => {
    document.getElementById("top").scrollIntoView();
  });

  // State of the courses and function to set the new state.
  const [theCourse, setNewCourses] = useState({
    courses: [],
  });

  const toast = useToast({ position: "top" });
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [theDepartment, setDepartment] = useState("");
  const [semesters, setSemesterList] = useState();
  const [semJson, setSemJson] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [coordinatorList, setCoordinatorList] = useState();
  const [lookupObject, setLookupObject] = useState();

  //Get Coordinator List
  const getCoordinatorList = async () => {
    const lookup = {};
    try {
      const response = await getUsersByRole("Coordinator");
      const data = response.data;
      if (response) {
        const coordinatorMap = data.map((coordinator) => ({
          coordinatorEUID: coordinator.euid,
          label: coordinator.firstName + " " + coordinator.lastName,
        }));
        setCoordinatorList(coordinatorMap);
        if (coordinatorList) {
          coordinatorList.forEach((coordinator) => {
            lookup[coordinator.coordinatorEUID] = coordinator.label;
          });
          setLookupObject(lookup);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      const res = newCourseListRes.status;
      if (res != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the course list! Error: ${res}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      setNewCourses({
        ...theCourse,
        courses: courseList,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Course Name",
      field: "displayName",
      validate: (rowData) =>
        rowData.displayName ? true : "Course name can not be empty",
    },
    {
      title: "Course Number",
      field: "courseNumber",
      validate: (rowData) =>
        rowData.courseNumber ? true : "Course number can not be empty",
    },
    {
      title: "Coordinator EUID",
      field: "coordinatorEUID",
      validate: (rowData) =>
        rowData.coordinatorEUID ? true : "Coordintor EUID can not be empty",
      filtering: false,
      editComponent: (props) => (
        <SingleSelect
          options={lookupObject}
          fullWidth={true}
          value={props.value}
          onChange={(value) => {
            props.onChange(value);
          }}
        />
      ),
    },
    {
      title: "Is Complete",
      field: "isCourseCompleted",
      validate: (rowData) =>
        rowData.isCourseCompleted != null
          ? true
          : "Is course completed can not be empty",
      lookup: { true: "Yes", false: "No" },
    },
  ];

  //Check if the department is select before enable the dropdown for semester
  const checkIfSelectMajor = () => {
    if (!theDepartment) {
      return true;
    }
    return false;
  };

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

  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
  };

  //Fetch semester list on department change
  useEffect(() => {
    getSemesterList();
    getCoordinatorList();
  }, [theDepartment]);

  //Fetch course when semester or deparment change , or on table refresh
  useEffect(() => {
    getNewCourses();
  }, [semJson, theDepartment, refreshKey]);

  return (
    <div>
      <VStack id="top" w="90%" m="0 auto">
        <Box m="1em" p="3em">
          <Text align="center" fontSize="2xl" fontWeight="bold" mt="1em">
            Edit Course List
          </Text>
          <Flex justifyContent="center">
            <Select
              id="department"
              width="130%"
              mr="1em"
              isRequired={true}
              placeholder="Select Department"
              borderColor="teal"
              value={theDepartment}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            >
              <option value="CSCE">Computer Science & Engineering</option>
            </Select>
            <Select
              id="term"
              placeholder="Select semester"
              borderColor="teal"
              width="75%"
              isRequired={true}
              value={semJson}
              disabled={checkIfSelectMajor()}
              onChange={(e) => {
                setSemJson(e.target.value);
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
          </Flex>
        </Box>
      </VStack>
      <Box align="center" w={{ sm: "100%", md: "50%" }} margin="auto">
        {!semJson && !theDepartment && (
          <Text
            fontWeight="bold"
            mt="1em"
            mb="1em"
            fontSize="lg"
            align="center"
          >
            [Table] Waiting for department and semester selection
          </Text>
        )}
        {semJson && theDepartment && (
          <Text
            fontWeight="bold"
            mt="1em"
            mb="1em"
            fontSize="lg"
            align="center"
          >
            Courses Table
          </Text>
        )}

        {semJson && theDepartment && (
          <CourseTable
            theDepartment={theDepartment}
            columns={columns}
            data={theCourse.courses}
            year={year}
            term={term}
            coordinatorList={coordinatorList}
            refreshTable={refreshTable}
          />
        )}
      </Box>
    </div>
  );
};
export default EditCourseList;
