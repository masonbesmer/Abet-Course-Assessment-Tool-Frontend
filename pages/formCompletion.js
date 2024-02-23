//imports
import { useEffect, useState, useRef } from "react";
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

//submitconfirmation
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from "@chakra-ui/react";

//api
import {
  GetStudentOutcomesCompleted,
  SetStudentOutcomesCompleted,
  getSection,
  getSectionAssistant,
  getGrades,
  setGrades,
  editComments,
} from "../api/APIHelper";
//components
import GradesInput from "../components/form-components/GradesInput";
import CourseOutcomesMapping from "../components/form-components/CourseOutcomesMapping";
import blankForm from "../components/form-components/blankForm.json";
import CoordinatorGrades from "../components/form-components/CoordinatorGrades"; //used since it's shows the grades as only visible
import CoordinatorOutcomes from "../components/form-components/CoordinatorOutcomes"; //used since it shows the outcomes as only visible
import Navigation from "../components/instructor-components/Navigation";

const formCompletion = ({ number, section, term, year, department }) => {
  const [formSubmitted, setFormSubmitted] = useState(); //sets the form from editable to only visible depending on if the instructor has submitted form.
  const router = useRouter();
  const [gradeForm, setGradeForm] = useState();
  const [outcomeForm, setOutcomeForm] = useState();
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [commentField, setCommentField] = useState(""); // instructor comments textarea-------create way to save
  const [fileInputField, setFileInputField] = useState(); //^^
  const toast = useToast({ position: "top" });
  //------------------------------------needs to be cleaned
  const [instructorID, setInstructorID] = useState(0);
  const [isSectionCompleted, setIsSectionCompleted] = useState(false);
  const [numberOfStudents, setNumberOfStudents] = useState(0);
  //--------------------------------------------

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
      console.log(sectionData);
      // console.log(sectionData.isFormSubmitted);
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
      //---------------Checks if the form has been submitted (if it has make the form only Visible)
      setFormSubmitted(sectionData.isFormSubmitted);
      //----------------Sections orignal data that will NOT change-------needs to be cleaned!!
      setInstructorID(sectionData.instructorEUID);
      setIsSectionCompleted(sectionData.isSectionCompleted);
      setNumberOfStudents(sectionData.numberOfStudents);
      //---------------------------------
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
      console.log(outcomeFormData);
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
    setUnsavedChanges(true);
  };

  const handleOutcomesChange = (major, outcomeName, newValue) => {
    var tempForm = outcomeForm;
    for (var i = 0; i < tempForm.length; i++) {
      if (tempForm[i].outcomeName == outcomeName) {
        tempForm[i][major] = String(newValue);
      }
    }
    setOutcomeForm(tempForm);
    setUnsavedChanges(true);
  };

  const handleCommentFieldChange = (e) => {
    setCommentField(e.target.value);
    setUnsavedChanges(true);
  };

  const handleFileInputChange = (e) => {
    setFileInputField(e.target.value);
    setUnsavedChanges(true);
  };

  useEffect(() => {
    //checks if user has unsaved changes and warns them if they try to leave
    if (!unsavedChanges) return;
    function handleBeforeUnload(event) {
      if (unsavedChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  useEffect(() => {
    getOutcomeForm();
    getGradeForm();
  }, []);

  useEffect(() => {
    getInstructorSectionInformation();
    getAssistantSectionInformation();
    checkUser();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure(); //used to show the confirmation menu when user clicks "submit"
  const cancelRef = useRef();

  const handleSubmit = async (confirmed) => {
    onClose();
    setUnsavedChanges(false);
    console.log(gradeForm, "grades");
    console.log("----------------------");
    console.log(outcomeForm, "outcome");
    console.log("----------------------");
    console.log(formSubmitted, "form is submitted");
    console.log("----------------------");
    try {
      //const res = await setGrades(year,term,department,number,section,form2)
      for (const key in gradeForm) {
        let totalStudentsNum =
          gradeForm[key].a +
          gradeForm[key].b +
          gradeForm[key].c +
          gradeForm[key].d +
          gradeForm[key].f; // counts the total number of students by adding grades for all categories
        console.log(totalStudentsNum, "total students");
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

      const sectionRes = await editSection(
        term,
        year,
        department,
        number,
        section,
        instructorID,
        isSectionCompleted,
        section,
        numberOfStudents,
        true
      );

      const fileUploadRes = null; // APIHelper function that sends the file to the backend

      const sectionStatus = sectionRes.status;
      const gradeStatus = gradeRes.status;
      const outcomeStatus = outcomeRes.status;
      // const fileUploadStatus = fileUploadRes.status;

      // console.log(sectionStatus);
      if (
        gradeStatus == "SUCCESS" &&
        outcomeStatus == "SUCCESS" &&
        sectionStatus == "SUCCESS"
      ) {
        toast({
          description: `Form submitted!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        window.location.reload(); // can change to router.push("/instructorHome") if we want to route them to the homepage instead
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
      } else if (!sectionStatus == "SUCCESS") {
        toast({
          description: `There was an error submitting the form! Error:${sectionStatus}`,
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

  const handleSave = async () => {
    console.log(gradeForm);
    console.log("----------------------");
    console.log(outcomeForm);
    setUnsavedChanges(false);
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

      const commentRes = await editComments(
        term,
        year,
        department,
        number,
        section,
        commentField,
        null
      );

      const fileUploadRes = null; // APIHelper function that sends the file to the backend

      const gradeStatus = gradeRes.status;
      const outcomeStatus = outcomeRes.status;
      const commentStatus = commentRes.status;
      // const fileUploadStatus = fileUploadRes.status;
      if (gradeStatus == "SUCCESS" && outcomeStatus == "SUCCESS" && commentStatus == "SUCCESS") {
        toast({
          description: `Form Saved!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else if (!gradeStatus == "SUCCESS") {
        toast({
          description: `There was an error saving the form! Error:${gradeStatus}`,
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
      } else if (!commentStatus == "SUCCESS") {
        toast({
          description: `There was an error submitting the form! Error:${commentStatus}`,
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
      {console.log(formSubmitted)};
      <Navigation />
      <Center>
        {gradeForm && outcomeForm ? ( //create condition for form
          formSubmitted ? (
            <>
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
                {/** CREATE A WAY TO SAVE THE INSTRUCTORS COMMENTS */}
              </Flex>
            </>
          ) : (
            <>
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
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInputChange}
                />

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
                    colorScheme="blue"
                    w="max-content"
                    marginRight={1}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                  <Button
                    mb="1em"
                    colorScheme="green"
                    w="max-content"
                    onClick={onOpen}
                  >
                    Submit Report
                  </Button>
                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                    motionPreset="slideInBottom"
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Submit Report
                        </AlertDialogHeader>
                        <AlertDialogBody>
                          Are you sure you want to submit? You can not make
                          changes afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme="green"
                            onClick={handleSubmit}
                            ml={3}
                          >
                            Submit
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </Box>
              </Flex>
            </>
          )
        ) : (
          <Flex mt="2em" direction="column" w="90%">
            <Box w="80%">
              <Text fontSize="2xl" fontWeight="bold">
                {department} {number}.{section}
              </Text>

              {outcomeForm ? (
                <Text fontSize="2xl" fontWeight="bold" color="red" mb="2em">
                  Error: gradeForm data could not be retrieved. Contact your
                  admin for help!
                </Text>
              ) : gradeForm ? (
                <Text fontSize="2xl" fontWeight="bold" color="red" mb="2em">
                  No course outcome data could be retrieved for this course.
                  Contact your admin for help!
                </Text>
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color="red" mb="2em">
                  No course outcomes and grades were retrieved for this course.
                  Contact your admin for help!
                </Text>
              )}
            </Box>
          </Flex>
        )}
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
