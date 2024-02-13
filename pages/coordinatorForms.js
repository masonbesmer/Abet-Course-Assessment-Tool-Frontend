import { useEffect, useState } from "react";
import {
  VStack,
  Button,
  Text,
  Box,
  Flex,
  Center,
  Textarea,
  useToast,
} from "@chakra-ui/react";

import { getGrades, GetStudentOutcomesCompleted, editComments } from "../api/APIHelper";
import CoordinatorGrades from "../components/form-components/CoordinatorGrades";
import blankForm from "../components/form-components/blankForm.json";
import CoordinatorOutcomes from "../components/form-components/CoordinatorOutcomes";
import Navigation from "../components/instructor-components/Navigation";

const formCompletion = ({ department, number, section, term, year }) => {
  const [comment, setComment] = useState("");
  const [gradeForm, setGradeForm] = useState();
  const [outcomeForm, setOutcomeForm] = useState();
  const toast = useToast({ position: "top" });

  const getGradeForm = async () => {
    try {
      const res = await getGrades(year, term, department, number, section);
      const gradesData = res.data;
      if (gradesData) {
        if (Object.keys(gradesData).length < 1) {
          setGradeForm(blankForm);
        } else if (Object.keys(gradesData).length >= 1) {
          for (const key in gradesData) {
            let totalStudentsNum =
              gradesData[key].a +
              gradesData[key].b +
              gradesData[key].c +
              gradesData[key].d +
              gradesData[key].f;
            gradesData[key].totalStudents = totalStudentsNum;
          }
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
      console.log(outcomeFormData);
      setOutcomeForm(outcomeFormData);
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async () => {
    console.log(comment);
    const commentRes = await editComments(
      term,
      year,
      department,
      number,
      section,
      null,
      comment
    );
    const commentStatus = commentRes.status;

    if(commentStatus == "SUCCESS")
    {
      toast({
        description: `Comment submitted!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    else if (!commentStatus == "SUCCESS")
    {
      toast({
        description: `There was an error submitting the comment! Error:${commentStatus}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

  };

  useEffect(() => {
    getGradeForm();
    getOutcomeForm();
  }, []);

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

          <CoordinatorGrades
            csGrades={gradeForm.CS}
            ceGrades={gradeForm.CE}
            itGrades={gradeForm.IT}
            cysGrades={gradeForm.CYS}
          />
          <CoordinatorOutcomes courseOutcomes={outcomeForm} />
          <Text fontSize="xl" fontWeight="bold" mb="1em">
            Coordinator Comments
          </Text>
          <Textarea
            mb="1em"
            size="lg"
            fontSize="xl"
            bg="#edf2f7"
            placeholder="// Write a comment"
            onChange={(event) => {
              setComment(event.target.value);
            }}
          ></Textarea>

          <Box>
            <Button
              mb="1em"
              colorScheme="green"
              w="max-content"
              onClick={submitComment}
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
  return {
    department: query.department,
    number: query.number,
    section: query.section,
    term: query.term,
    year: query.year,
  };
};

export default formCompletion;
