import { RepeatOneSharp } from "@mui/icons-material";
import API from "./api";

// New Endpoint

export async function Custom() {
  let api_helper = new API();
  let response = await api_helper.Custom();
  return response;
}

// All faculty endpoint
export async function getFacultyList() {
  let api_helper = new API();
  let response = await api_helper.getFacultyList();
  //console.log(response);
  return response;
}

export async function editFacultyUser(lastname, firstname, oldEuid, newEuid) {
  let api_helper = new API();
  let response = await api_helper.editFacultyUser(
    lastname,
    firstname,
    oldEuid,
    newEuid
  );
  console.log(response);
  return response;
}

export async function deleteFacultyUser(euid) {
  let api_helper = new API();
  console.log(euid);
  let response = await api_helper.deleteFacultyUser(euid);
  console.log(response);
  return response;
}

export async function addFacultyMember(lastName, firstName, id, type) {
  let api_helper = new API();
  let response = await api_helper.addFacultyMember(
    firstName,
    lastName,
    id,
    type
  );
  console.log(response);
  return response;
}

// All role endpoint
export async function getUsersByRole(roleName) {
  let api_helper = new API();
  let response = await api_helper.getUsersByRole(roleName);
  return response;
}

export async function addRoleToUser(euid, role) {
  let api_helper = new API();
  let response = await api_helper.addRoleToUser(euid, role);
  return response;
}

export async function removeRoleFromUser(euid, role) {
  let api_helper = new API();
  let response = await api_helper.removeRoleFromUser(euid, role);
  return response;
}

// All semester endpoint
export async function getSemesters() {
  let api_helper = new API();
  let response = await api_helper.getSemesters();
  return response;
}

export async function addNewSemester(year, term) {
  let api_helper = new API();
  let response = await api_helper.addNewSemester(year, term);
  //console.log(response);
  return response;
}

export async function deleteSemester(term, year) {
  let api_helper = new API();
  let response = await api_helper.deleteSemester(term, year);
  return response;
}

// All majors endpoint
export async function getMajors(term, year) {
  let api_helper = new API();
  let response = await api_helper.getMajors(term, year);
  return response;
}

export async function addMajor(name, term, year) {
  let api_helper = new API();
  let response = await api_helper.addMajor(name, term, year);
  return response;
}

export async function deleteMajor(name, term, year) {
  let api_helper = new API();
  let response = await api_helper.deleteMajor(name, term, year);
  return response;
}

//All course endpoint

export async function addNewCourse(
  year,
  term,
  courseID,
  coordinatorEUID,
  courseNumber,
  displayName,
  coordinatorComment,
  isCourseCompleted,
  department
) {
  let api_helper = new API();
  let response = await api_helper.addNewCourse(
    year,
    term,
    courseID,
    coordinatorEUID,
    courseNumber,
    displayName,
    coordinatorComment,
    isCourseCompleted,
    department
  );
  return response;
}

export async function getCoursesByDepartment(term, year, department) {
  let api_helper = new API();
  let response = await api_helper.getCoursesByDepartment(
    term,
    year,
    department
  );
  return response;
}

export async function deleteCourse(
  term = "",
  year = 0,
  department = "",
  courseNumber = ""
) {
  let api_helper = new API();
  let response = await api_helper.deleteCourse(
    term,
    year,
    department,
    courseNumber
  );
  return response;
}

export async function editCourse(
  term = "",
  year = 0,
  department = "",
  courseNumber = "",
  newCoordinatorEUID,
  newCourseNumber,
  newDisplayName,
  newCoordinatorComment,
  newIsCourseComplete,
  newDepartment
) {
  let api_helper = new API();
  let response = await api_helper.editCourse(
    term,
    year,
    department,
    courseNumber,
    newCoordinatorEUID,
    newCourseNumber,
    newDisplayName,
    newCoordinatorComment,
    newIsCourseComplete,
    newDepartment
  );
  return response;
}

export async function getSection(
  term,
  year,
  department,
  courseNumber,
  sectionNumber
) {
  let api_helper = new API();
  let response = await api_helper.getSection(
    term,
    year,
    department,
    courseNumber,
    sectionNumber
  );
  return response;
}

export async function getSectionAssistant(
  assistantEUID,
  term,
  year,
  department,
  courseNumber,
  sectionNumber
) {
  let api_helper = new API();
  let response = await api_helper.getSectionAssistant(
    assistantEUID,
    term,
    year,
    department,
    courseNumber,
    sectionNumber
  );
  return response;
}

