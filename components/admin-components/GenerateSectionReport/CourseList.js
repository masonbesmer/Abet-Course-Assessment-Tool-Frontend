//import CourseCard from "../../instructor-components/CourseCard";
import { Text, Button, VStack, HStack, Box } from "@chakra-ui/react";
import Link from "next/link";

const CourseList = ({ courses, term }) => {
  console.log("Courses:", courses);
  const renderCourses =
    courses != null ? (
      courses.map((course) => {
        const handleClick = async (course, section) => {
          document.cookie = `course=${course}; path=/`;
          document.cookie = `section=${section}; path=/`;
        };
        return (
          <>
            <Box
              w="100%"
              justifyContent="center"
              background="#edf2f7"
              boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
              borderRadius="5px"
            >
              <VStack id="top" w="100%" m="0 auto" marginBottom="5em">
                <HStack textAlign="center" verticalAlign="center">
                  <Text fontSize="20px" fontWeight="bold">
                    {course.department}
                  </Text>
                  <Text fontSize="20px" fontWeight="bold" color="#38A169">
                    {course.courseNumber}. {course.sectionNumber}
                  </Text>
                  <Text fontSize="20px" fontWeight="bold">
                    {course.displayName}
                  </Text>
                  <Text marginBottom="3em"></Text>
                </HStack>

                {/* <Link href="/formCompletion">
                    {   
                        course.isCourseCompleted ? <Button fontWeight="bold" rightIcon="check" variantColor="teal" mt="1em" isDisabled="true" w="100%" size="sm">Form Complete</Button> : <Button size="sm" variantColor="green" mt="1em" w="100%" size="sm" onClick={
                            alert('test')
                        }>Work On ABET Form</Button>
                    }
                </Link> */}
                <Link
                  href={{
                    pathname: "/report",
                    query: {
                      number: course.courseNumber,
                      section: course.sectionNumber,
                      semester: term.semester,
                      year: term.year,
                    },
                  }}>
                  View Report
                </Link>
              </VStack>
            </Box>
          </>
        );
      })
    ) : (
      <Text>courses not found</Text>
    );
  return <div className="forms-grid">{renderCourses}</div>;
};

export default CourseList;
