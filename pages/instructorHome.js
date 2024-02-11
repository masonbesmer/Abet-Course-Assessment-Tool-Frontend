import { useState, useEffect } from "react";
import Head from "next/head";
import {
  VStack,
  Select,
  Flex,
  Box,
  Text,
  toast,
  useToast,
} from "@chakra-ui/react";
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";
import Navigation from "../components/instructor-components/Navigation";
import FormsView from "../components/instructor-components/FormsView";
import {
  GetSectionsByInstructor,
  getSemesters,
  GetSectionsByCoordinator,
  GetSectionsByAssistant,
} from "../api/APIHelper";

const instructorHome = () => {
  const [user, setUser] = useState();
  const [semesters, setSemesterList] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [semJson, setSemJson] = useState();
  const [instructorCourse, setInstructorCourse] = useState();
  const [coordinatorCourse, setCoordinatorCourse] = useState();
  const [teachingAssistantCourse, setTeachingAssistantCourse] = useState();

  const toast = useToast({ position: "top" });

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
      setSemJson(JSON.stringify(sorted[0]));
      setSemesterList(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  const getEUID = () => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      const token = cookieCutter.get("token");
      const json = jwt.decode(token);
      if (!json) {
        router.push("/Login");
      }
      const jsonUserId = json.unique_name;
      setUser(jsonUserId);
    }
  };

  const getInstructorCourses = async () => {
    if (!semJson) {
      return;
    }
    const semesterParse = JSON.parse(semJson);
    setYear(semesterParse["year"]);
    setTerm(semesterParse["term"]);
    try {
      const sectionRes = await GetSectionsByInstructor(
        semesterParse.term,
        semesterParse.year,
        user
      );
      const sectionData = sectionRes.data;

      if (sectionData) {
        setInstructorCourse(sectionData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCoordinatorCourse = async () => {
    if (!semJson) {
      return;
    }
    const semesterParse = JSON.parse(semJson);
    setYear(semesterParse["year"]);
    setTerm(semesterParse["term"]);
    try {
      const sectionRes = await GetSectionsByCoordinator(
        semesterParse.term,
        semesterParse.year,
        user
      );
      const sectionData = sectionRes.data;

      if (sectionData) {
        setCoordinatorCourse(sectionData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTeachingAssistantCourses = async () => {
    if (!semJson) {
      return;
    }
    const semesterParse = JSON.parse(semJson);
    setYear(semesterParse["year"]);
    setTerm(semesterParse["term"]);
    try {
      const sectionRes = await GetSectionsByAssistant(
        semesterParse.term,
        semesterParse.year,
        user
      );
      const sectionData = sectionRes.data;

      if (sectionData) {
        setTeachingAssistantCourse(sectionData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInstructorCourses();
    getCoordinatorCourse();
    getTeachingAssistantCourses();
  }, [semJson]);

  useEffect(() => {
    getSemesterList();
    getEUID();
  }, []);

  return (
    <div>
      <Head>
        <title>UNT ABET: Faculty Page</title>
      </Head>
      <Navigation />

      <VStack mt="4em">
        <Flex justifyContent="center">
          <Select
            alignSelf="center"
            id="term"
            placeholder="Select semester"
            borderColor="teal"
            width="100%"
            isRequired={true}
            value={semJson}
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
        {!semJson && (
          <Box rounded={"lg"} bg={"#edf2f7"} boxShadow={"lg"} p={8}>
            <Text fontSize={"lg"} color={"gray.600"}>
              Please select a semester to begin
            </Text>
          </Box>
        )}
        {semJson && (
          <FormsView
            instructorCourses={instructorCourse}
            coordinatorCourses={coordinatorCourse}
            teachingAssistantCourses={teachingAssistantCourse}
            term={term}
            year={year}
          />
        )}
      </VStack>
    </div>
  );
};

export default instructorHome;
