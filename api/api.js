// Helper API Class
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";
const axios = require("axios");

const root = "https://localhost:44372/api"; // The base URL for each request
const rootNew = "https://localhost:44372"; // The base URL for each request

const OK = 200; //200 Ok status code
const UNAUTHORIZED = 401; //401 Unauthorized status code
const FORBIDDEN = 403; //403 Unauthorized status code
const NOT_LOGGED_IN_MSG =
  "Error: Your session has expired. Please log in again.";
const SERVER_ERROR_MSG = "Internal Server Error: Please try again later.";
const BAD_REQUEST_MSG = "Error: Some of the provided parameters are invalid.";
const FORBIDDEN_MSG = "Error: You are unauthorized to make this request.";
var token = ""; //holds value of the token cookie
const config = { headers: { Authorization: '' } }; //adds authorization header for axios (might not be needed)

export default class API {
    // default constructor. only thing that is needed is to get the token from cookie.
    // Previous group has it set up to great a new api everytime a request is made.
    // Therefore we need to get the token everytime.
    constructor() {
        token = cookieCutter.get("token");
    }

  /* This function is for getInitialProps.
    cookieCutter is undefined in getInitialProps,
    so this function sets the token to the value of the cookie
    passed in from getInitialProps. */
    // this might be doing nothing now that we get token properly.
  setToken(t = "") {
    token = t;
  }

  checkStatus(status) {
    //console.log(status);
    switch (status) {
      case 200:
        return "Success";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "UNAUTHORIZED";
      case "Request failed with status code 401":
        return "UNAUTHORIZED";
      default:
        console.log(`Unknown status code from request:${status}`);
        return status;
    }
  }
  //***New End Point***

  //---login(userid, password)---
  //    Input: UserId, Password
  //    Output: "Admin", "Instructor", "Student/TA" or boolean for failure
  async login(userid = "", password = "") {
    const url = rootNew + `/Login`;
    try {
      var response = await axios.post(url, {
        euid: userid,
        password: password,
      });
      //console.log(response.data);
      if (response.data.hasOwnProperty("token")) {
        let token = response.data.token;
        //console.log(token);
        var expires = new Date();
        expires.setHours(expires.getHours() + 24); //expires in 24 hours
        expires = expires.toUTCString();
        cookieCutter.set("token", token, { expires }); //set token cookie
        const json = jwt.decode(token);
        //console.log(json);
        return json["role"]; //return the role
      }
    } catch (error) {
      console.error(error);
    }
  }

