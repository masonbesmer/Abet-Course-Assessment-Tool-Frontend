import React, { useState, useEffect } from "react";
import { Box, Text, Select, Flex, VStack, useToast } from "@chakra-ui/react";
import {
  getCoursesByDepartment,
  getSemesters,
  getMajors,
} from "../../../../api/APIHelper";
import AssignCourseToMajorOutcomeTable from "./AssignCourseToMajorOutcomeTable";
import { SingleSelect } from "react-select-material-ui";

const AssignCourseToMajorOutcome = () => {
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
  const [lookupObjectMajor, setLookupObjectMajor] = useState();
  const [lookupObjectCourse, setLookupObjectCourse] = useState();

  const getMajorsList = async () => {
    const lookup = {};
    if (!semJson) return;
    const semesterParse = JSON.parse(semJson);
    try {
      const majorListRes = await getMajors(
        semesterParse["term"],
        semesterParse["year"]
      );
      const majorListData = majorListRes.data;
      const status = majorListRes.status;
      if (!majorListData) return;
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
      majorListData.forEach((major) => {
        lookup[major.name] = major.name;
      });

      console.log(lookup);
      setLookupObjectMajor(lookup);
    } catch (error) {
      console.log(error);
    }
  };

  // Get the courses by department from the back-end.
  const getNewCourses = async () => {
    const lookup = {};
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
      courseList.forEach((course) => {
        lookup[
          course.courseNumber
        ] = ` ${course.department} ${course.courseNumber} ${course.displayName}`;
      });
      setLookupObjectCourse(lookup);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Course Number",
      field: "courseNumber",
      type: "numeric",
      validate: (rowData) =>
        rowData.courseNumber ? true : "Course name can not be empty",
      editComponent: (props) => (
        <SingleSelect
          options={lookupObjectCourse}
          fullWidth={true}
          value={props.value}
          onChange={(value) => {
            props.onChange(value);
            console.log(value);
          }}
        />
      ),
    },
    {
      title: "Major",
      field: "major",
      lookup: lookupObjectMajor,
      validate: (rowData) => (rowData.major ? true : "Major can not be empty"),
    },
  ];

  const data = [
    {
      courseNumber: "333",
      major: "CS",
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
  }, [theDepartment]);

  //Fetch course when semester or deparment change , or on table refresh
  useEffect(() => {
    getNewCourses();
  }, [semJson, theDepartment, refreshKey]);

  useEffect(() => {
    getMajorsList();
  }, [semJson]);

  return (
    <div>
      <VStack id="top" w="90%" m="0 auto">
        <Box m="1em" p="3em">
          <Text align="center" fontSize="2xl" fontWeight="bold" mt="1em">
            Assign course to major outcomes
          </Text>

          <Flex justifyContent="center">
            <Select
              id="department"
              width="125%"
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
              width="72%"
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
      <Box align="center" w="30%" margin="auto">
        {!semJson && !theDepartment && (
          <Text fontWeight="bold" mt="1em" fontSize="lg" align="center">
            [Table] Waiting for department and semester selection
          </Text>
        )}
        {semJson && theDepartment && (
          <Text fontWeight="bold" mb="1em" fontSize="lg" align="center">
            Courses To Major Table
          </Text>
        )}

        {semJson && theDepartment && lookupObjectMajor && (
          <AssignCourseToMajorOutcomeTable
            theDepartment={theDepartment}
            columns={columns}
            data={data}
            year={year}
            term={term}
            refreshTable={refreshTable}
            courseLookUp={lookupObjectCourse}
            majorLookUp={lookupObjectMajor}
          />
        )}
      </Box>
    </div>
  );
};
export default AssignCourseToMajorOutcome;
