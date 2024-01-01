import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Select,
  VStack,
  useToast,
  Center,
  ListItem,
  OrderedList,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  getCoursesByDepartment,
  getSemesters,
  getMajors,
  getCourseOutcome,
  getMajorOutcomesBymajor,
  GetLinkedMajorOutcomes,
} from "../../../api/APIHelper";
import { SingleSelect } from "react-select-material-ui";

import MappingTable from "./MappingTable";
import DisplayMajorOutcomes from "./DisplayMajorOutcomes";

const LinkedCourseOutcomeToMajorOutcomes = () => {
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
  const [majorOutcomeDisplay, setMajorOutcomeDisplay] = useState();

  const [majorsList, setMajorsList] = useState();
  const [majorSelect, setMajorSelect] = useState();
  const [selectCourse, setSelectCourse] = useState();
  const [selectOutcome, setSelectOutcome] = useState();

  const [courseSelectionOptions, setCourseSelectionOptions] = useState();
  const [outcomeSelectOption, setOutcomeSelectOption] = useState();
  const [outcomeList, setOutcomeList] = useState();
  const [outcomeOptions, setOutcomeOptions] = useState();
  const [linkedMajorOutcomeList, setLinkedMajorOutcomeList] = useState();

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
          description: `There was an error fetching the major list! Error: ${status}`,
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

  //Get course outcome
  const getOutcomesList = async () => {
    if (!selectCourse || !year || !term || !theDepartment) return;
    try {
      const outcomeListRes = await getCourseOutcome(
        year,
        term,
        theDepartment,
        selectCourse
      );
      let outcomeList = outcomeListRes.data;
      const status = outcomeListRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the course outcome list! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      if(outcomeList == "The course specified has no course outcomes.")
      {
        outcomeList = [];
      }

      const outComeMapToNameAndDescription = outcomeList.map((outcome) => ({
        value: outcome.name,
        label: `${outcome.name}. ${outcome.description}`,
      }));

      if (outComeMapToNameAndDescription) {
        setOutcomeSelectOption(outComeMapToNameAndDescription);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLinkedMajorOutcomesList = async () => {
    if (!selectCourse || !year || !term || !theDepartment || !selectOutcome)
      return;
    try {
      const linkedOutcomesRes = await GetLinkedMajorOutcomes(
        year,
        term,
        theDepartment,
        selectCourse,
        selectOutcome,
        majorSelect
      );
      const linkedData = linkedOutcomesRes.data;
      const status = linkedOutcomesRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the linked major outcomes list! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      if(linkedData == "The course specified has no course outcomes.")
      {
        setLinkedMajorOutcomeList([]);
        setSelectOutcome(null); //clear selection box
      }
      else if(linkedData == "The major specified has no major outcomes linked to the course outcome specified.") //no linked outcomes, show blank table
      {
        setLinkedMajorOutcomeList([]);
      }
      else
      {
        setLinkedMajorOutcomeList(linkedData);
        console.log(linkedData);
      }
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
          description: `There was an error fetching the semester list! Error: ${status}`,
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

  //Create the options for drop-down
  const getOutcomesListByMajor = async () => {
    if (!year || !term || !majorSelect) return;
    try {
      var lookup = {};
      var majorOutcomeListForDisplay = {};
      const outcomelistRes = await getMajorOutcomesBymajor(
        year,
        term,
        majorSelect
      );
      const outcomeListData = outcomelistRes.data;
      const status = outcomelistRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the outcomes list by major! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      outcomeListData.forEach((outcome) => {
        lookup[outcome.name] = outcome.name;
      });
      console.log(outcomeListData);
      outcomeListData.forEach((outcome) => {
        majorOutcomeListForDisplay[outcome.name] = outcome.description;
      });
      setMajorOutcomeDisplay(outcomeListData);
      setOutcomeOptions(lookup);
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

  useEffect(() => {
    getOutcomesListByMajor();
  }, [semJson, majorSelect]);

  useEffect(() => {
    getLinkedMajorOutcomesList();
  }, [
    selectOutcome,
    theDepartment,
    selectCourse,
    semJson,
    refreshKey,
    majorSelect,
  ]);

  const columns = [
    {
      title: "Major Outcome Name or Number",
      field: "name",
      width: "6%",
      width: null,
      cellStyle: { width: 200 },
      validate: (rowData) =>
        rowData.name ? true : "Outcome name can not be empty",
      editComponent: (props) => (
        <SingleSelect
          options={outcomeOptions}
          fullWidth={true}
          value={props.value}
          onChange={(value) => {
            props.onChange(value);
          }}
        />
      ),
    },
    {
      title: "Major Outcome Description",
      field: "description",
      editable: "never",
    },
  ];

  return (
    <div>
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt="1em">
          Student Outcome Mapping
        </Text>
      </Center>
      <VStack id="top" w="90%" m="0 auto">
        <Grid templateColumns="repeat(4, 1fr)" gap={1}>
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
          <GridItem>
            <Select
              id="majors"
              placeholder="Select major"
              borderColor="teal"
              width="100%"
              value={majorSelect}
              isRequired={true}
              disabled={checkIfSelectMajorAndSemseter()}
              onChange={(e) => {
                setMajorSelect(e.target.value);
              }}
            >
              {majorsList &&
                majorsList.map((major, idx) => {
                  return (
                    <option value={major.name} key={idx}>
                      {major.name}
                    </option>
                  );
                })}
            </Select>
          </GridItem>
          <GridItem>
            <SingleSelect
              disabled={checkIfSelectMajorAndSemseter()}
              style={{ bottom: "5px" }}
              fullWidth={true}
              value={selectCourse}
              placeholder="Select a course"
              options={courseSelectionOptions}
              onChange={(value) => {
                setSelectCourse(value);
              }}
            />
          </GridItem>
        </Grid>
      </VStack>
      <Box
        mb="2em"
        align="center"
        w="65%"
        margin="auto"
        border="1px"
        borderColor="teal"
      >
        <SingleSelect
          id="outcomeSelect"
          disabled={checkIfSelectMajorAndSemseter()}
          style={{ bottom: "5px", textAlign: "left" }}
          fullWidth={true}
          value={selectOutcome}
          placeholder="Select a course outcome"
          options={outcomeSelectOption}
          onChange={(value) => {
            setSelectOutcome(value);
          }}
        />
      </Box>

      <Box align="center" w="65%" margin="auto" bg="#edf2f7">
        {majorOutcomeDisplay && majorSelect && (
          <DisplayMajorOutcomes
            majorSelect={majorSelect}
            majorOutcomeDisplay={majorOutcomeDisplay}
          />
        )}
      </Box>
      <Box mb="1em"></Box>

      <Box align="center" w="65%" margin="auto">
        {selectCourse && semJson && theDepartment && selectCourse && (
          <MappingTable
            term={term}
            year={year}
            department={theDepartment}
            selectCourseNumber={selectCourse}
            majorName={majorSelect}
            selectOutcome={selectOutcome}
            refreshTable={refreshTable}
            columns={columns}
            data={linkedMajorOutcomeList}
          />
        )}
      </Box>
    </div>
  );
};
export default LinkedCourseOutcomeToMajorOutcomes;

/*
<Box align="center" w="80%" margin="auto">
        {outcomeList && (
          <MappingTable2
            outcomeList={outcomeList}
            majorOutcomeDisplay={majorOutcomeDisplay}
          />
        )}
      </Box>
    */