export async function getSectionsByCourse(
  term,
  year,
  department,
  courseNumber
) {
  let api_helper = new API();
  let response = await api_helper.getSectionsByCourse(
    term,
    year,
    department,
    courseNumber
  );
  return response;
}

export async function GetSectionsByInstructor(term, year, instructorEUID) {
  let api_helper = new API();
  let response = await api_helper.GetSectionsByInstructor(
    term,
    year,
    instructorEUID
  );
  return response;
}

export async function GetSectionsByAssistant(term, year, assistantEUID) {
  let api_helper = new API();
  let response = await api_helper.getSectionsByAssistant(
    term,
    year,
    assistantEUID
  );
  return response;
}

export async function GetSectionsByCoordinator(term, year, coordinatorEUID) {
  let api_helper = new API();
  let response = await api_helper.GetSectionsByCoordinator(
    term,
    year,
    coordinatorEUID
  );
  return response;
}

export async function addNewSection(
  year,
  term,
  department,
  courseNumber,
  instructorEUID,
  isSectionComplete,
  sectionNumber,
  numberOfStudents
) {
  let api_helper = new API();
  let response = await api_helper.addNewSection(
    year,
    term,
    department,
    courseNumber,
    instructorEUID,
    isSectionComplete,
    sectionNumber,
    numberOfStudents
  );
  return response;
}

export async function deleteSection(
  term,
  year,
  department,
  courseNumber,
  sectionNumber
) {
  let api_helper = new API();
  let response = await api_helper.deleteSection(
    term,
    year,
    department,
    courseNumber,
    sectionNumber
  );
  return response;
}

export async function editSection(
  term,
  year,
  department,
  courseNumber,
  sectionNumber,
  newInstructorEUID,
  newIsSectionCompleted,
  newSectionNumber,
  newNumberOfStudents
) {
  let api_helper = new API();
  let response = await api_helper.editSection(
    term,
    year,
    department,
    courseNumber,
    sectionNumber,
    newInstructorEUID,
    newIsSectionCompleted,
    newSectionNumber,
    newNumberOfStudents
  );
  return response;
}

//All outcome endpoint
export async function assignCourseToMajor(
  year,
  term,
  department,
  courseNumber,
  major
) {
  let api_helper = new API();
  let response = await api_helper.assignCourseToMajor(
    year,
    term,
    department,
    courseNumber,
    major
  );
  return response;
}

export async function deleteCourseAssignedToMajor(
  term,
  year,
  department,
  courseNumber,
  major
) {
  let api_helper = new API();
  let response = await api_helper.deleteCourseAssignedToMajor(
    term,
    year,
    department,
    courseNumber,
    major
  );
  return response;
}

export async function addNewOutcomeToMajor(
  year,
  term,
  majorName,
  outcomeName,
  outcomeDescription
) {
  let api_helper = new API();
  let response = await api_helper.addNewOutcomeToMajor(
    year,
    term,
    majorName,
    outcomeName,
    outcomeDescription
  );
  return response;
}

export async function deleteOutcomeFromMajor(
  year,
  term,
  majorName,
  outcomeName
) {
  let api_helper = new API();
  let response = await api_helper.deleteOutcomeFromMajor(
    year,
    term,
    majorName,
    outcomeName
  );
  return response;
}

export async function editOutcomeForMajor(
  term,
  year,
  majorName,
  oldOutcomeName,
  newOutcomename,
  newDescription
) {
  let api_helper = new API();
  let response = await api_helper.editOutcomeForMajor(
    term,
    year,
    majorName,
    oldOutcomeName,
    newOutcomename,
    newDescription
  );
  return response;
}

export async function getCourseOutcome(year, term, department, courseNumber) {
  let api_helper = new API();
  let response = await api_helper.getCourseOutcome(
    year,
    term,
    department,
    courseNumber
  );
  return response;
}

export async function GetLinkedMajorOutcomes(
  year,
  term,
  department,
  courseNumber,
  courseOutcomeName,
  major
) {
  let api_helper = new API();
  let response = await api_helper.GetLinkedMajorOutcomes(
    year,
    term,
    department,
    courseNumber,
    courseOutcomeName,
    major
  );
  return response;
}

