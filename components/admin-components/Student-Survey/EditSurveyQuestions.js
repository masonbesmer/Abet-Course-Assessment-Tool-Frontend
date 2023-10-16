import React, { useState, useEffect } from "react";

import {
  Text,
  Center,
  useToast,
  Box,
  Select,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { getQuestionSet, getSemesters } from "../../../api/APIHelper";
import SurveyQuestionsTable from "./SurveyQuestionsTable";

const EditSurveyQuestions = () => {
  const toast = useToast({ position: "top" });
  const [refreshKey, setRefreshKey] = useState(0);
  const [semesters, setSemesterList] = useState();
  const [semJson, setSemJson] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [selectQuestionSet, setSelectQuestionSet] = useState();
  const [surveyQuestions, setSurveyQuestions] = useState();

  const columns = [
    {
      title: "Id",
      field: "id",
      type: "numeric",
      width: "2%",
      width: null,
      cellStyle: { width: 100 },
    },
    {
      title: "Question",
      field: "question",
      validate: (rowData) =>
        rowData.question ? true : "Question can not be empty",
    },
  ];

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

  const getQuestions = async () => {
    if (!selectQuestionSet) {
      return;
    }
    const semesterParse = JSON.parse(semJson);
    setYear(semesterParse["year"]);
    setTerm(semesterParse["term"]);
    try {
      const questionsRes = await getQuestionSet(
        semesterParse["year"],
        semesterParse["term"],
        selectQuestionSet
      );
      const questionsData = questionsRes.data.questions;
      var indexedQuestionsData = [];

      for (var i = 0; i < questionsData.length; i++) {
        var question = questionsData[i];
        indexedQuestionsData[i] = {
          id: i,
          question: question,
        };
      }
      console.log(indexedQuestionsData);
      if (indexedQuestionsData) {
        setSurveyQuestions(indexedQuestionsData);
      }
      const status = questionsRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the data! Error: ${res}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
    return refreshKey;
  };

  const checkIfSemesterSelect = () => {
    if (!semJson) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log("ran");
    getQuestions();
  }, [refreshKey, selectQuestionSet, semJson]);

  useEffect(() => {
    getSemesterList();
  }, []);

  return (
    <div>
      <VStack id="top" w="90%" m="0 auto">
        <Center>
          <Text fontSize="2xl" fontWeight="bold" mt="1em">
            Survey Set
          </Text>
        </Center>
        <Flex justifyContent="center">
          <Select
            id="term"
            placeholder="Select semester"
            borderColor="teal"
            width="75%"
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
          <Select
            width="100%"
            ml="1em"
            isRequired={true}
            placeholder="Select question set"
            borderColor="teal"
            value={selectQuestionSet}
            disabled={checkIfSemesterSelect()}
            onChange={(e) => {
              console.log(e.target.value);
              setSelectQuestionSet(e.target.value);
            }}
          >
            <option value="InstructorQuestions">
              Instructor Questions Set
            </option>
            <option value="TAquestions">TA Questions Set</option>
          </Select>
        </Flex>
        <Text fontWeight="bold" mt="1em" mb="1em" fontSize="lg" align="center">
          Questions List
        </Text>
      </VStack>
      <Box align="center" w={{ sm: "100%", md: "50%" }} margin="auto">
        {semJson && selectQuestionSet && (
          <SurveyQuestionsTable
            columns={columns}
            data={surveyQuestions}
            selectQuestionSet={selectQuestionSet}
            year={year}
            term={term}
            refreshTable={refreshTable}
          />
        )}
      </Box>
    </div>
  );
};
export default EditSurveyQuestions;
