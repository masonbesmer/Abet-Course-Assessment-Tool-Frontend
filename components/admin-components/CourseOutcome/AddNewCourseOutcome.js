import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Select,
  VStack,
  useToast,
  Center,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  getCoursesByDepartment,
  getSemesters,
  getMajors,
  getCourseOutcome,
} from "../../../api/APIHelper";
import { SingleSelect } from "react-select-material-ui";
import AddNewCourseOutcomeTable from "./AddNewCourseOutcomeTable";

const AddNewCourseOutcome = () => {
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
  const [lookupObjectCourse, setLookupObjectCourse] = useState();
  const [majorsList, setMajorsList] = useState();
  const [majorSelect, setMajorSelect] = useState();
  const [selectCourse, setSelectCourse] = useState();
  const [courseSelectionOptions, setCourseSelectionOptions] = useState();
  const [outcomeList, setOutcomeList] = useState();
  const [outcomeOptions, setOutcomeOptions] = useState();

  //Check if the department is select before enable the dropdown for semester
  const checkIfSelectMajor = () => {
    if (!theDepartment) {
      return true;
    }
    return false;
  };

  //Check if the department and semester is select before enable the dropdown for major
  const checkIfSelectMajorAndSemseter = () => {
    if (!theDepartment || !semJson) {
      return true;
    }
    return false;
  };

  const getMajorsList = async () => {
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
      setMajorsList(majorListData);
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

  const getOutcomesList = async () => {
    if (!selectCourse || !year || !term || !theDepartment) return;
    try {
      const outcomeListRes = await getCourseOutcome(
        year,
        term,
        theDepartment,
        selectCourse
      );
      const outcomeList = outcomeListRes.data;
      const status = outcomeListRes.status;
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
      setOutcomeList(outcomeList);
    } catch (error) {
      console.log(error);
    }
  };

  const getSemesterList = async () => {
    try {
      const semesterlistRes = await getSemesters();
      const status = semesterlistRes.status;
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

  useEffect(() => {
    getOutcomesList();
  }, [semJson, theDepartment, refreshKey, selectCourse]);

  const columns = [
    {
      title: "Outcome Number",
      field: "name",
      width: "5%",
      width: null,
      type: "numeric",
      cellStyle: { width: 150 },
      validate: (rowData) =>
        rowData.name
          ? true
          : "Outcome number can not be empty and can only be number",
    },
    {
      title: "Outcome Description",
      field: "description",
      validate: (rowData) =>
        rowData.description ? true : "Outcome description can not be empty",
    },
  ];

  return (
    <div>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt="1em">
          Add new course outcome
        </Text>
      </Center>
      <VStack id="top" w="90%" m="0 auto">
        <Grid templateColumns="repeat(3, 1fr)" gap={1}>
          <GridItem>
            <Select
              id="department"
              width="100%"
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
          </GridItem>

          <GridItem zIndex="dropdown">
            <SingleSelect
              disabled={checkIfSelectMajorAndSemseter()}
              value={selectCourse}
              placeholder="Select a course"
              options={courseSelectionOptions}
              onChange={(value) => {
                setSelectCourse(value);
              }}
            />
          </GridItem>
        </Grid>
        <Box align="center" w="60%" mt="5em">
          {!semJson && !theDepartment && (
            <Text fontWeight="bold" mt="1em" fontSize="lg" align="center">
              [Table] Waiting for selections...
            </Text>
          )}
          {semJson && theDepartment && (
            <Text
              fontWeight="bold"
              mb="1em"
              mt="5em"
              fontSize="lg"
              align="center"
            >
              Outcome Table
            </Text>
          )}
          {selectCourse && semJson && theDepartment && selectCourse && (
            <AddNewCourseOutcomeTable
              term={term}
              year={year}
              department={theDepartment}
              selectCourseNumber={selectCourse}
              refreshTable={refreshTable}
              columns={columns}
              data={outcomeList}
            />
          )}
        </Box>
      </VStack>
    </div>
  );
};
export default AddNewCourseOutcome;