export async function LinkToMajorOutcome(
  year,
  term,
  department,
  courseNumber,
  courseOutcomeName,
  majorName,
  majorOutcomeName
) {
  let api_helper = new API();
  let response = await api_helper.LinkToMajorOutcome(
    year,
    term,
    department,
    courseNumber,
    courseOutcomeName,
    majorName,
    majorOutcomeName
  );
  return response;
}

export async function RemoveLinkToMajorOutcome(
  year,
  term,
  department,
  courseNumber,
  courseOutcomeName,
  majorName,
  majorOutcomeName
) {
  let api_helper = new API();
  let response = await api_helper.RemoveLinkToMajorOutcome(
    year,
    term,
    department,
    courseNumber,
    courseOutcomeName,
    majorName,
    majorOutcomeName
  );
  return response;
}

export async function addNewCourseOutcome(
  year,
  term,
  department,
  courseNumber,
  outcomeName,
  outcomeDescription
) {
  let api_helper = new API();
  let response = await api_helper.addNewCourseOutcome(
    year,
    term,
    department,
    courseNumber,
    outcomeName,
    outcomeDescription
  );
  return response;
}

export async function deleteCourseOutcome(
  year,
  term,
  department,
  courseNumber,
  outcomeName
) {
  let api_helper = new API();
  let response = await api_helper.deleteCourseOutcome(
    year,
    term,
    department,
    courseNumber,
    outcomeName
  );
  return response;
}

export async function getMajorOutcomesBymajor(year, term, majorName) {
  let api_helper = new API();
  let response = await api_helper.getMajorOutcomesBymajor(
    year,
    term,
    majorName
  );
  return response;
}

export async function getOutcomesByCourse(
  year,
  term,
  department,
  courseNumber
) {
  let api_helper = new API();
  let response = await api_helper.getOutcomesByCourse(
    year,
    term,
    department,
    courseNumber
  );
  return response;
}

//All survey endpoint

export async function getQuestionSet(year, term, questionSetName) {
  let api_helper = new API();
  let response = await api_helper.getQuestionSet(year, term, questionSetName);
  return response;
}

export async function getQuestions(year, term) {
  let api_helper = new API();
  let response = await api_helper.getQuestions(year, term);
  return response;
}

export async function saveQuestions(year, term, questionSet, questions) {
  let api_helper = new API();
  let response = await api_helper.saveQuestions(
    year,
    term,
    questionSet,
    questions
  );
  return response;
}

export async function postSurvey(
  year,
  term,
  euid,
  department,
  courseNumber,
  sectionNumber,
  additionalComments,
  answers
) {
  let api_helper = new API();
  let response = await api_helper.postSurvey(
    year,
    term,
    euid,
    department,
    courseNumber,
    sectionNumber,
    additionalComments,
    answers
  );
  return response;
}

export async function getGrades(
  year,
  term,
  department,
  courseNumber,
  sectionNumber
) {
  let api_helper = new API();
  let response = await api_helper.getGrades(
    year,
    term,
    department,
    courseNumber,
    sectionNumber
  );
  return response;
}

export async function setGrades(
  year,
  term,
  department,
  courseNumber,
  sectionNumber,
  gradesArray
) {
  let api_helper = new API();
  let response = await api_helper.setGrades(
    year,
    term,
    department,
    courseNumber,
    sectionNumber,
    gradesArray
  );
  return response;
}

export async function GetStudentOutcomesCompleted(
  year,
  term,
  department,
  courseNumber,
  sectionNumber
) {
  let api_helper = new API();
  let response = await api_helper.GetStudentOutcomesCompleted(
    year,
    term,
    department,
    courseNumber,
    sectionNumber
  );
  return response;
}

export async function SetStudentOutcomesCompleted(
  year,
  term,
  department,
  courseNumber,
  sectionNumber,
  courseOutcomeObject
) {
  let api_helper = new API();
  let response = await api_helper.SetStudentOutcomesCompleted(
    year,
    term,
    department,
    courseNumber,
    sectionNumber,
    courseOutcomeObject
  );
  return response;
}

export async function GenerateFullReport(year, term) {
  let api_helper = new API();
  let response = await api_helper.GenerateFullReport(year, term);
  return response;
}

// Old Endpoint
//
//
//
//
//
//

export function getCourses() {
  return courses;
}

