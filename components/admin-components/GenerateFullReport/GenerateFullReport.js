import { useState, useEffect } from "react";
import { Button, Select, Text, VStack, Box, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { getAllCourses, getInstructorCourses } from "../../../api/APIHelper";
import { getSemesters } from "../../../api/APIHelper";

const GenerateFullReport = ({ user }) => {
  const [courses, setCourses] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [semID, setSemID] = useState();
  const [semesters, setSemesterList] = useState();
  const toast = useToast();
  const getSemesterList = async () => {
    try {
      const semesterlist = await getSemesters();
      const status = semesterlist.status;
      console.log(status);
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the data!
          Error: ${status} `,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      const sorted = semesterlist.data.sort((a, b) => {
        return b.year - a.year;
      });
      setSemesterList(sorted);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error fetching the data!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.log(`Error in getSemesterList: ${error}`);
    }
  };

  const setYearAndTerm = async () => {
    try {
      if (semesters) {
        Object.keys(semesters).forEach(function (key) {
          let semester = semesters[key];
          if (semester.semesterId == semID) {
            //console.log(`Found: ${semester.term} ${semester.year}`);
            setTerm(semester.term);
            setYear(semester.year);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.getElementById("top").scrollIntoView();
    getSemesterList();
  }, []);

  useEffect(() => {
    setYearAndTerm();
  }, [semID]);

  return (
    <VStack id="top" w="80%" m="0 auto" marginBottom="5em">
      <Text fontSize="2xl" fontWeight="bold" mt="1em" marginBottom="2em">
        Generate Full ABET Report
      </Text>

      <Box fontWeight="bold">Select the semester</Box>
      <Select
        align="center"
        id="term"
        placeholder="Select semester"
        borderColor="teal"
        width="15%"
        isRequired={true}
        value={semID}
        onChange={(e) => {
          console.log(`Semester ID: ${e.target.value}`);
          setSemID(e.target.value);
        }}
      >
        {semesters &&
          semesters.map((sem, idx) => {
            return (
              <option value={sem.semesterId} id="ingredientId" key={idx}>
                {sem.term} {sem.year}
              </option>
            );
          })}
      </Select>
      <Button
        //onClick={handleConfirm}
        color="white"
        bg="#016a31"
        height="10"
        rounded="md"
        width="10%"
        _hover={{
          background: "teal",
          color: "white",
        }}
        variant="link"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <Link
          href={{
            pathname: "/adminFullReport",
            query: {
              semester: term,
              year: year,
            },
          }}
        >
          Confirm
        </Link>
      </Button>
    </VStack>
  );
};

export default GenerateFullReport;
