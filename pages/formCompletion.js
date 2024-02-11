//imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";

import {
  Button,
  Text,
  Box,
  Flex,
  useToast,
  Center,
  Textarea,
} from "@chakra-ui/react";

//api
import {
  GetStudentOutcomesCompleted,
  SetStudentOutcomesCompleted,
  getSection,
  getSectionAssistant,
  getGrades,
  setGrades,
} from "../api/APIHelper";
//components
import GradesInput from "../components/form-components/GradesInput";
import CourseOutcomesMapping from "../components/form-components/CourseOutcomesMapping";
import blankForm from "../components/form-components/blankForm.json";
import Navigation from "../components/instructor-components/Navigation";

const formCompletion = ({ number, section, term, year, department }) => {
  const router = useRouter();
  const [gradeForm, setGradeForm] = useState();
  const [outcomeForm, setOutcomeForm] = useState();
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [commentField, setCommentField] = useState(""); // instructor comments textarea
  const [fileInputField, setFileInputField] = useState();
  const toast = useToast({ position: "top" });
  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
  };

  const checkUser = async () => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      const token = cookieCutter.get("token");
      const json = jwt.decode(token);
      if (!json) {
        router.push("/Login");
        return;
      }

      const jsonUserId = json.unique_name;
      const sectionInstructorEUID = await getInstructorSectionInformation();
      const sectionAssistantEUID = await getAssistantSectionInformation();
      if (json == null) {
        router.push("/");
      } else {
        console.log(jsonUserId, sectionInstructorEUID);
        if (jsonUserId != sectionInstructorEUID) {  
          if (jsonUserId != sectionAssistantEUID){
            toast({
              title: "Error",
              description: `User is not assigned to selected section!`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            router.push("/");
          }
        }
      }
    }
  };

  const getInstructorSectionInformation = async () => {
    try {
      const sectionRes = await getSection(
        term,
        year,
        department,
        number,
        section
      );
      const sectionData = sectionRes.data;
      const status = sectionRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the section information! Error: ${status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      return sectionData.instructorEUID;
    } catch (error) {
      console.log(error);
    }
  };

  const getAssistantSectionInformation = async () => {
    const token = cookieCutter.get("token");
    const json = jwt.decode(token);
    const jsonUserId = json.unique_name;
    try {
      const response = await getSectionAssistant(
        jsonUserId,
        term,
        year,
        department,
        number,
        section
      );
      const responseData = response.data;
      const status = response.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the section information! Error: ${status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  const getGradeForm = async () => {
    try {
      const res = await getGrades(year, term, department, number, section);
      const gradesData = res.data;
      if (gradesData) {
        if (Object.keys(gradesData).length < 1) {
          //If the is the first time working on the form then create a blank form
          await setGrades(year, term, department, number, section, blankForm);
          setGradeForm(blankForm);
        } else if (Object.keys(gradesData).length >= 1) {
          setGradeForm(gradesData);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOutcomeForm = async () => {
    try {
      const outcomeFormRes = await GetStudentOutcomesCompleted(
        year,
        term,
        department,
        number,
        section
      );
      const outcomeFormData = outcomeFormRes.data;
      setOutcomeForm(outcomeFormData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeChange = (major, grade, newValue) => {
    try {
      let tempForm = gradeForm[major];
      tempForm[grade] = newValue;
      setGradeForm({
        ...gradeForm,
        [major]: tempForm,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOutcomesChange = (major, outcomeName, newValue) => {
    var tempForm = outcomeForm;
    for (var i = 0; i < tempForm.length; i++) {
      if (tempForm[i].outcomeName == outcomeName) {
        tempForm[i][major] = String(newValue);
      }
    }
    setOutcomeForm(tempForm);
  };

  const handleCommentFieldChange = (e) => {
    setCommentField(e.target.value);
  };

  const handleFileInputChange = (e) => {
    setFileInputField(e.target.value);
  };

  useEffect(() => {
    getOutcomeForm();
    getGradeForm();
  }, []);

  useEffect(() => {
    getInstructorSectionInformation();
    getAssistantSectionInformation();
    checkUser();
  }, []);

  const handleSubmit = async () => {
    console.log(gradeForm);
    console.log("----------------------");
    console.log(outcomeForm);
    try {
      //const res = await setGrades(year,term,department,number,section,form2)
      for (const key in gradeForm) {
        let totalStudentsNum =
          gradeForm[key].a +
          gradeForm[key].b +
          gradeForm[key].c +
          gradeForm[key].d +
          gradeForm[key].f; // counts the total number of students by adding grades for all categories
        console.log(totalStudentsNum);
        gradeForm[key].totalStudents = totalStudentsNum;
      }
      const gradeRes = await setGrades(
        year,
        term,
        department,
        number,
        section,
        gradeForm
      );

      const outcomeRes = await SetStudentOutcomesCompleted(
        year,
        term,
        department,
        number,
        section,
        outcomeForm
      );

      const fileUploadRes = null; // APIHelper function that sends the file to the backend

      const gradeStatus = gradeRes.status;
      const outcomeStatus = outcomeRes.status;
      //const fileUploadStatus = fileUploadRes.status;

      if (gradeStatus == "SUCCESS" && outcomeStatus == "SUCCESS") {
        toast({
          description: `Form submitted!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else if (!gradeStatus == "SUCCESS") {
        toast({
          description: `There was an error submitting the form! Error:${gradeStatus}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else if (!outcomeStatus == "SUCCESS") {
        toast({
          description: `There was an error submitting the form! Error:${outcomeStatus}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }

    refreshTable();
  };

  return (
    <div>
      <Navigation />
      <Center>
        {gradeForm && outcomeForm ? (
          <Flex mt="2em" direction="column" w="90%">
            <Box w="80%">
              <Text fontSize="2xl" fontWeight="bold">
                {department} {number}.{section}
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="green" mb="2em">
                ABET Course Assesment
              </Text>
            </Box>
            <GradesInput
              csGrades={gradeForm.CS}
              ceGrades={gradeForm.CE}
              itGrades={gradeForm.IT}
              cysGrades={gradeForm.CYS}
              handleGradeChange={handleGradeChange}
            />

            <CourseOutcomesMapping
              courseOutcomes={outcomeForm}
              handleOutcomesChange={handleOutcomesChange}
            />

            <Text>Student file upload</Text>
            <input type="file" accept=".pdf" onChange={handleFileInputChange} />

            <Text fontSize="xl" fontWeight="bold" mb="1em">
              Instructor Comments
            </Text>
            <Textarea
              mb="1em"
              size="lg"
              fontSize="xl"
              bg="#edf2f7"
              placeholder="// Write a comment"
              onChange={handleCommentFieldChange}
            ></Textarea>
            <Box>
              <Button
                mb="1em"
                colorScheme="green"
                w="max-content"
                onClick={handleSubmit}
              >
                Submit Report
              </Button>
            </Box>
          </Flex>
        ) : null}
      </Center>
    </div>
  );
};

formCompletion.getInitialProps = ({ query }) => {
  console.log(query);
  return {
    department: query.department,
    number: query.number,
    section: query.section,
    term: query.term,
    year: query.year,
  };
};

export default formCompletion;
