import { useState, useEffect } from "react";
import { Button, Select, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

import { getAllCourses, getInstructorCourses } from "../../../api/APIHelper";
import CourseList from "./CourseList";

//THIS IS A TEMP FIX ACCORDING TO CURRENT UNDERSTANDING OF THE REQUIREMENTS
//THIS NEEDS TO BE CHANGED BEFORE FINAL UPDATE AS WELL AS MAKING IT PROPERLY CONNECT TO THE DATES IN THE DATABASE
//CHANFE
//const currYear = new Date().getFullYear();
// Update: Year set to 2023 (last year) as we've been using the Fall 2023 semester for testing
const currYear = 2023; // new Date().getFullYear()

const GenerateSectionReport = ({ user }) => {
  const [term, setTerm] = useState({
    semester: "",
    year: null,
  });
  const [courses, setCourses] = useState();
  const terms = [
    {
      semester: "Spring",
      year: currYear,
    },
    {
      semester: "Summer",
      year: currYear,
    },
    {
      semester: "Fall",
      year: currYear,
    },
  ];
  const handleSetTerm = async (e) => {
    setTerm({
      semester: e.target.value.split(" ")[0],
      year: e.target.value.split(" ")[1],
    });
    console.log(e.target.value.split(" ")[0]);
    console.log(e.target.value.split(" ")[1]);
    console.log(term.year);
    /*const coursesRes = await getAllCourses(
      user,
      e.target.value.split(" ")[0],
      e.target.value.split(" ")[1]
    );*/
    const coursesRes = await getAllCourses("fall", currYear, "CSCE");
    console.log("courseRes", coursesRes);
    setCourses(coursesRes.data);
  };

  return (
    <VStack id="top" w="80%" m="0 auto" marginBottom="5em">
      <Text fontSize="2xl" fontWeight="bold" mt="1em" marginBottom="2em">
        Find Section ABET Report
      </Text>
      {term.year == null ? (
        <Select
          mt="1em"
          w="80%"
          id="semester"
          placeholder="Choose Semester"
          variant="filled"
          onChange={handleSetTerm}
          value={term}
          marginBottom="1em"
        >
          <option value={terms[0].semester + " " + terms[0].year.toString(10)}>
            {terms[0].semester} {terms[0].year}
          </option>
          <option value={terms[1].semester + " " + terms[1].year.toString(10)}>
            {terms[1].semester} {terms[1].year}
          </option>
          <option value={terms[2].semester + " " + terms[2].year.toString(10)}>
            {terms[2].semester} {terms[2].year}
          </option>
        </Select>
      ) : (
        <>
          <Select
            mt="1em"
            w="80%"
            id="semester"
            placeholder="Choose Semester"
            variant="filled"
            onChange={handleSetTerm}
            value={term}
            marginBottom="1em"
          >
            <option value={terms[0].semester + " " + terms[0].year.toString(10)}>
              {terms[0].semester} {terms[0].year}
            </option>
            <option value={terms[1].semester + " " + terms[1].year.toString(10)}>
              {terms[1].semester} {terms[1].year}
            </option>
            <option value={terms[2].semester + " " + terms[2].year.toString(10)}>
              {terms[2].semester} {terms[2].year}
            </option>
          </Select>
          <Text fontSize="20px" fontWeight="bold" mt="1em" marginBottom="2em">
            {term.semester} {term.year}
          </Text>
          <CourseList courses={courses} term={term} />
        </>
      )}
    </VStack>
  );
};

export default GenerateSectionReport;
