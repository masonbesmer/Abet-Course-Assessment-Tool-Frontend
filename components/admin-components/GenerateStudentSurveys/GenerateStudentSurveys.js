//imports
import React, { useState, useEffect } from "react";
import {
  Grid,
  GridItem,
  Select,
  VStack,
  Center,
  Text,
  Box,
} from "@chakra-ui/react";
const jwt = require("jsonwebtoken");
//api
import {
  getCoursesByDepartment,
  getSemesters,
  getSectionsByCourse,
} from "../../../api/APIHelper";
//hooks
import { SingleSelect } from "react-select-material-ui";

import StudentSurveysTable from "./StudentSurveysTable";

const GenerateStudentSurveys = () => {
  const [courseList, setCourses] = useState();
  //toggle sort by instructor
  const [selectDepartment, setSelectDepartment] = useState("");
  const [semJson, setSemJson] = useState();
  const [semesters, setSemesterList] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [courseSelectionOptions, setCourseSelectionOptions] = useState();
  const [selectCourse, setSelectCourse] = useState();
  const [surveyObject, setSurveyObject] = useState();

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

  //Get course list
  const getCourseList = async () => {
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
        selectDepartment
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

      if (courseMapToValueAndLabel) {
        setCourseSelectionOptions(courseMapToValueAndLabel);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Check if the department is select before enable the dropdown for semester
  const checkIfSelectMajor = () => {
    if (!selectDepartment) {
      return true;
    }
    return false;
  };

  //Check if the department and semester is select before displaying the table
  const checkIfSelectMajorAndSemester = () => {
    if (!selectDepartment || !semJson) {
      return true;
    }
    return false;
  };

  const secretKey = process.env.SURVEY_JWT_KEY;

  //Get section list
  const getSectionList = async () => {
    var surveyObj = {};
    if (!semJson || !selectDepartment || !selectCourse) {
      console.log(semJson, selectDepartment, selectCourse);
      return;
    }
    try {
      const sectionlistRes = await getSectionsByCourse(
        term,
        year,
        selectDepartment,
        selectCourse
      );
      var sectionListData = sectionlistRes.data;
      const status = sectionlistRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the section list! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      sectionListData.map((section, idx) => {
        var token = jwt.sign(
          {
            courseNumber: selectCourse,
            sectionNumber: section.sectionNumber,
            courseTerm: term,
            courseYear: year,
            instructorID: section.instructorEUID,
            departmentName: selectDepartment,
          },
          secretKey,
          { expiresIn: "365d" }
        );
        var link = "http://localhost:3000/survey/" + token;
        surveyObj[idx] = {
          courseNumber: selectCourse,
          sectionNumber: section.sectionNumber,
          courseTerm: term,
          courseYear: year,
          instructorID: section.instructorEUID,
          departmentName: selectDepartment,
          link: link,
        };
      });
      var test = Object.values(surveyObj);
      setSurveyObject(test);
      console.log(test);
    } catch (error) {
      console.log(error);
    }
  };

  //Table columns
  const columns = [
    {
      title: "Section Number",
      field: "sectionNumber",
    },
    {
      title: "Instructor EUID",
      field: "instructorID",
    },
    {
      title: "Link",
      field: "link",
    },
  ];

  useEffect(() => {
    getSemesterList();
  }, [selectDepartment]);

  useEffect(() => {
    getCourseList();
  }, [semJson]);

  useEffect(() => {
    getSectionList();
  }, [courseSelectionOptions, selectCourse, selectDepartment]);

  return (
    <div id="top">
      <Center>
        <Text fontWeight="bold" fontSize="xl" mt="1em">
          Generate Student Surveys
        </Text>
      </Center>
      <VStack id="top" w="100%">
        <Grid mt="2em" templateColumns="repeat(3, 1fr)" gap={4}>
          <GridItem>
            <Select
              id="department"
              width="100%"
              isRequired={true}
              placeholder="Select Department"
              borderColor="teal"
              value={selectDepartment}
              onChange={(e) => {
                if (e.target.value == "") {
                  setSelectDepartment(null);
                } else {
                  setSelectDepartment(e.target.value);
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
      <Box align="center" w="50%" margin="auto">
        {!selectCourse ||
          !semJson ||
          (!selectDepartment && (
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

        {selectCourse && semJson && selectDepartment && (
          <Text
            fontWeight="bold"
            mt="4em"
            mb="1em"
            fontSize="lg"
            align="center"
          >
            Survey Table
          </Text>
        )}
        {selectCourse && semJson && selectDepartment && surveyObject && (
          <StudentSurveysTable columns={columns} data={surveyObject} />
        )}
      </Box>
    </div>
  );
};

export default GenerateStudentSurveys;