  //---Custom()---
  //    Input:
  //    Output:
  // For development, populated the database.
  async Custom() {
    const url = rootNew + "/Custom";
    console.log(url);
      try {
      // so axios is what sends the http header request to the backend. it needs to have the token sent
      // for authorization everytime. that is what the extra header is now.
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  //---getFacultyList()--- (Admin)
  //    Input: none
  //    Output: List of admins, instructors, coordinators
  async getFacultyList() {
    const url = rootNew + "/Role/GetFaculty";
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        //console.log(response);
        //console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getUsersByRole()--- (Admin)
  //    Input: role name
  //    Output: List of faculty members with that role
  async getUsersByRole(roleName) {
    const url = rootNew + `/Role/GetUsersByRole?roleName=${roleName}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        //console.log(response);
        //console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---AddRoleToUser()--- (Admin)
  //    Input: euid, role
  //    Output: success or failure
  async addRoleToUser(euid, role) {
    const url = rootNew + `/Role/AddRoleToUser?EUID=${euid}&roleName=${role}`;
    try {
        const response = await axios.post(url, {}, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---removeRoleFromUser()--- (Admin)
  //    Input: EUID, role
  //    Output: success or failure
  async removeRoleFromUser(euid, role) {
    const url =
      rootNew + `/Role/RemoveRoleFromUser?EUID=${euid}&roleName=${role}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      console.log(response);
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---editFacultyUser()--- (Admin)
  //    Input: First name, last name, EUID
  //    Output: success or failure
  async editFacultyUser(
    Firstname = "",
    Lastname = "",
    oldEuid = "",
    newEuid = ""
  ) {
    const url = rootNew + `/Users/EditUser/?EUID=${oldEuid}`;
    try {
      const response = await axios.patch(url, {
        firstName: Firstname,
        lastName: Lastname,
        euid: newEuid,
      },
          { headers: { 'Authorization': 'bearer ' + token } }      );
      console.log(response);

      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteFacultyUser()--- (Admin)
  //    Input: EUID
  //    Output: success or failure
  async deleteFacultyUser(Euid = "") {
    const url = rootNew + "/Users/DeleteUser";
    try {
        const response = await axios.delete(url, { params: { EUID: Euid } }, { headers: { 'Authorization': 'bearer ' + token } });
      console.log(response);
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---addFacultyMember(firstName, lastName, userid, role)--- (Admin)
  //    Input: First Name, Last Name and User Id
  //    Output: Success or Failure
  async addFacultyMember(
    firstName = "",
    lastName = "",
    userId = "",
    facultyType = ""
  ) {
    const url = rootNew + "/Users/AddUserWithRoles";
    const body = {
      user: {
        firstName: firstName,
        lastName: lastName,
        euid: userId,
      },
      roles: [facultyType],
    };
    try {
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        console.log(response);
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      console.error(status);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getSemesters()--- (Admin)
  //    Input: none
  //    Output: List of semesters
  async getSemesters() {
    const url = rootNew + "/Semester/GetSemesters";
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        //console.log(response);
        //console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---addNewSemester()--- (Admin)
  //    Input: year, term
  //    Output: Success or error message
  async addNewSemester(year = 0, term = "") {
    const url = rootNew + "/Semester/AddSemester";
    const body = {
      year: year,
      term: term,
    };
    try {
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        //console.log(response);
        //console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteSemester()--- (Admin)
  //    Input: term & year
  //    Output: success or failure
  async deleteSemester(term = "", year = 0) {
    //console.log(`term: ${term} year: ${year}`);
    const url = rootNew + "/Semester/DeleteSemester";
    try {
      const response = await axios.delete(url, {
        data: { year: year, term: term },
      },
          { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        //console.log(response);
        //console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getMajors()--- (Admin)
  //    Input: term & year
  //    Output: return a list of major of that semester
  async getMajors(term, year) {
    const url = rootNew + `/Major/GetMajors?term=${term}&year=${year}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---addMajor()--- (Admin)
  //    Input: major name, term & year
  //    Output: success or failure
  async addMajor(majorName, term, year) {
    const url =
      rootNew + `/Major/AddMajor?term=${term}&year=${year}&name=${majorName}`;
    try {
        var response = await axios.post(url, {}, {headers: { 'Authorization': 'bearer ' + token }});
      if (response) {
        let status = this.checkStatus(response.status);
        console.log(response);
        console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteMajor()--- (Admin)
  //    Input: majorName, term & year
  //    Output: success or failure
  async deleteMajor(majorName = "", term = "", year = 0) {
    const url =
      rootNew +
      `/Major/DeleteMajor?term=${term}&year=${year}&name=${majorName}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        console.log(response);
        console.log(`status: ${status}`);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      console.error(status);
      return status;
    }
  }

  //All courses endpoint
  //---getCoursesByDepartment(term,year,department)--- (Admin)
  //    Input: term, year, department
  //    Output: the list of course along with request status
  async getCoursesByDepartment(term, year, department) {
    const url =
      rootNew +
      `/Course/GetCoursesByDepartment?term=${term}&year=${year}&department=${department}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---addNewCourse()--- (Admin)
  //    Input: year, term, courseID, coordinatorEUID, courseNumber, displayName, coordinatorComment, isCourseCompleted, department
  //    Output: success or failure
  async addNewCourse(
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
    const url = rootNew + `/Course/AddCourse?term=${term}&year=${year}`;
    const body = {
      courseId: courseID,
      coordinatorEUID: coordinatorEUID,
      courseNumber: courseNumber,
      displayName: displayName,
      coordinatorComment: coordinatorComment,
      isCourseCompleted: isCourseCompleted,
      department: department,
    };
    try {
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteCourse()--- (Admin)
  //    Input: term, year, department, course number
  //    Output: success or failure
  async deleteCourse(term = "", year = 0, department = "", courseNumber = "") {
    const url =
      rootNew +
      `/Course/DeleteCourse?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---EditCourse()--- (Admin)
  //    Input: term, year, department, course number, newCoordinatorEUID, newCourseNumber, newDisplayName, newCoordinatorComment, newIsCourseComplete, newDepartment
  //    Output: success or failure
  async editCourse(
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
    const url =
      rootNew +
      `/Course/EditCourse?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    console.log(
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
    try {
      const response = await axios.patch(url, {
        coordinatorEUID: newCoordinatorEUID,
        courseNumber: newCourseNumber,
        displayName: newDisplayName,
        coordinatorComment: newCoordinatorComment,
        isCourseCompleted: newIsCourseComplete,
        department: newDepartment,
      },
          { headers: { 'Authorization': 'bearer ' + token } }      );
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //Sections Endpoint

  //---getSection()--- (Admin)
  //    Input: term, year, department, courseNumber, sectionNumber
  //    Output: List of faculty members with that role
  async getSection(term, year, department, courseNumber, sectionNumber) {
    const url =
      rootNew +
      `/Section/GetSection?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getSectionsByCourse()--- (Admin)
  //    Input: term, year, department, courseNumber
  //    Output: List of sections within a course
  async getSectionsByCourse(term, year, department, courseNumber) {
    const url =
      rootNew +
      `/Course/GetSectionsByCourse?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---GetSectionsByInstructor()--- (Admin)
  //    Input: term, year, department, courseNumber
  //    Output: List of sections that are assigned to an instructor
  async GetSectionsByInstructor(term, year, instructorEUID) {
    const url =
      rootNew +
      `/Section/GetSectionsByInstructor?term=${term}&year=${year}&instructorEUID=${instructorEUID}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---GetSectionsByCoordinator()--- (Admin)
  //    Input: term, year, department, courseNumber
  //    Output: List of sections that are assigned to an coordinator
  async GetSectionsByCoordinator(term, year, coordinatorEUID) {
    const url =
      rootNew +
      `/Course/GetCoursesByCoordinator?term=${term}&year=${year}&coordinatorEUID=${coordinatorEUID}`;
    try {
      var response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }


  //---addNewSection()--- (Admin)
  //    Input: year, term, department, courseNumber, instructorEUID, isSectionComplete, sectionNumber, numberOfStudents
  //    Output: success or failure
  async addNewSection(
    year,
    term,
    department,
    courseNumber,
    instructorEUID,
    isSectionComplete,
    sectionNumber,
    numberOfStudents
  ) {
    const url =
      rootNew +
      `/Section/AddSection?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    const body = {
      sectionId: 0,
      instructorEUID: instructorEUID,
      isSectionCompleted: isSectionComplete,
      sectionNumber: sectionNumber,
      numberOfStudents: numberOfStudents,
    };
    try {
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteSection()--- (Admin)
  //    Input: term, year, department, course number, sectionNumber
  //    Output: success or failure
  async deleteSection(term, year, department, courseNumber, sectionNumber) {
    const url =
      rootNew +
      `/Section/DeleteSection?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---editSection()--- (Admin)
  //    Input: term, year, department, course number, newCoordinatorEUID, newDisplayName, newCoordinatorComment, newIsCourseComplete, newDepartment
  //    Output: success or failure
  async editSection(
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
    const url =
      rootNew +
      `/Section/EditSection?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;
    try {
      const response = await axios.patch(url, {
        instructorEUID: newInstructorEUID,
        isSectionCompleted: newIsSectionCompleted,
        sectionNumber: newSectionNumber,
        numberOfStudents: newNumberOfStudents,
      },
          { headers: { 'Authorization': 'bearer ' + token } }      );
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //Outcome

  //---assignCourseToMajor()--- (Admin)
  //    Input: year,term,department,courseNumber,major
  //    Output: success or failure
  async assignCourseToMajor(year, term, department, courseNumber, major) {
    const url =
      rootNew +
      `/CourseOutcome/addCourseOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    const body = {
      courseOutcomeId: 0,
      major: major,
    };
    try {
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteCourseAssignedToMajor()--- (Admin)
  //    Input: term, year, department, course number, major
  //    Output: success or failure
  async deleteCourseAssignedToMajor(
    term,
    year,
    department,
    courseNumber,
    major
  ) {
    const url =
      rootNew +
      `/CourseOutcome/DeleteCourseOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&majorName=${major}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---addNewOutcomeToMajor()--- (Admin)
  //    Input: year,term,majorName,outcome Name, outcome Description
  //    Output: success or failure
  async addNewOutcomeToMajor(
    year,
    term,
    majorName,
    outcomeName,
    outcomeDescription
  ) {
    const url =
      rootNew +
      `/MajorOutcome/AddMajorOutcome?term=${term}&year=${year}&majorName=${majorName}`;
    const body = {
      majorOutcomeId: 0,
      name: outcomeName,
      description: outcomeDescription,
    };
    try {
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteOutcomeFromMajor()--- (Admin)
  //    Input: year,term,majorName,outcome Name
  //    Output: success or failure
  async deleteOutcomeFromMajor(year, term, majorName, outcomeName) {
    const url =
      rootNew +
      `/MajorOutcome/DeleteMajorOutcome?term=${term}&year=${year}&majorName=${majorName}&outcomeName=${outcomeName}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---editSection()--- (Admin)
  //    Input: term, year, major name, old outcome name
  //    Output: success or failure
  async editOutcomeForMajor(
    term,
    year,
    majorName,
    oldOutcomeName,
    newOutcomename,
    newDescription
  ) {
    const url =
      rootNew +
      `/majorOutcome/EditMajorOutcome?term=${term}&year=${year}&majorName=${majorName}&outcomeName=${oldOutcomeName}`;
    try {
      const response = await axios.patch(url, {
        name: newOutcomename,
        description: newDescription,
      },
          { headers: { 'Authorization': 'bearer ' + token } }      );
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getCourseOutcome()--- (Admin)
  //    Input: year,term, department,courseNumber
  //    Output: success or failure
  async getCourseOutcome(year, term, department, courseNumber) {
    const url =
      rootNew +
      `/CourseOutcome/GetCourseOutcomes?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---addOutcomeToCourse()--- (Admin)
  //    Input: year,term,department,courseNumber ,outcomName, outcomeDescription
  //    Output: success or failure
  async addNewCourseOutcome(
    year,
    term,
    department,
    courseNumber,
    outcomeName,
    outcomeDescription
  ) {
    const url =
      rootNew +
      `/CourseOutcome/addCourseOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      const body = {
        name: outcomeName,
        description: outcomeDescription,
      };
        const response = await axios.post(url, body, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---deleteOutcomeFromMajor()--- (Admin)
  //    Input: year,term,department,courseNumber,major,outcomName
  //    Output: success or failure
  async deleteCourseOutcome(year, term, department, courseNumber, outcomeName) {
    const url =
      rootNew +
      `/CourseOutcome/DeleteCourseOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&name=${outcomeName}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);

        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---GetLinkedMajorOutcomes()--- (Admin)
  //    Input: year,term,department,courseNumber,courseOutcomeName
  //    Output: success or failure
  async GetLinkedMajorOutcomes(
    year,
    term,
    department,
    courseNumber,
    courseOutcomeName,
    major
  ) {
    const url =
      rootNew +
      `/CourseOutcome/GetLinkedMajorOutcomes?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&courseOutcomeName=${courseOutcomeName}&majorName=${major}`;
    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---LinkToMajorOutcome()--- (Admin)
  //    Input: year,term,department,courseNumber,courseOutcomeName, majorName, majorOutcomeName
  //    Output: success or failure
  async LinkToMajorOutcome(
    year,
    term,
    department,
    courseNumber,
    courseOutcomeName,
    majorName,
    majorOutcomeName
  ) {
    const url =
      rootNew +
      `/CourseOutcome/LinkToMajorOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&courseOutcomeName=${courseOutcomeName}&majorName=${majorName}&majorOutcomeName=${majorOutcomeName}`;
    try {
        const response = await axios.post(url, {}, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---RemoveLinkToMajorOutcome()--- (Admin)
  //    Input: year,term,department,courseNumber,courseOutcomeName, majorName, majorOutcomeName
  //    Output: success or failure
  async RemoveLinkToMajorOutcome(
    year,
    term,
    department,
    courseNumber,
    courseOutcomeName,
    majorName,
    majorOutcomeName
  ) {
    const url =
      rootNew +
      `/CourseOutcome/RemoveLinkToMajorOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&courseOutcomeName=${courseOutcomeName}&majorName=${majorName}&majorOutcomeName=${majorOutcomeName}`;
    try {
        const response = await axios.delete(url, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getMajorOutcomesBymajor()--- (Admin)
  //    Input: year,term, major name
  //    Output: success or failure
  async getMajorOutcomesBymajor(year, term, majorName) {
    const url =
      rootNew +
      `/Major/GetMajorOutcomesByMajor?term=${term}&year=${year}&majorName=${majorName}`;
    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---getMajorOutcomesBymajor()--- (Admin)
  //    Input: year,term, major name
  //    Output: success or failure
  async getOutcomesByCourse(year, term, department, courseNumber) {
    const url =
      rootNew +
      `/Course/GetMajorOutcomesSatisfied?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  // Survey

  //---getQuestionSet()--- (Admin)
  //    Input: year,term, major name
  //    Output: a list of questions belong to that question set
  async getQuestionSet(year, term, questionSetName) {
    const url =
      rootNew +
      `/Survey/GetQuestionSet?term=${term}&year=${year}&questionSetName=${questionSetName}`;
    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---GetQuestion()--- (Admin)
  //    Input: year,term,
  //    Output: a list of all questions
  async getQuestions(year, term) {
    const url = rootNew + `/Survey/GetQuestions?term=${term}&year=${year}`;
    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---saveQuestions()--- (Admin)
  //    Input: year,term, questionSet, questions
  //    Output: success or failure
  async saveQuestions(year, term, questionSet, questions) {
    const url =
      rootNew +
      `/Survey/SaveQuestions?term=${term}&year=${year}&questionSetName=${questionSet}`;
    const body = {
      questions,
    };
    try {
        const response = await axios.post(url, questions, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---postSurvey()--- (student)
  //    Input: year,term, euid,department,courseNumber,sectionNumber,additionalComments,answers
  //    Output: success or failure
  async postSurvey(
    year,
    term,
    euid,
    department,
    courseNumber,
    sectionNumber,
    additionalComments,
    answers
  ) {
    const url =
      rootNew +
      `/Survey/PostSurvey?EUID=${euid}&term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}&additionalComments=${additionalComments}`;

    try {
        const response = await axios.post(url, answers, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //Instructor and Coordinator Form

  //---GetGrades()--- (Instructor)
  //    Input: year, term, department, courseNumber, sectionNumber
  //    Output: the grades object of a course
  async getGrades(year, term, department, courseNumber, sectionNumber) {
    const url =
      rootNew +
      `/Grade/GetGrades?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;

    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---setGrades()--- (Instructor)
  //    Input: year, term, department, courseNumber, sectionNumber,gradesArray
  //    Output: success or failure
  async setGrades(
    year,
    term,
    department,
    courseNumber,
    sectionNumber,
    gradesArray
  ) {
    const url =
      rootNew +
      `/Grade/SetGrades?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;

    try {
        const response = await axios.post(url, gradesArray, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---GetStudentOutcomesCompleted()--- (Instructor)
  //    Input: year, term, department, courseNumber, sectionNumber
  //    Output: return the course outcome object of a course
  async GetStudentOutcomesCompleted(
    year,
    term,
    department,
    courseNumber,
    sectionNumber
  ) {
    const url =
      rootNew +
      `/StudentOutcomesCompleted/GetStudentOutcomesCompleted?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;

    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  //---SetStudentOutcomesCompleted()--- (student)
  //    Input: year, term, department, courseNumber, sectionNumber
  //    Output: success or failure
  async SetStudentOutcomesCompleted(
    year,
    term,
    department,
    courseNumber,
    sectionNumber,
    courseOutcomeObject
  ) {
    const url =
      rootNew +
      `/StudentOutcomesCompleted/SetStudentOutcomesCompleted?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;

    try {
        const response = await axios.post(url, courseOutcomeObject, { headers: { 'Authorization': 'bearer ' + token } });
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  // Full Report EndPoint

  //---GenerateFullReport()--- (Instructor)
  //    Input: year, term, department, courseNumber, sectionNumber
  //    Output: The data of all the courses within a semester and major
  async GenerateFullReport(year, term) {
    const url = rootNew + `/GenerateFullReport?term=${term}&year=${year}`;

    try {
      const response = await axios.get(url, {headers: {'Authorization': 'bearer '+token}});
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      let status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  // Old End Point
  // generic function for sending POST requests
  //    Input: route and body
  //    Output: The JSON that is returned from the route
  async sendPost(route = "", body = {}, isFileDownload = false, fileName = "") {
    const url = root + route; // Combine the root URL with the specified route
    var statusCode; //holds the status code of the response

    //if the request is not from getInitialProps, meaning cookieCutter is defined, retreive the cookie
    if (typeof cookieCutter.get == "function") {
      token = cookieCutter.get("token");
    }

    return await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(body),
    })
      .then((response) => {
        statusCode = response.status;

        if (statusCode == UNAUTHORIZED)
          //this check has to be here for some reason ¯\_(ツ)_/¯
          return;

        if (isFileDownload) return response.blob();
        else return response.json();
      })
      .then((json) => {
        if (statusCode == OK) {
          if (isFileDownload) {
            //download the responded file
            var a = document.createElement("a");

            a.href = URL.createObjectURL(json);
            a.setAttribute("download", fileName);
            a.click();
            return;
          } else return json;
        } else if (statusCode == UNAUTHORIZED)
          return new ErrorObj(NOT_LOGGED_IN_MSG, false);
        //user's session has expired
        else if (statusCode == FORBIDDEN) return new ErrorObj(FORBIDDEN_MSG);
        else {
          if (json.hasOwnProperty("message"))
            return new ErrorObj(json["message"]);
          //custom error message from API
          else return new ErrorObj(BAD_REQUEST_MSG); //default bad input parameters message
        }
      })
      .catch(() => {
        if (statusCode == FORBIDDEN) return new ErrorObj(FORBIDDEN_MSG);
        else return new ErrorObj(SERVER_ERROR_MSG);
      });
  }

  async sendFile(route = "", formData = new FormData()) {
    const url = root + route; // Combine the root URL with the specified route
    var statusCode; //holds the status code of the response

    return await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        statusCode = response.status;

        if (statusCode == UNAUTHORIZED)
          //this check has to be here for some reason ¯\_(ツ)_/¯
          return;

        return response.json();
      })
      .then((json) => {
        if (statusCode == OK) return json;
        else if (statusCode == UNAUTHORIZED)
          return new ErrorObj(NOT_LOGGED_IN_MSG, false);
        //user's session has expired
        else if (statusCode == FORBIDDEN) return new ErrorObj(FORBIDDEN_MSG);
        else {
          if (json.hasOwnProperty("message"))
            return new ErrorObj(json["message"]);
          //custom error message from API
          else return new ErrorObj(BAD_REQUEST_MSG); //default bad input parameters message
        }
      })
      .catch(() => {
        if (statusCode == FORBIDDEN) return new ErrorObj(FORBIDDEN_MSG);
        else return new ErrorObj(SERVER_ERROR_MSG);
      });
  }

  //---logout(userid)---
  //    Input: None
  //    Output: None
  logout() {
    cookieCutter.set("token", "", { expires: new Date().toUTCString() });
    cookieCutter.set("user", "", { expires: new Date().toUTCString() });
  }

  //---getCourses(userid, semester, year)---
  //    Input: UserId, Semester, Year
  //    Output: Sections for the corresponding UserId, Semester and Year
  async getCourses(userid = "", semester = "", year = 0) {
    const body = { userid: userid, semester: semester, year: year };

    return await this.sendPost("/sections/by-userid-semester-year", body);

    //To use this data you must do the following:
    //api.getCourses(userId, semester, year).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})
  }

  //---getAllCourses(userid, semester, year)---  (Admin)
  //    Input: UserId, Semester, Year
  //    Output: Sections for the corresponding Semester and Year
  async getAllCourses(userid = "", semester = "", year = 0) {
    const body = { Userid: userid, Semester: semester, Year: year };

    return await this.sendPost("/sections/by-semester-year", body);

    //To use this data you must do the following:
    //api.getAllCourses(userid, semester, year).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})
  }
  //---getCoursesBySemesterYear(semester, year)---  (Admin)
  //    Input: Semester, Year
  //    Output: All Courses for the corresponding semester and year
  async getCoursesBySemesterYear(semester = "", year = 0) {
    const body = {
      semester: semester,
      year: year,
    };

    return await this.sendPost("/courses/get-by-year-semester", body);
  }
  //To use this data you must do the following:
  //api.getCoursesBySemesterYear(semester, year).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})

  //---getFormsBySection(userid, year, semester, department, course, section)---
  //    Input: UserId, Year, Semester, Department, CourseNumber, SectionNumber
  //    Output: Forms for the corresponding UserId, Year, Semester, Department, CourseNumber, and SectionNumber
  async getFormBySection(
    userid = "",
    year = 0,
    semester = "",
    department = "",
    courseNumber = "",
    sectionNumber = ""
  ) {
    const body = {
      Section: {
        Instructor: {
          Id: userid,
        },
        Year: year,
        Semester: semester,
        Department: department,
        CourseNumber: courseNumber,
        SectionNumber: sectionNumber,
      },
    };

    return await this.sendPost("/forms/by-section", body);

    //To use this data you must do the following:
    //api.getFormsBySection(userid, year, semester, department, course, section).then(form => {/*here is where the data is accessible, form is an array of JSON objects*/})
  }

  //---getFormsByCourse(userid, year, semester, department, course)---
  //    Input: UserId, Year, Semester, Department, CourseNumber
  //    Output: Forms for the corresponding UserId, Year, Semester, Department, and CourseNumber
  async getFormsByCourse(
    userid = "",
    year = 0,
    semester = "",
    department = "",
    courseNumber = ""
  ) {
    const body = {
      Course: {
        Coordinator: {
          Id: userid,
        },
        Year: year,
        Semester: semester,
        Department: department,
        CourseNumber: courseNumber,
      },
    };

    return await this.sendPost("/forms/by-course", body);

    //To use this data you must do the following:
    //api.getFormsByCourse(userid, year, semester, department, course).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})
  }

  //---getAllForms(userid, semester, year)--- (Admin)
  //    Input: UserId, Semester, Year
  //    Output: Forms for the corresponding Semester and Year
  async getAllForms(userid = "", semester = "", year = 0) {
    const body = { userid: userid, semester: semester, year: year };

    return await this.sendPost("/forms/by-semester-year", body);

    //To use this data you must do the following:
    //api.getAllForms(userid, semester, year).then(courses => {/*here is where the data is accessible, forms is an array of JSON objects*/})
  }

  //---postForm(userId, year, semester, department, courseNumber, sectionNumber, isSectionCompleted, outcomes, ITGrades, CSGrades, CEGrades)---
  //    Input: ^^^   (will also have pdf here later as an additional parameter)
  //    Output: Success or Failure
  async postForm(
    userId = "",
    year = 0,
    semester = "",
    department = "",
    courseNumber = "",
    sectionNumber = "",
    isSectionCompleted = false,
    outcomes = [],
    ITGrades = {},
    CSGrades = {},
    CEGrades = {},
    CGrades = {}
  ) {
    // the body will also include any pdf to post in the future

    //outcomes: an array of Course_Outcomes objects
    //Course_Outcomes class:
    //string outcome, int numberOfIT, int numberOfCS, int numberOfCE, StudentWorks[] studentWorks
    //StudentWorks class:
    //string studentWork, string fileUploaded (<-- will implement later)

    //IT, CS, CE Grades class:
    //int A, int B, int C, int D, int E, int F, int W, int I, int totalStudents

    const body = {
      form: {
        section: {
          instructor: {
            id: userId,
          },
          year,
          semester,
          department,
          courseNumber,
          sectionNumber,
          isSectionCompleted,
        },
        outcomes,
        ITGrades,
        CSGrades,
        CEGrades,
        CGrades,
      },
    };

    return await this.sendPost("/forms/post-form", body);
  }

  //---postComment(userId, year, semester, department, courseNumber, coordinatorComment, isCourseCompleted)---
  //    Input: UserId, Year, Semester, department, courseNumber, coordinatorComment, isCourseCompleted
  //    Output: Success or Failure
  async postComment(
    userId = "",
    year = 0,
    semester = "",
    department = "",
    courseNumber = "",
    coordinatorComment = "",
    isCourseCompleted = false
  ) {
    const body = {
      course: {
        Coordinator: {
          Id: userId,
        },
        year,
        semester,
        department,
        courseNumber,
        coordinatorComment,
        isCourseCompleted,
      },
    };

    return await this.sendPost("/courses/post-comment", body);
  }

  //---getBlankForm(userid)---
  //    Input: Section object containing: CourseNumber, SectionNumber, and Id
  //    Output: Blank Form
  //async getBlankForm(userid) {
  async getBlankForm(courseNumber = "", sectionNumber = "", sectionId = 0) {
    const body = {
      Section: {
        CourseNumber: courseNumber,
        SectionNumber: sectionNumber,
        Id: sectionId,
      },
    };

    return await this.sendPost("/forms/new-blank", body);

    //To use this data you must do the following:
    //api.getBlankForm(userid).then(result => {/*here is where the return value is accessible, it is a JSON*/})
  }

  //--getDefaultYearAndSemester()--
  //    Input: Nothing
  //    Output: Object Including Current Default Year and Semester
  getDefaultYearAndSemester() {
    var text =
      '{ "year": 0,' + // create string of object
      ' "semester": "" }';
    var ResultObj = JSON.parse(text); // create object from the string

    var date = new Date(); // get the current date
    var day = date.getDay(); // get the current day
    var month = date.getMonth() + 1; // add one to month (by default January = 0)
    ResultObj.year = date.getFullYear(); // get the full year from the date
    ResultObj.semester = "fall"; // just to be safe

    // Set the Default Semester Based on the Month
    if (month > 8 || (month == 8 && day >= 15)) {
      ResultObj.semester = "fall";
    } else if (month > 5 || (month == 5 && day >= 15)) {
      ResultObj.semester = "summer";
      // since this is just a default semester, it always defaults to the longer semesters
      // this is why it doesn't default to smaller summer semesters
    } else {
      ResultObj.semester = "spring";
    }

    return ResultObj; // return object including the year and semester
  }

  //---addSection(userid, firstName, lastName, year, semester, courseNumber, sectionNumber, department, numberOfStudents)--- (Admin)
  //    Input: ^^^
  //    Output: Success or Failure
  async addSection(
    userid = "",
    firstName = "",
    lastName = "",
    year = 0,
    semester = "",
    courseNumber = "",
    sectionNumber = "",
    department = "",
    numberOfStudents = 0,
    isSectionCompleted
  ) {
    const body = {
      section: {
        instructor: {
          id: userid,
          firstName,
          lastName,
        },
        year,
        semester,
        courseNumber,
        sectionNumber,
        department,
        isSectionCompleted: isSectionCompleted,
        numberOfStudents,
      },
    };

    return await this.sendPost("/sections/add-section", body);
  }

  /*  //---getCoursesByDepartment(department)--- (Admin)
  //    Input: department
  //    Output: array of courses
  async getCoursesByDepartment(department = "") {
    const body = {
      department,
    };

    return await this.sendPost("/courses/get-by-department", body);
  } */

  //---addProgram(program)--- (Admin)
  //    Input: program name
  //    Output: success or failure
  async addProgram(program = "") {
    const body = {
      program,
    };

    return await this.sendPost("/programs/add-program", body);
  }

  //---addProgram(program)--- (Admin)
  //    Input: None
  //    Output: List of program names
  async getProgramNames() {
    return await this.sendPost("/programs/get-program-names", {});
  }

  //---addCourse(userid, firstName, lastName, year, semester, courseNumber, displayName, department)--- (Admin)
  //    Input: ^^^
  //    Output: success or failure
  async addCourse(
    userid = "",
    firstName = "",
    lastName = "",
    year = 0,
    semester = "",
    courseNumber = "",
    displayName = "",
    department = ""
  ) {
    const body = {
      Course: {
        Coordinator: {
          Id: userid,
          firstName,
          lastName,
        },
        year,
        semester,
        courseNumber,
        displayName,
        department,
      },
    };

    return await this.sendPost("/courses/add-course", body);
  }

  //---removeCourse(year, semester, courseNumber, department)--- (Admin)
  //    Input: year, semester, courseNumber, department
  //    Output: success or failure
  async removeCourse(
    year = 0,
    semester = "",
    courseNumber = "",
    department = ""
  ) {
    const body = {
      Course: {
        year,
        semester,
        courseNumber,
        department,
      },
    };

    return await this.sendPost("/courses/remove-course", body);
  }

  //---postCourseOutcomes(outcomes)--- (Admin)
  //    Input: array of outcome objects (see notes below)
  //    Output: success or failure
  async postCourseOutcomes(outcomes = []) {
    //an outcome object contains the following:
    //order (number), outcome (string), mappedStudentOutcomes(array of numbers)
    //Example:
    //{
    //    order: 1, outcome: "Accomplish things", mappedStudentOutcomes: [1, 0, 0, 1, 0, 1]
    //}

    const body = {
      courseOutcomesList: outcomes,
    };

    return await this.sendPost("/course-outcomes/post-outcomes", body);
  }

  //---postSection(userid, firstName, lastName, year, semester, courseNumber, sectionNumber, department, numberOfStudents)--- (Instructor)
  //   Input: Section object
  //   Output: success or failure
  async postSection(
    userid = "",
    year = 0,
    semester = "",
    courseNumber = "",
    sectionNumber = "",
    department = "",
    firstName = "",
    lastName = "",
    numberOfStudents = 0
  ) {
    const body = {
      section: {
        instructor: {
          id: userid,
          firstName,
          lastName,
        },
        year,
        semester,
        courseNumber,
        sectionNumber,
        department,
        isSectionCompleted: false,
        NumberOfStudents,
      },
    };

    return await this.sendPost("/sections/post-section", body);
  }

  async uploadAccessDb(formData = new FormData()) {
    return await this.sendFile("/upload-access-db", formData);
  }

  async uploadStudentWork(
    formData = new FormData(),
    outcomeId = 0,
    courseNumber = "",
    sectionNumber = "",
    semester = "",
    year = 0
  ) {
    //outcomeId is a unique id that identifies a certain outcome in the DB
    //it will come from the DB when the instructor form page is loaded

    formData.append("outcomeId", outcomeId);
    formData.append("courseNumber", courseNumber);
    formData.append("sectionNumber", sectionNumber);
    formData.append("semester", semester);
    formData.append("year", year);
    return await this.sendFile("/student-work/upload", formData);
  }

  async downloadStudentWork(fileId = "", fileName = "") {
    //fileId is the unique file name given to a file when it is uploaded
    //fileName is the original file name the file had before it was uploaded
    //both of these values will come from the DB when the instructor form page is loaded

    return await this.sendPost(
      "/student-work/download",
      { fileId },
      true,
      fileName
    );
  }
  //---deleteStudentWork(...) --- (Instructor)
  // Input: fileId
  // Output: success or failure
  async deleteStudentWork(fileId = "") {
    const body = {
      fileId,
    };
    return await this.sendPost("/student-work/delete", body);
  }

  //---postStudentSurvey(...)--- (Student)
  //    Input: vvv
  //    Output: success or failure
  async postStudentSurvey(
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
    //outcomeRatings and taRatings are arrays of numbers 1-5

    const body = {
      studentSurvey: {
        studentId,
        section: {
          courseNumber,
          sectionNumber,
          year,
          semester,
        },
        program,
        classification,
        anticipatedGrade,
        outcomeRatings,
        taRatings,
        taComment,
        courseComment,
      },
    };

    return await this.sendPost("/student-surveys/post-survey", body);
  }
}

class ErrorObj {
  constructor(message = "", isLoggedIn = true) {
    this.failure = true;
    this.message = message;
    this.isLoggedIn = isLoggedIn;
  }
}