export async function getInstructorCourses(id, term) {
  let api_helper = new API();
  let response = api_helper.getCourses(id, term.semester, term.year);

  response.then(function (result) {
    return result;
  });

  const instructorCourses = await response;
  instructorCourses.filter((course) => course.instructor.id === id);
  return instructorCourses;
}
export async function getCoordinatorCourses(id, term) {
  let api_helper = new API();
  let response = api_helper.getCourses(id, term.semester, term.year);

  response.then(function (result) {
    return result;
  });

  const coordinatorCourses = await response;
  coordinatorCourses.filter((course) => course.coordinator.id === id);
  return coordinatorCourses;
}

export async function getFormBySection(
  id,
  year,
  semester,
  department,
  course,
  section
) {
  let api_helper = new API();
  let response = api_helper.getFormBySection(
    id,
    year,
    semester,
    department,
    course,
    section
  );
  response.then(function (result) {
    return result;
  });
  const formData = await response;
  return formData;
}

export async function postCoordinatorComment(
  userid,
  year,
  semester,
  department,
  courseNumber,
  coordinatorComment,
  isCourseCompleted
) {
  let api_helper = new API();
  let response = api_helper.postComment(
    userid,
    year,
    semester,
    department,
    courseNumber,
    coordinatorComment,
    isCourseCompleted
  );
  response.then(function (result) {
    return result;
  });
  const success = await response;
  console.log(success);
}

export async function postInstructorForm(
  userid,
  year,
  semester,
  department,
  courseNumber,
  sectionNumber,
  isSectionCompleted,
  outcomes,
  ITGrades,
  CSGrades,
  CEGrades,
  CGrades
) {
  let api_helper = new API();
  let response = api_helper.postForm(
    userid,
    year,
    semester,
    department,
    courseNumber,
    sectionNumber,
    isSectionCompleted,
    outcomes,
    ITGrades,
    CSGrades,
    CEGrades,
    CGrades
  );
  response.then(function (result) {
    return result;
  });
  const success = await response;
  console.log(success);
}

export async function login(userid, password) {
  const api_helper = new API(); // create a new instance of the API helper class
  const response = api_helper.login(userid, password); // call the login method
  console.log(response); // print the response to the console
  return response.then((result) => {
    return result;
  });
}

export async function getAllCourses(userid, semester, year) {
  console.log(userid, semester, year);
  const api_helper = new API();
  const response = api_helper.getCourses(userid, semester, year);
  response.then((result) => {
    return result;
  });
  const courses = await response;
  console.log(courses);
  return courses;
}

/* export async function getCoursesByDepartment(department) {
  let api_helper = new API();
  let response = api_helper.getCoursesByDepartment(department);
  response.then(function (result) {
    return result;
  });
  const courses = await response;
  return courses;
} */

export async function addCourse(
  userid = "",
  firstName = "",
  lastName = "",
  year = 0,
  semester = "",
  courseNumber = 0,
  displayName = "",
  department = ""
) {
  let api_helper = new API();
  let response = api_helper.addCourse(
    userid,
    firstName,
    lastName,
    year,
    semester,
    courseNumber,
    displayName,
    department
  );
  response.then(function (result) {
    return result;
  });
  const success = await response;
  console.log(success);
}
export async function removeCourse(year, semester, courseNumber, department) {
  let api_helper = new API();
  let response = api_helper.removeCourse(
    year,
    semester,
    courseNumber,
    department
  );
  response.then(function (result) {
    return result;
  });
  const success = await response;
  console.log(success);
  console.log(courseNumber);
}

export async function postCourseOutcomes() {}

export async function addProgram(program) {
  let api_helper = new API();
  let response = api_helper.addProgram(program);
  response.then(function (result) {
    return result;
  });

  const success = await response;
  console.log(success);
}

export async function postStudentSurvey(
  courseNumber = "",
  sectionNumber = "",
  year = 0,
  semester = "",
  program = "",
  classification = "",
  anticipatedGrade = "",
  outcomeRatings = [new Number()],
  taRatings = [new Number()],
  taComment = "",
  courseComment = ""
) {
  let api_helper = new API();
  let response = api_helper.postStudentSurvey(
    studentId,
    courseNumber,
    sectionNumber,
    year,
    semester,
    program,
    classification,
    anticipatedGrade,
    outcomeRatings,
    taRatings,
    taComment,
    courseComment
  );
  response.then(function (result) {
    return result;
  });

  const success = await response;
  console.log(success);
}
