//imports
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { Text, VStack, Button, Box, useToast } from "@chakra-ui/react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import cookieCutter from "cookie-cutter";
import Navigation from "../../components/Navigation";
//hooks
import useToggle from "../../hooks/useToggle";
//API
import {
  getQuestions,
  postSurvey,
  getCourseOutcome,
} from "../../api/APIHelper";
//components
import StudentLoginBox from "../../components/survey-components/StudentLoginBox";
import StudentInfoForm from "../../components/survey-components/StudentInfoForm";
import CourseOutcomesSurvey from "../../components/survey-components/CourseOutcomesSurvey";
import TAsurvey from "../../components/survey-components/TAsurvey";
import InstructorSurvey from "../../components/survey-components/Instructorsurvey";
import StudentFeedback from "../../components/survey-components/StudentFeedback";
//page data
import {
  PageContext,
  pageData,
} from "../../components/survey-components/SurveyPageData";
//api

const studentSurvey = () => {
  const router = useRouter();
  const toast = useToast({ position: "top" });

  let relativeURL = "";
  const ISSERVER = typeof window === "undefined";
  let role = "";
  if (!ISSERVER) {
    const token = cookieCutter.get("token");
    var surveyToken = router.query.token;
    if (!surveyToken) {
      return <></>;
    }
    if (surveyToken) {
      relativeURL = router.pathname.replace("[token]", surveyToken);
    } else {
      relativeURL = router.pathname;
    }
    //console.log("Survey Token " + surveyToken);
    //console.log("Relative URL " + relativeURL);
    if (!token) {
      router.push({
        pathname: "/Login",
        query: { from: relativeURL },
      });
    }

    const json = jwt.decode(token);
    if (json == null) {
      role = "null";
    } else {
      role = json.role;
    }
    //console.log("Role from survey:" + role);
    if (role == "null") {
      console.log("Push");
      router.push({
        pathname: "/Login",
        query: { from: relativeURL },
      });
    }
  }

  //state
  const [courseInformation, setCourseInformation] = useState({
    courseNumber: "",
    courseSemester: "",
    courseYear: "",
    courseDisplayName: "",
    courseDepartment: "",
  });

  const [isLoggedIn, toggleLogin] = useToggle(true);
  const [studentInformation, setStudentInformation] = useState({
    major: "",
    classification: "",
    grade: "",
  });
  const [outcomeSurvey, setOutcomeSurvey] = useState();
  const [TAquestions, setTAquestions] = useState();
  const [InstructorQuestions, setInstructorQuestions] = useState();
  const [studentInput, setStudentInput] = useState({
    additionalFeedback: "",
  });

  useEffect(() => {
    console.log("ss updated");
  }, [TAquestions]);

  useEffect(() => {
    console.log("course updated");
    getCourseInformation();
  }, []);

  useEffect(() => {
    getQuestionsFunction();
    getOutcomesList();
  }, [courseInformation]);

  const getCourseInformation = () => {
    if (!ISSERVER) {
      var surveyToken = router.query.token;
      const courseJson = jwt.decode(surveyToken);
      if (
        courseJson == null ||
        courseJson.courseNumber == undefined ||
        courseJson.sectionNumber == undefined ||
        courseJson.courseTerm == undefined ||
        courseJson.courseYear == undefined ||
        courseJson.departmentName == undefined
      ) {
        router.push({
          pathname: "/wrongSurvey",
        });
      } else {
        setCourseInformation({
          courseNumber: courseJson.courseNumber,
          courseTerm: courseJson.courseTerm,
          courseYear: courseJson.courseYear,
          sectionNumber: courseJson.sectionNumber,
          courseDepartment: courseJson.departmentName,
        });
      }
    }
  };

  //Get course outcome
  const getOutcomesList = async () => {
    if (
      courseInformation.courseTerm == "" ||
      courseInformation.courseYear == "" ||
      courseInformation.courseDepartment == "" ||
      courseInformation.courseNumber == ""
    ) {
      return;
    }

    try {
      const outcomeListRes = await getCourseOutcome(
        courseInformation.courseYear,
        courseInformation.courseTerm,
        courseInformation.courseDepartment,
        courseInformation.courseNumber
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
      console.log(outcomeList);
      setOutcomeSurvey(outcomeList);
    } catch (error) {
      console.log(error);
    }
  };

  const getQuestionsFunction = async () => {
    if (
      courseInformation.courseTerm == "" ||
      courseInformation.courseYear == ""
    ) {
      return;
    }
    try {
      var questionsRes = await getQuestions(
        courseInformation.courseYear,
        courseInformation.courseTerm
      );
      const instructorQuestions = questionsRes.data[0].questions.map(
        (question) => {
          return {
            question,
            rating: 0,
          };
        }
      );
      const TAQuestions = questionsRes.data[1].questions.map((question) => {
        return {
          question,
          rating: 0,
        };
      });
      setTAquestions(TAQuestions);
      setInstructorQuestions(instructorQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  const testFunction = async () => {
    const token = cookieCutter.get("token");
    const json = jwt.decode(token);
    const euid = json.unique_name;
    var allAnswerArray = [];
    let array = TAquestions.map((question) => Object.values(question.rating));
    console.log(array);
    console.log(studentInformation);
    if (studentInformation.major == "") {
      toast({
        description: `Please fill out the "Major"`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (studentInformation.classification == "") {
      toast({
        description: `Please fill out the "Year in School box"`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else if (studentInformation.grade == "") {
      toast({
        description: `Please fill out the "Expected Grade"`,
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    for (var i = 0; i < InstructorQuestions.length; i++) {
      if (InstructorQuestions[i].rating == 0) {
        toast({
          description: `Please answer question ${
            i + 1
          } of the INSTRUCTOR EVALUATION."`,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      allAnswerArray.push(InstructorQuestions[i].rating);
    }
    for (var i = 0; i < TAquestions.length; i++) {
      if (TAquestions[i].rating == 0) {
        toast({
          description: `Please answer question ${i + 1} of the TA EVALUATION."`,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
      allAnswerArray.push(TAquestions[i].rating);
    }

    for (var i = 0; i < outcomeSurvey.length; i++) {
      console.log(outcomeSurvey[i]);
      if (outcomeSurvey[i].rating == 0 || !outcomeSurvey[i].rating) {
        toast({
          description: `Please respond to ${outcomeSurvey[i].name} of the COURSE OUTCOME EVALUATION."`,
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }
    }
    try {
      const res = await postSurvey(
        courseInformation.courseYear,
        courseInformation.courseTerm,
        euid,
        courseInformation.courseDepartment,
        courseInformation.courseNumber,
        courseInformation.sectionNumber,
        studentInput.additionalFeedback,
        allAnswerArray
      );
      const status = res.status;
      if (status == "SUCCESS") {
        toast({
          description: `Successfully submitted the survey. Thank you!`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        router.push("/surveyLanding");
      } else {
        toast({
          description: `There was an error! Message: ${status} `,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (rating, idx, type) => {
    if (type == "TA") {
      var temp = TAquestions;
      temp[idx].rating = parseInt(rating);
      setTAquestions([...temp]);
      console.log(TAquestions[idx]);
    } else if (type == "Outcomes") {
      var temp = outcomeSurvey;
      outcomeSurvey[idx].rating = parseInt(rating);
      setOutcomeSurvey([...temp]);
      console.log(outcomeSurvey[idx]);
    } else if (type == "Instructor") {
      var temp = InstructorQuestions;
      InstructorQuestions[idx].rating = parseInt(rating);
      setInstructorQuestions([...temp]);
      console.log(outcomeSurvey[idx]);
    } else {
      console.log("incorrect type");
    }
  };

  return (
    <PageContext.Provider value={pageData}>
      <Head>
        <title>UNT Course Feedback Survey</title>
      </Head>
      <Navigation />
      {isLoggedIn ? (
        <VStack mt="2em">
          <Box w="95%">
            <Text fontSize="2xl" fontWeight="bold">
              {courseInformation.courseDepartment +
                " " +
                courseInformation.courseNumber +
                " Section " +
                courseInformation.sectionNumber}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {courseInformation.courseTerm +
                " " +
                courseInformation.courseYear}
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="green">
              Student Feedback Survey
            </Text>
          </Box>
          <Box w={{ base: "120%", sm: "50%", md: "80%" }}>
            <StudentInfoForm
              studentInformation={studentInformation}
              setStudentInformation={setStudentInformation}
            />
          </Box>
          <Box w={{ base: "120%", sm: "50%", md: "80%" }}>
            <CourseOutcomesSurvey
              outcomeSurvey={outcomeSurvey}
              handleChange={handleChange}
            />
          </Box>

          <Box w={{ base: "120%", sm: "50%", md: "80%" }}>
            <InstructorSurvey
              instructorQuestions={InstructorQuestions}
              handleChange={handleChange}
            />
          </Box>

          <Box w={{ base: "120%", sm: "50%", md: "80%" }}>
            <TAsurvey TAquestions={TAquestions} handleChange={handleChange} />
          </Box>
          <Box m="1.0em" w={{ base: "120%", sm: "50%", md: "80%" }}>
            <StudentFeedback
              studentInput={studentInput}
              setStudentInput={setStudentInput}
            />
          </Box>
          <Button onClick={testFunction} mb="1em" colorScheme="green">
            Submit Survey
          </Button>
        </VStack>
      ) : (
        <StudentLoginBox toggleLoggin={toggleLogin} />
      )}
    </PageContext.Provider>
  );
};
export default studentSurvey;
