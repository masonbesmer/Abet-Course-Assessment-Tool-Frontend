// Helper API Class
import cookieCutter from "cookie-cutter";
import jwt from "jsonwebtoken";
const axios = require("axios");

const root = `${process.env.BACKEND}/api`; // The base URL for each request // TODO: remove or change to root.api or something
const rootNew = process.env.BACKEND; // The base URL for each request // TODO: change to root or something--remove "New"

const DEBUG_MODE = true; // enables debug messages
var debug = {
  log: (msg) => {
    if (DEBUG_MODE) console.log(msg);
  },
  time: (msg) => {
    if (DEBUG_MODE) console.time(msg);
  },
  timeEnd: (msg) => {
    if (DEBUG_MODE) console.timeEnd(msg);
  },
};

/**
 * The expiration time for the JWT token in hours
 * @type {number}
 * @constant 24
 */
const JWT_EXPIRATION = 24;

const OK = 200; //200 Ok status code
const CREATED = 201; //201 Created status code
const BAD_REQUEST = 400; //400 Bad Request status code
const UNAUTHORIZED = 401; //401 Unauthorized status code
const FORBIDDEN = 403; //403 Unauthorized status code
const NOT_LOGGED_IN_MSG =
  "Error: Your session has expired. Please log in again.";
const SERVER_ERROR_MSG = "Internal Server Error: Please try again later.";
const BAD_REQUEST_MSG = "Error: Some of the provided parameters are invalid.";
const FORBIDDEN_MSG = "Error: You are unauthorized to make this request.";
var token = ""; //holds value of the token cookie
const config = { headers: { Authorization: "" } }; //adds authorization header for axios (might not be needed) // TODO: remove if not needed

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
        return "SUCCESS";
      case 400:
        return "BAD_REQUEST";
      case 401 || "Request failed with status code 401":
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      default:
        console.warn(`Unknown status code from request: ${status}`);
        return status;
    }
  }

  /***\  New End Point  \***/

  /**
   * @function login Sends a POST request to the backend Login endpoint. The backend will check the credentials and return a JWT token if successful.
   * @param {string} euid
   * @param {string} password
   * @returns {string|boolean} "Admin", "Instructor", "Student/TA" or boolean for failure
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const role = await api.login("euid", "password"); // role holds the response from the backend
   * if (role) { // if role is true or a string (truthy)
   *   console.log("Login successful");
   * }
   * else { // if role is false or undefined
   *   console.log("Login failed");
   * }
   **/
  async login(userid, password) {
    // Check if euid and password are undefined
    if (userid == undefined) {
      console.error("Error: euid is undefined");
      return false;
    }
    if (password == undefined) {
      console.error("Error: password is undefined");
      return false;
    }

    const endpoint = `${rootNew}/Login`;
    const data = { euid: userid, password: password };
    debug.time(`POST ${endpoint}`);
    try {
      // send a POST request to the backend Login endpoint and wait for response
      var response = await axios.post(endpoint, data);
      if (response.data.hasOwnProperty("token")) {
        // get data from reponse, if the token is returned
        const token = response.data.token; //get the token from the data
        debug.log(`Token: ${token}`);
        var expires = new Date(); //create a new date object
        expires.setHours(expires.getHours() + JWT_EXPIRATION); //expires in 24 hours
        expires = expires.toUTCString(); //convert to UTC string
        cookieCutter.set("token", token, { expires }); //set token cookie with expiration date
        const json = jwt.decode(token); // decode the token to get the role
        return json.role; //return the role
      }
    } catch (error) {
      console.error(new Error(error));
    }
    debug.timeEnd(`POST ${endpoint}`);
  }

  /**
   * @function logout Sets the token and user cookies to expire immediately.
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * api.logout(); // sets the token and user cookies to expire immediately
   **/
  logout() {
    cookieCutter.set("token", "", { expires: new Date().toUTCString() });
    cookieCutter.set("user", "", { expires: new Date().toUTCString() });
  }

  /**
   * @function Custom [Development] Sends a POST request to the backend /Custom endpoint. The backend will run the function "`DoStuff()`" to populate the database.
   * @returns {void}
   **/
  async Custom() {
    const endpoint = `${rootNew}/Custom`;
    debug.time(`GET ${endpoint}`);
    try {
      // so axios is what sends the http header request to the backend. it needs to have the token sent
      // for authorization everytime. that is what the extra header is now.
      const response = await axios.get(endpoint, {
        headers: { Authorization: "bearer " + token },
        // no data
      });
      debug.log(response.data);
    } catch (error) {
      console.error(error);
    }
    debug.timeEnd(`GET ${endpoint}`);
  }

  /**
   * @function getFacultyList Sends a POST request to the backend /Login endpoint.
   * @returns {Array} List of admins, instructors, coordinators
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const facultyList = await api.getFacultyList(); // facultyList holds the response from the backend
   **/
  async getFacultyList() {
    const endpoint = `${rootNew}/Role/GetFaculty`;
    debug.time(`GET ${endpoint}`);
    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: "bearer " + token },
        // no data
      });
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`GET ${endpoint}`);
  }

  /**
   * @function getUsersByRole Sends a POST request to the backend /Role/GetUsersByRole endpoint.
   * @param {string} roleName name of the role to filter results by
   * @returns {object} response object with data and status
   **/
  // TODO: Validate role name before sending to backend
  async getUsersByRole(roleName) {
    const endpoint = `${rootNew}/Role/GetUsersByRole`;
    const data = {
      roleName: roleName,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      params: data,
    };
    debug.time(`GET ${endpoint}`);
    try {
      const response = await axios.get(endpoint, options);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`GET ${endpoint}`);
  }

  /**
   * @function addRoleToUser Sends a POST request to the backend /Role/AddRoleToUser endpoint.
   * @param {string} euid euid of the user to add a role to
   * @param {string} role name of the role to add to the user
   * @returns {object} response object with data and status
   **/
  // TODO: Validate role name before sending to backend
  async addRoleToUser(euid, role) {
    const endpoint = `${rootNew}/Role/AddRoleToUser`; //?EUID=${euid}&roleName=${role} (old)
    debug.time(`POST ${endpoint}`);
    const headers = { Authorization: "bearer " + token };
    const data = {
      EUID: euid,
      roleName: role,
    };
    const options = {
      headers: headers,
      params: data, // redundant
    };
    try {
      const response = await axios.post(endpoint, data, options);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`POST ${endpoint}`);
  }

  /**
   * @function removeRoleFromUser Sends a POST request to the backend /Role/RemoveRoleFromUser endpoint.
   * @param {string} euid euid of the user to add a role to
   * @param {string} role name of the role to add to the user
   * @returns {object} response object with data and status
   **/
  async removeRoleFromUser(euid, role) {
    const endpoint = `${rootNew}/Role/RemoveRoleFromUser`;
    debug.time(`POST ${endpoint}`);
    const headers = { Authorization: "bearer " + token };
    const data = {
      EUID: euid,
      roleName: role,
    };
    const options = {
      headers: headers,
      params: data, // redundant
    };
    try {
      const response = await axios.post(endpoint, data, options);
      debug.log(response);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`POST ${endpoint}`);
  }

  // FIXME: "Faculty" functions below use inconsistent naming: User/Member

  /**
   * @function editFacultyUser Sends a PATCH request to the backend /Users/EditUser endpoint.
   * @param {string} firstName first name of the falculty to edit
   * @param {string} lastName last name of the faculty to edit
   * @param {string} oldEuid original EUID of the faculty to edit
   * @param {string} newEuid new EUID of the faculty to edit
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const response = await api.editFacultyUser("John", "Doe", "abc1234", "xyz5678"); // response is an object with data and status
   */
  async editFacultyUser(firstName, lastName, oldEuid, newEuid) {
    // Validate input
    if (!firstName) {
      // if `firstName` is null or undefined or falsy
      const msg = "Invalid or missing firstName";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!lastName) {
      // if `lastName` is null or undefined or falsy
      const msg = "Invalid or missing lastName";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!oldEuid) {
      // if `oldEuid` is null or undefined or falsy
      const msg = "Invalid or missing oldEuid";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!newEuid) {
      // if `newEuid` is null or undefined or falsy
      const msg = "Invalid or missing newEuid";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Users/EditUser/?EUID=${oldEuid}`; // FIXME: remove the EUID param from the URL and place it in the body
    const data = {
      firstName: firstName,
      lastName: lastName,
      euid: newEuid,
    };
    const headers = { Authorization: "bearer " + token };
    const options = {
      headers: headers,
      params: data,
    };
    debug.time(`PATCH ${endpoint}`);
    try {
      const response = await axios.patch(endpoint, data, options);
      debug.log(response);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`PATCH ${endpoint}`);
  }

  /**
   * @function deleteFacultyUser Sends a DELETE request to the backend /Users/DeleteUser endpoint.
   * @param {string} euid first name of the falculty to edit
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const response = await api.deleteFacultyUser("abc1234"); // response is an object with data and status
   */
  async deleteFacultyUser(euid) {
    // Validate input
    if (!euid) {
      // if `euid` is null or undefined or falsy
      console.error("Invalid or Missing EUID");
      return {
        data: null,
        status: {
          code: 400,
          message: "Invalid or Missing EUID",
        },
      };
    }

    const endpoint = `${rootNew}/Users/DeleteUser`;
    const data = {
      euid: euid,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      /* NOTE:
       *   Unlike axios.post() and axios.put(), the 2nd param to axios.delete() is the Axios options, not the request body.
       *   To send a request body with a DELETE request, you should use the data option.
       * Source: https://masteringjs.io/tutorials/axios/delete
       */
      params: data,
    };
    debug.time(`DELETE ${endpoint}`);
    try {
      const response = await axios.delete(endpoint, options);
      debug.log(response);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`DELETE ${endpoint}`);
  }

  /**
   * @function addFacultyMember Sends a POST request to the backend /Users/AddUserWithRoles endpoint.
   * @param {string} firstName first name of the falculty to add
   * @param {string} lastName last name of the faculty to add
   * @param {string} userId first name of the falculty to add
   * @param {string} facultyType first name of the falculty to add
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const response = await api.addFacultyMember("John", "Doe", "abc1234", "Admin"); // response is an object with data and status
   **/
  async addFacultyMember(firstName, lastName, userId, facultyType) {
    // Validate input
    if (!firstName) {
      // if `firstName` is null or undefined or falsy
      const msg = "Invalid or missing firstName";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!lastName) {
      // if `lastName` is null or undefined or falsy
      const msg = "Invalid or missing lastName";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!userId) {
      // if `userId` is null or undefined or falsy
      const msg = "Invalid or missing userId";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!facultyType) {
      // if `facultyType` is null or undefined or falsy
      const msg = "Invalid or missing facultyType";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Users/AddUserWithRoles`;
    const options = { headers: { Authorization: "bearer " + token } };
    const data = {
      user: {
        // package the user data into a user object
        firstName: firstName,
        lastName: lastName,
        euid: userId,
      },
      roles: [facultyType],
    };
    debug.time(`POST ${endpoint}`);
    try {
      const response = await axios.post(endpoint, data, options);
      debug.log(response);
      if (response) {
        console.log(response);
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`POST ${endpoint}`);
  }

  /**
   * @function getSemesters Sends a GET request to the backend /Semester/GetSemesters endpoint.
   * @returns {object} response object with data (a list of semesters) and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { data } = await api.getSemesters(); // data is a list of semesters
   **/
  async getSemesters() {
    const endpoint = `${rootNew}/Semester/GetSemesters`;
    const options = { headers: { Authorization: "bearer " + token } };
    debug.time(`GET ${endpoint}`);
    try {
      const response = await axios.get(endpoint, options);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`GET ${endpoint}`);
  }

  /**
   * @function addNewSemester Sends a POST request to the backend /Semester/AddSemester endpoint.
   * @param {number} year the year of the semester to delete
   * @param {string} term the term of the semester to delete
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.addNewSemester(2023, "Spring"); // status is an object with code and message
   **/
  async addNewSemester(year, term) {
    if (!year) {
      const msg = "Invalid or missing year";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!term) {
      const msg = "Invalid or missing term";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Semester/AddSemester`;
    const options = { headers: { Authorization: "bearer " + token } };
    const body = {
      year: year,
      term: term,
    };
    debug.time(`POST ${endpoint}`);
    try {
      const response = await axios.post(endpoint, body, options);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`POST ${endpoint}`);
  }

  /**
   * @function deleteSemester Sends a DELETE request to the backend /Semester/DeleteSemester endpoint.
   * @param {string} term the term of the semester to delete
   * @param {number} year the year of the semester to delete
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.deleteSemester("Fall", 2022); // status is an object with code and message
   * @see deleteFacultyUser
   **/
  async deleteSemester(term, year) {
    if (!year) {
      const msg = "Invalid or missing year";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!term) {
      const msg = "Invalid or missing term";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Semester/DeleteSemester`;
    const data = {
      year: year,
      term: term,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      data: data,
    };
    debug.time(`DELETE ${endpoint}`);
    try {
      const response = await axios.delete(endpoint, options);
      if (response) {
        let status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`DELETE ${endpoint}`);
  }

  /**
   * @function getMajors Sends a GET request to the backend /Major/GetMajors endpoint.
   * @param {string} year year that has the majors in that year
   * @param {string} term term that has the majors in that term
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { data } = await api.getMajors("Summer", "2022"); // data is a list of majors
   **/
  async getMajors(term, year) {
    if (!year) {
      const msg = "Invalid or missing year";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!term) {
      const msg = "Invalid or missing term";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Major/GetMajors`;
    const data = {
      term: term,
      year: year,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      params: data,
    };
    debug.time(`GET ${endpoint}`);
    try {
      const response = await axios.get(endpoint, options);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
    debug.timeEnd(`GET ${endpoint}`);
  }

  /**
   * @function addMajor Sends a POST request to the backend /Major/AddMajor endpoint.
   * @param {string} majorName major name of the major being added
   * @param {string} term term of the major being added
   * @param {string} year year of the major being added
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.addMajor("Crypto Science", "Summer", "2023"); // status is an object with code and message
   **/
  async addMajor(majorName, term, year) {
    if (!year) {
      const msg = "Invalid or missing year";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!term) {
      const msg = "Invalid or missing term";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!majorName) {
      const msg = "Invalid or missing major name";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Major/AddMajor`;
    const data = {
      name: majorName, // this is the expected format for the backend (?name=majorName); do not change
      term: term,
      year: year,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      params: data,
    };
    debug.time(`POST ${endpoint}`);
    try {
      const response = await axios.post(endpoint, data, options); // data is the body of the request
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return {
        data: null,
        status: status,
      };
    }
  }

  /**
   * @function deleteMajor Sends a DELETE request to the backend /Major/DeleteMajor endpoint.
   * @param {string} majorName major name of the major being deleted
   * @param {string} term term of the major being deleted
   * @param {string} year year of the major being deleted
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { data, status } = await api.deleteMajor("Crypto Science", "Summer", "2023");
   **/
  async deleteMajor(majorName, term, year) {
    if (!year) {
      const msg = "Invalid or missing year";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!term) {
      const msg = "Invalid or missing term";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }
    if (!majorName) {
      const msg = "Invalid or missing major name";
      console.error(msg);
      return {
        data: null,
        status: { code: 400, message: msg },
      };
    }

    const endpoint = `${rootNew}/Major/DeleteMajor`;
    const data = {
      name: majorName, // this is the expected format for the backend (?name=majorName); do not change
      term: term,
      year: year,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      params: data, // the only way to send params in a DELETE request is to use the params object
    };
    debug.time(`DELETE ${endpoint}`);
    try {
      const response = await axios.delete(endpoint, options);
      if (response) {
        const status = this.checkStatus(response.status);
        return {
          data: response.data,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      console.error(error);
      return status;
    }
    debug.timeEnd(`DELETE ${endpoint}`);
  }

  //All courses endpoint

  /**
   * @function getCoursesByDepartment Sends a POST request to the backend /All/getCoursesByDepartment endpoint.
   * @param {string} term term of the courses retrieved
   * @param {string} year year of the courses retrieved
   * @param {string} department department of courses retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.getCoursesByDepartment("2023", "Spring", "CSCE"); // status is an object with code and message
   **/
  async getCoursesByDepartment(term, year, department) {
    const url =
      rootNew +
      `/Course/GetCoursesByDepartment?term=${term}&year=${year}&department=${department}`;
    try {
      var response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function addNewCourse Sends a POST request to the backend /Course/AddCourse endpoint.
   * @param {string} year year of the course being added
   * @param {string} term term of the course being added
   * @param {string} courseID course ID of the course being added
   * @param {string} coordinatorEUID coordinator EUID of the course being added
   * @param {string} courseNumber course number of the course being added
   * @param {string} displayName display name of the course being added
   * @param {string} coordinatorComment coordinator comment of the course being added
   * @param {boolean} isCourseCompleted is course completed of the course being added
   * @param {string} department department of the course being added
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.addNewCourse("2023", "Spring", "CSCE 121", "123456789", "121", "Intro to Programming", "This is a comment", true, "CSCE"); // status is an object with code and message
   **/

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
      const response = await axios.post(url, body, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function deleteCourse Sends a POST request to the backend /Course/DeleteCourse endpoint.
   * @param {*} term term of the course being deleted
   * @param {*} year year of the course being deleted
   * @param {*} department department of the course being deleted
   * @param {*} courseNumber course number of the course being deleted
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.deleteCourse("2023", "Spring", "CSCE", "121"); // status is an object with code and message
   **/
  async deleteCourse(term = "", year = 0, department = "", courseNumber = "") {
    const url =
      rootNew +
      `/Course/DeleteCourse?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function editCourse Sends a PATCH request to the backend /Course/EditCourse endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @param {string} newCoordinatorEUID new coordinator EUID of the course being edited
   * @param {string} newCourseNumber new course number of the course being edited
   * @param {string} newDisplayName new display name of the course being edited
   * @param {string} newCoordinatorComment new coordinator comment of the course being edited
   * @param {boolean} newIsCourseComplete new is course completed of the course being edited
   * @param {string} newDepartment new department of the course being edited
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.editCourse("2023", "Spring", "CSCE", "121", "123456789", "121", "Intro to Programming", "This is a comment", true, "CSCE"); // status is an object with code and message
   **/
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
      const response = await axios.patch(
        url,
        {
          coordinatorEUID: newCoordinatorEUID,
          courseNumber: newCourseNumber,
          displayName: newDisplayName,
          coordinatorComment: newCoordinatorComment,
          isCourseCompleted: newIsCourseComplete,
          department: newDepartment,
        },
        { headers: { Authorization: "bearer " + token } }
      );
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
      var response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  //    Input: assistantEUID, term, year, department, courseNumber, sectionNumber
  //    Output: List of faculty members with that role
  async getSectionAssistant(assistantEUID, term, year, department, courseNumber, sectionNumber) {
    const url =
      rootNew +
      `/Section/GetSectionAssistant?assistantEUID=${assistantEUID}&term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;
    try {
      var response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getSectionsByCourse Sends a GET request to the backend /Section/GetSectionsByCourse endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.getSectionsByCourse("2023", "Spring", "CSCE", "121"); // status is an object with code and message
   */
  async getSectionsByCourse(term, year, department, courseNumber) {
    const url =
      rootNew +
      `/Course/GetSectionsByCourse?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      var response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getSectionsByInstructor Sends a GET request to the backend /Section/GetSectionsByInstructor endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} instructorEUID EUID of the instructor
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.getSectionsByInstructor("2023", "Spring", "123456789"); // status is an object with code and message
   */
  async GetSectionsByInstructor(term, year, instructorEUID) {
    const endpoint = `${rootNew}/Section/GetSectionsByInstructor`;
    const data = {
      term: term,
      year: year,
      instructorEUID: instructorEUID,
    };
    const options = {
      headers: { Authorization: "bearer " + token },
      params: data,
    };
    try {
      const response = await axios.get(endpoint, options);
      if (response) {
        const status = this.checkStatus(response.status);
        const resData = response.data;
        return {
          data: resData,
          status: status,
        };
      }
    } catch (error) {
      const status = this.checkStatus(error.message);
      return {
        data: null,
        status: status,
      };
    }
  }

  /**
   * @function GetSectionsByCoordinator Sends a GET request to the backend /Section/GetSectionsByCoordinator endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} coordinatorEUID EUID of the coordinator
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.getSectionsByCoordinator("2023", "Spring", "123456789"); // status is an object with code and message
   */
  async GetSectionsByCoordinator(term, year, coordinatorEUID) {
    const url =
      rootNew +
      `/Course/GetCoursesByCoordinator?term=${term}&year=${year}&coordinatorEUID=${coordinatorEUID}`;
    try {
      var response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function addNewSection Sends a POST request to the backend /Section/AddSection endpoint.
   * @param {string} year year of the course being edited
   * @param {string} term term of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @param {string} instructorEUID EUID of the instructor
   * @param {boolean} isSectionComplete boolean value indicating if the section is complete
   * @param {string} sectionNumber section number of the section being added
   * @param {number} numberOfStudents number of students in the section being added
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.addNewSection("2023", "Spring", "CSCE", "121", "123456789", false, "001", 20); // status is an object with code and message
   */
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
      const response = await axios.post(url, body, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function deleteSection Sends a DELETE request to the backend /Section/DeleteSection endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @param {string} sectionNumber section number of the section being deleted
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.deleteSection("2023", "Spring", "CSCE", "121", "001"); // status is an object with code and message
   */
  async deleteSection(term, year, department, courseNumber, sectionNumber) {
    const url =
      rootNew +
      `/Section/DeleteSection?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function editSection Sends a PATCH request to the backend /Section/EditSection endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @param {string} sectionNumber section number of the section being edited
   * @param {string} newInstructorEUID EUID of the new instructor
   * @param {boolean} newIsSectionCompleted boolean value indicating if the section is complete
   * @param {string} newSectionNumber new section number of the section being edited
   * @param {number} newNumberOfStudents new number of students in the section being edited
   * @param {number} newIsFormSubmitted new number of students in the section being edited
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.editSection("2023", "Spring", "CSCE", "121", "001", "123456789", false, "002", 20); // status is an object with code and message
   **/
  async editSection(
    term,
    year,
    department,
    courseNumber,
    sectionNumber,
    newInstructorEUID,
    newIsSectionCompleted,
    newSectionNumber,
    newNumberOfStudents,
    newIsFormSubmitted
  ) {
    const url =
      rootNew +
      `/Section/EditSection?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;
    try {
      const response = await axios.patch(
        url,
        {
          instructorEUID: newInstructorEUID,
          isSectionCompleted: newIsSectionCompleted,
          sectionNumber: newSectionNumber,
          numberOfStudents: newNumberOfStudents,
          isFormSubmitted: newIsFormSubmitted,
        },
        { headers: { Authorization: "bearer " + token } }
      );
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

  /**
   * @function editComments Sends a PATCH request to the backend /Section/EditComments endpoint.
   * @param {string} term term of the course being edited
   * @param {string} year year of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @param {string} sectionNumber section number of the section being edited
   * @param {string} newInstructorComment new instructor comment
   * @param {string} newCoordinatorComment new coordinator comment
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.editSection("2023", "Spring", "CSCE", "121", "001", "123456789", false, "002", 20); // status is an object with code and message
   **/
  async editComments(
    term,
    year,
    department,
    courseNumber,
    sectionNumber,
    newInstructorComment,
    newCoordinatorComment
  ) {
    const url =
      rootNew +
      `/Section/EditComments?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}&newInstructorComment=${newInstructorComment}&newCoordinatorComment=${newCoordinatorComment}`;
    try {
      const response = await axios.patch(
        url,
        { headers: { Authorization: "bearer " + token } }
      );
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

  /**
   * @function assignCourseToMajor Sends a POST request to the backend /CourseOutcome/addCourseOutcome endpoint.
   * @param {string} year year of the course being assigned to a major
   * @param {string} term term of the course being assigned to a major
   * @param {string} department department of the course being assigned to a major
   * @param {string} courseNumber course number of the course being assigned to a major
   * @param {string} major major to which the course is being assigned
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.assignCourseToMajor("2023", "Spring", "CSCE", "121", "Computer Science"); // status is an object with code and message
   */
  async assignCourseToMajor(year, term, department, courseNumber, major) {
    const url =
      rootNew +
      `/CourseOutcome/addCourseOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    const body = {
      courseOutcomeId: 0,
      major: major,
    };
    try {
      const response = await axios.post(url, body, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function deleteCourseAssignedToMajor Sends a DELETE request to the backend /CourseOutcome/DeleteCourseOutcome endpoint.
   * @param {string} year year of the course being deleted
   * @param {string} term term of the course being deleted
   * @param {string} department department of the course being deleted
   * @param {string} courseNumber course number of the course being deleted
   * @param {string} major major to which the course is being deleted
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.deleteCourseAssignedToMajor("2023", "Spring", "CSCE", "121", "Computer Science"); // status is an object with code and message
   */
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
      const response = await axios.delete(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function addNewCourseToMajor Sends a POST request to the backend /CourseOutcome/AddCourseOutcome endpoint.
   * @param {string} year year of the course being added
   * @param {string} term term of the course being added
   * @param {string} majorName major to which the course is being added
   * @param {string} outcomeName name of the outcome being added
   * @param {string} outcomeDescription description of the outcome being added
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.addNewCourseToMajor("2023", "Spring", "Computer Science", "Outcome 1", "Outcome 1 Description"); // status is an object with code and message
   */
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
      const response = await axios.post(url, body, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function deleteOutcomeFromMajor Sends a DELETE request to the backend /MajorOutcome/DeleteMajorOutcome endpoint.
   * @param {string} year year of the course being deleted
   * @param {string} term term of the course being deleted
   * @param {string} majorName major to which the course is being deleted
   * @param {string} outcomeName name of the outcome being deleted
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.deleteOutcomeFromMajor("2023", "Spring", "Computer Science", "Outcome 1"); // status is an object with code and message
   */
  async deleteOutcomeFromMajor(year, term, majorName, outcomeName) {
    const url =
      rootNew +
      `/MajorOutcome/DeleteMajorOutcome?term=${term}&year=${year}&majorName=${majorName}&outcomeName=${outcomeName}`;
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function editOutcomeForMajor Sends a PATCH request to the backend /MajorOutcome/EditMajorOutcome endpoint.
   * @param {string} year year of the course being edited
   * @param {string} term term of the course being edited
   * @param {string} majorName major to which the course is being edited
   * @param {string} oldOutcomeName name of the outcome being edited
   * @param {string} newOutcomeName new name of the outcome being edited
   * @param {string} newDescription new description of the outcome being edited
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.editOutcomeForMajor("2023", "Spring", "Computer Science", "Outcome 1", "Outcome 1", "Outcome 1 Description"); // status is an object with code and message
   */
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
      const response = await axios.patch(
        url,
        {
          name: newOutcomename,
          description: newDescription,
        },
        { headers: { Authorization: "bearer " + token } }
      );
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

  /**
   * @function getCourseOutcome Sends a GET request to the backend /CourseOutcome/GetCourseOutcomes endpoint.
   * @param {string} year year of the course being retrieved
   * @param {string} term term of the course being retrieved
   * @param {string} department department of the course being retrieved
   * @param {string} courseNumber course number of the course being retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { data, status } = await api.getCourseOutcome("2023", "Spring", "Computer Science", "111"); // data is an object with the course outcome data and status is an object with code and message
   */
  async getCourseOutcome(year, term, department, courseNumber) {
    const url =
      rootNew +
      `/CourseOutcome/GetCourseOutcomes?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function addNewCourseOutcome Sends a POST request to the backend /CourseOutcome/addCourseOutcome endpoint.
   * @param {string} year year of the course being added
   * @param {string} term term of the course being added
   * @param {string} department department of the course being added
   * @param {string} courseNumber course number of the course being added
   * @param {string} outcomeName name of the outcome being added
   * @param {string} outcomeDescription description of the outcome being added
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.addNewCourseOutcome("2023", "Spring", "Computer Science", "111", "Outcome 1", "Outcome 1 Description"); // status is an object with code and message
   */
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
      const response = await axios.post(url, body, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function deleteCourseOutcome Sends a PATCH request to the backend /CourseOutcome/EditCourseOutcome endpoint.
   * @param {string} year year of the course being edited
   * @param {string} term term of the course being edited
   * @param {string} department department of the course being edited
   * @param {string} courseNumber course number of the course being edited
   * @param {string} outcomeName name of the outcome being edited
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.deleteCourseOutcome("2023", "Spring", "Computer Science", "111", "Outcome 1"); // status is an object with code and message
   */
  async deleteCourseOutcome(year, term, department, courseNumber, outcomeName) {
    const url =
      rootNew +
      `/CourseOutcome/DeleteCourseOutcome?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&name=${outcomeName}`;
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function GetLinkedMajorOutcomes Sends a GET request to the backend /CourseOutcome/GetLinkedMajorOutcomes endpoint.
   * @param {string} year year of the course being retrieved
   * @param {string} term term of the course being retrieved
   * @param {string} department department of the course being retrieved
   * @param {string} courseNumber course number of the course being retrieved
   * @param {string} courseOutcomeName name of the course outcome being retrieved
   * @param {string} major name of the major being retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { data, status } = await api.GetLinkedMajorOutcomes("2023", "Spring", "Computer Science", "111", "Outcome 1", "Computer Science"); // data is an object with the linked major outcomes data and status is an object with code and message
   */
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
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function LinkToMajorOutcome Sends a POST request to the backend /CourseOutcome/LinkToMajorOutcome endpoint.
   * @param {string} year year of the course being linked
   * @param {string} term term of the course being linked
   * @param {string} department department of the course being linked
   * @param {string} courseNumber course number of the course being linked
   * @param {string} courseOutcomeName name of the course outcome being linked
   * @param {string} majorName name of the major being linked
   * @param {string} majorOutcomeName name of the major outcome being linked
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.LinkToMajorOutcome("2023", "Spring", "Computer Science", "111", "Outcome 1", "Computer Science", "Outcome 1"); // status is an object with code and message
   */
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
      const response = await axios.post(
        url,
        {},
        { headers: { Authorization: "bearer " + token } }
      );
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

  /**
   * @function RemoveLinkToMajorOutcome Sends a DELETE request to the backend /CourseOutcome/RemoveLinkToMajorOutcome endpoint.
   * @param {string} year year of the course being unlinked
   * @param {string} term term of the course being unlinked
   * @param {string} department department of the course being unlinked
   * @param {string} courseNumber course number of the course being unlinked
   * @param {string} courseOutcomeName name of the course outcome being unlinked
   * @param {string} majorName name of the major being unlinked
   * @param {string} majorOutcomeName name of the major outcome being unlinked
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status } = await api.RemoveLinkToMajorOutcome("2023", "Spring", "Computer Science", "111", "Outcome 1", "Computer Science", "Outcome 1"); // status is an object with code and message
   */
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
      const response = await axios.delete(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getMajorOutcomesByMajor Sends a GET request to the backend /Major/GetMajorOutcomesByMajor endpoint.
   * @param {string} year year of the major outcomes being retrieved
   * @param {string} term term of the major outcomes being retrieved
   * @param {string} majorName name of the major outcomes being retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getMajorOutcomesByMajor("2023", "Spring", "Computer Science"); // status is an object with code and message, data is an array of major outcomes
   */
  async getMajorOutcomesBymajor(year, term, majorName) {
    const url =
      rootNew +
      `/Major/GetMajorOutcomesByMajor?term=${term}&year=${year}&majorName=${majorName}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getOutcomesByCourse Sends a GET request to the backend /Course/GetMajorOutcomesSatisfied endpoint.
   * @param {string} year year of the course outcomes being retrieved
   * @param {string} term term of the course outcomes being retrieved
   * @param {string} department department of the course outcomes being retrieved
   * @param {string} courseNumber course number of the course outcomes being retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getOutcomesByCourse("2023", "Spring", "Computer Science", "111"); // status is an object with code and message, data is an array of course outcomes
   */
  async getOutcomesByCourse(year, term, department, courseNumber) {
    const url =
      rootNew +
      `/Course/GetMajorOutcomesSatisfied?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getQuestionSet() Sends a GET request to the backend /Survey/GetQuestionSet endpoint.
   * @param {string} year year of the question set being retrieved
   * @param {string} term term of the question set being retrieved
   * @param {string} questionSetName name of the question set being retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getQuestionSet("2023", "Spring", "Question Set 1"); // status is an object with code and message, data is an array of questions
   */
  async getQuestionSet(year, term, questionSetName) {
    const url =
      rootNew +
      `/Survey/GetQuestionSet?term=${term}&year=${year}&questionSetName=${questionSetName}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getQuestions() Sends a GET request to the backend /Survey/GetQuestions endpoint.
   * @param {string} year year of the questions being retrieved
   * @param {string} term term of the questions being retrieved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getQuestions("2023", "Spring"); // status is an object with code and message, data is an array of questions
   */
  async getQuestions(year, term) {
    const url = rootNew + `/Survey/GetQuestions?term=${term}&year=${year}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function saveQuestions() Sends a POST request to the backend /Survey/SaveQuestions endpoint.
   * @param {string} year year of the questions being saved
   * @param {string} term term of the questions being saved
   * @param {string} questionSet name of the question set being saved
   * @param {array} questions array of questions being saved
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.saveQuestions("2023", "Spring", "Question Set 1", [{question: "How are you?", answer: "Good"}]); // status is an object with code and message, data is an array of questions
   */
  async saveQuestions(year, term, questionSet, questions) {
    const url =
      rootNew +
      `/Survey/SaveQuestions?term=${term}&year=${year}&questionSetName=${questionSet}`;
    const body = {
      questions,
    };
    try {
      const response = await axios.post(url, questions, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function postSurvey() Sends a POST request to the backend /Survey/PostSurvey endpoint.
   * @param {string} year year of the survey being posted
   * @param {string} term term of the survey being posted
   * @param {string} euid euid of the student posting the survey
   * @param {string} department department of the course being surveyed
   * @param {string} courseNumber course number of the course being surveyed
   * @param {string} sectionNumber section number of the course being surveyed
   * @param {string} additionalComments additional comments of the survey being posted
   * @param {array} answers array of answers to the survey questions
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.postSurvey("2023", "Spring", "123456789", "CSCE", "1234", "001", "Good course", [{question: "How are you?", answer: "Good"}]); // status is an object with code and message, data is an array of questions
   */
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
      const response = await axios.post(url, answers, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   *
   * @param {string} term The term (Spring, Fall, etc)
   * @param {string} year Year from which to retreive sections
   * @param {string} euid The TA's EUID
   * @example
   * const api = new API();
   * const { status, data } = await api.getSectionsByAssistant("2024", "Spring", "ta1029");
   */
  async getSectionsByAssistant(term, year, euid) {
    const url =
      rootNew +
      `/Section/GetSectionsByAssistant?term=${term}&year=${year}&assistantEUID=${euid}`;
    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function getGrades() Sends a GET request to the backend /Grade/GetGrades endpoint.
   * @param {string} year year of the grades being retrieved
   * @param {string} term term of the grades being retrieved
   * @param {string} department department of the course being graded
   * @param {string} courseNumber course number of the course being graded
   * @param {string} sectionNumber section number of the course being graded
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getGrades("2023", "Spring", "CSCE", "1234", "001"); // status is an object with code and message, data is an array of grades
   */
  async getGrades(year, term, department, courseNumber, sectionNumber) {
    const url =
      rootNew +
      `/Grade/GetGrades?term=${term}&year=${year}&department=${department}&courseNumber=${courseNumber}&sectionNumber=${sectionNumber}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function setGrades() Sends a POST request to the backend /Grade/SetGrades endpoint.
   * @param {string} year year of the grades being set
   * @param {string} term term of the grades being set
   * @param {string} department department of the course being graded
   * @param {string} courseNumber course number of the course being graded
   * @param {string} sectionNumber section number of the course being graded
   * @param {array} gradesArray array of grades being set
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.setGrades("2023", "Spring", "CSCE", "1234", "001", [{euid: "123456789", grade: "A"}]); // status is an object with code and message, data is an array of grades
   */
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
      const response = await axios.post(url, gradesArray, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function GetStudentOutcomesCompleted() Sends a GET request to the backend /StudentOutcomesCompleted/GetStudentOutcomesCompleted endpoint.
   * @param {string} year year of the student outcomes being retrieved
   * @param {string} term term of the student outcomes being retrieved
   * @param {string} department department of the course being graded
   * @param {string} courseNumber course number of the course being graded
   * @param {string} sectionNumber section number of the course being graded
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.GetStudentOutcomesCompleted("2023", "Spring", "CSCE", "1234", "001"); // status is an object with code and message, data is an array of student outcomes
   */
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
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function SetStudentOutcomesCompleted() Sends a POST request to the backend /StudentOutcomesCompleted/SetStudentOutcomesCompleted endpoint.
   * @param {string} year year of the student outcomes being set
   * @param {string} term term of the student outcomes being set
   * @param {string} department department of the course being graded
   * @param {string} courseNumber course number of the course being graded
   * @param {string} sectionNumber section number of the course being graded
   * @param {object} courseOutcomeObject object of student outcomes being set
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.SetStudentOutcomesCompleted("2023", "Spring", "CSCE", "1234", "001", {euid: "123456789", grade: "A"}); // status is an object with code and message, data is an array of student outcomes
   */
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
      const response = await axios.post(url, courseOutcomeObject, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function GenerateFullReport() Sends a GET request to the backend /GenerateFullReport endpoint.
   * @param {string} year year of the report being generated
   * @param {string} term term of the report being generated
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.GenerateFullReport("2023", "Spring"); // status is an object with code and message, data is an array of student outcomes
   */
  async GenerateFullReport(year, term) {
    const url = rootNew + `/GenerateFullReport?term=${term}&year=${year}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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

  /**
   * @function sendPost() Sends a POST request to the backend.
   * @param {string} route route of the request being sent
   * @param {object} body body of the request being sent
   * @param {boolean} isFileDownload boolean value for whether or not the request is a file download
   * @param {string} fileName name of the file being downloaded
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.sendPost("/StudentOutcomesCompleted/GetStudentOutcomesCompleted", {year: "2023", term: "Spring", department: "CSCE", courseNumber: "1234", sectionNumber: "001"}); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function sendStudentCourseWork() Sends a POST request to the backend /student-work/upload endpoint.
   * @param {object} data data of the request being sent
   * @returns {boolean} true if the request was successful, false otherwise
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.sendStudentCourseWork({files: [...files]}); // status is an object with code and message, data is an array of student outcomes
   */
  async sendStudentCourseWork(data) {
    if (!data) {
      const msg = "No data provided.";
      const e = new Error(msg);
      console.error(e);
      return e;
    }

    const endpoint = `${rootNew}/student-work/upload`;
    const headers = { Authorization: "bearer " + token };
    const params = {
      files: [...data],
    };
    try {
      const response = axios.post(endpoint, params, headers);
      const { status } = response;
      if (status == OK) {
        return true;
      } else {
        return false;
      }
    } catch {}
  }

  /**
   * @function sendFile() Sends a POST request to the backend.
   * @param {string} route route of the request being sent
   * @param {object} formData form data of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.sendFile("/StudentOutcomesCompleted/GetStudentOutcomesCompleted", formData); // status is an object with code and message, data is an array of student outcomes
   */
  async sendFile(route, formData = new FormData()) {
    if (!route) {
      const msg = "No route specified.";
      const e = new Error(msg);
      console.error(e);
      return e;
    }

    const endpoint = `${root}${route}`; // Combine the root URL with the specified route
    var statusCode; //holds the status code of the response

    return await fetch(endpoint, {
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

  /**
   * @function getCourses() Sends a GET request to /Course/GetCoursesByDepartment endpoint
   * @param {string} semester semester of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} department department of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getCourses(userid, semester, year); // status is an object with code and message, data is an array of student outcomes
   */
  async getCourses(semester, year, department) {
    //To use this data you must do the following:
    //api.getCourses(userId, semester, year).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})
    //api.getCourses(semester, year, department).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})
    const url =
      rootNew +
      `/Course/GetCoursesByDepartment?term=${semester}&year=${year}&department=${department}`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: "bearer " + token },
      });
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
  
  /**
   * @function getAllCourses() Sends a POST request to the backend /sections/by-semester-year endpoint.
   * @param {string} userid user id of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {number} year year of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getAllCourses(userid, semester, year); // status is an object with code and message, data is an array of student outcomes
   */
  async getAllCourses(userid = "", semester = "", year = 0) {
    const body = { Userid: userid, Semester: semester, Year: year };

    return await this.sendPost("/sections/by-semester-year", body);

    //To use this data you must do the following:
    //api.getAllCourses(userid, semester, year).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})
  }

  /**
   * @function getCoursesBySemesterYear() Sends a POST request to the backend /courses/get-by-year-semester endpoint.
   * @param {string} semester semester of the request being sent
   * @param {number} year year of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getCoursesBySemesterYear(semester, year); // status is an object with code and message, data is an array of student outcomes
   */
  async getCoursesBySemesterYear(semester = "", year = 0) {
    const body = {
      semester: semester,
      year: year,
    };

    return await this.sendPost("/courses/get-by-year-semester", body);
  }
  //To use this data you must do the following:
  //api.getCoursesBySemesterYear(semester, year).then(courses => {/*here is where the data is accessible, courses is an array of JSON objects*/})

  /**
   * @function getFormBySection() Sends a POST request to the backend /forms/by-section endpoint.
   * @param {string} userid user id of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} department department of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getFormBySection(userid, year, semester, department, courseNumber, sectionNumber); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function getFormsByCourse() Sends a POST request to the backend /forms/by-course endpoint.
   * @param {string} userid user id of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} department department of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getFormsByCourse(userid, year, semester, department, courseNumber); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function getAllForms() Sends a POST request to the backend /forms/by-semester-year endpoint.
   * @param {string} userid user id of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getAllForms(userid, year, semester); // status is an object with code and message, data is an array of student outcomes
   */
  async getAllForms(userid = "", semester = "", year = 0) {
    const body = { userid: userid, semester: semester, year: year };

    return await this.sendPost("/forms/by-semester-year", body);

    //To use this data you must do the following:
    //api.getAllForms(userid, semester, year).then(courses => {/*here is where the data is accessible, forms is an array of JSON objects*/})
  }

  /**
   * @function postForm() Sends a POST request to the backend /forms endpoint.
   * @param {string} userId user id of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} department department of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @param {boolean} isSectionCompleted boolean of whether the section is completed or not
   * @param {object} outcomes object of outcomes of the request being sent
   * @param {object} ITGrades object of IT grades of the request being sent
   * @param {object} CSGrades object of CS grades of the request being sent
   * @param {object} CEGrades object of CE grades of the request being sent
   * @param {object} CGrades object of C grades of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.postForm(userId, year, semester, department, courseNumber, sectionNumber, isSectionCompleted, outcomes, ITGrades, CSGrades, CEGrades, CGrades); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function postComment() Sends a POST request to the backend /courses/post-comment endpoint.
   * @param {string} userId user id of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} department department of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} coordinatorComment coordinator comment of the request being sent
   * @param {boolean} isCourseCompleted boolean of whether the course is completed or not
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.postComment(userId, year, semester, department, courseNumber, coordinatorComment, isCourseCompleted); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function getBlankForm() Sends a POST request to the backend /forms/new-blank endpoint.
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @param {number} sectionId section id of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getBlankForm(courseNumber, sectionNumber, sectionId); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function getDefaultYearAndSemester() Gets the default year and semester based on the current date.
   * @returns {object} object with year and semester
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { year, semester } = api.getDefaultYearAndSemester(); // year is a number, semester is a string
   */
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

  /**
   * @function addSection() Sends a POST request to the backend /sections/add-section endpoint.
   * @param {string} userid user id of the request being sent
   * @param {string} firstName first name of the request being sent
   * @param {string} lastName last name of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @param {string} department department of the request being sent
   * @param {number} numberOfStudents number of students of the request being sent
   * @param {boolean} isSectionCompleted boolean of whether the section is completed or not
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.addSection(userid, firstName, lastName, year, semester, courseNumber, sectionNumber, department, numberOfStudents, isSectionCompleted); // status is an object with code and message, data is an array of student outcomes
   */
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

  /*
  async getCoursesByDepartment(department = "") {
    const body = {
      department,
    };

    return await this.sendPost("/courses/get-by-department", body);
  } */

  /**
   * @function addProgram() Sends a POST request to the backend /programs/add-program endpoint.
   * @param {string} program program of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.addProgram(program); // status is an object with code and message, data is an array of student outcomes
   */
  async addProgram(program = "") {
    const body = {
      program,
    };

    return await this.sendPost("/programs/add-program", body);
  }

  /**
   * @function getProgramNames() Sends a POST request to the backend /programs/get-program-names endpoint.
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.getProgramNames(); // status is an object with code and message, data is an array of student outcomes
   */
  async getProgramNames() {
    return await this.sendPost("/programs/get-program-names", {});
  }

  /**
   * @function addCourse() Sends a POST request to the backend /courses/add-course endpoint.
   * @param {string} userid user id of the request being sent
   * @param {string} firstName first name of the request being sent
   * @param {string} lastName last name of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} displayName display name of the request being sent
   * @param {string} department department of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.addCourse(userid, firstName, lastName, year, semester, courseNumber, displayName, department); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function removeCourse() Sends a POST request to the backend /courses/remove-course endpoint.
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} department department of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.removeCourse(year, semester, courseNumber, department); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function postCourseOutcomes() Sends a POST request to the backend /course-outcomes/post-outcomes endpoint.
   * @param {array} outcomes array of outcomes of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.postCourseOutcomes(outcomes); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function postSection() Sends a POST request to the backend /sections/post-section endpoint.
   * @param {string} userid user id of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @param {string} department department of the request being sent
   * @param {string} firstName first name of the request being sent
   * @param {string} lastName last name of the request being sent
   * @param {number} numberOfStudents number of students of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.postSection(userid, year, semester, courseNumber, sectionNumber, department, firstName, lastName, numberOfStudents); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function uploadAccessDb() Sends a POST request to the backend /upload-access-db endpoint.
   * @param {FormData} formData form data of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.uploadAccessDb(formData); // status is an object with code and message, data is an array of student outcomes
   */
  async uploadAccessDb(formData = new FormData()) {
    return await this.sendFile("/upload-access-db", formData);
  }

  /**
   * @function uploadStudentWork() Sends a POST request to the backend /student-work/upload endpoint.
   * @param {FormData} formData form data of the request being sent
   * @param {number} outcomeId outcome id of the request being sent
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {number} year year of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.uploadStudentWork(formData, outcomeId, courseNumber, sectionNumber, semester, year); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function downloadStudentWork() Sends a POST request to the backend /student-work/download endpoint.
   * @param {string} fileId file id of the request being sent
   * @param {string} fileName file name of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.downloadStudentWork(fileId, fileName); // status is an object with code and message, data is an array of student outcomes
   */
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

  /**
   * @function deleteStudentWork() Sends a POST request to the backend /student-work/delete endpoint.
   * @param {string} fileId file id of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.deleteStudentWork(fileId); // status is an object with code and message, data is an array of student outcomes
   */
  async deleteStudentWork(fileId = "") {
    const body = {
      fileId,
    };
    return await this.sendPost("/student-work/delete", body);
  }

  /**
   * @function postStudentSurvey() Sends a POST request to the backend /student-surveys/post-survey endpoint.
   * @param {string} courseNumber course number of the request being sent
   * @param {string} sectionNumber section number of the request being sent
   * @param {number} year year of the request being sent
   * @param {string} semester semester of the request being sent
   * @param {string} program program of the request being sent
   * @param {string} classification classification of the request being sent
   * @param {string} anticipatedGrade anticipated grade of the request being sent
   * @param {number[]} outcomeRatings outcome ratings of the request being sent
   * @param {number[]} taRatings ta ratings of the request being sent
   * @param {string} taComment ta comment of the request being sent
   * @param {string} courseComment course comment of the request being sent
   * @returns {object} response object with data and status
   * @example
   * const api = new API(); // create a new API object -- this is typically done in the APIHelper file
   * const { status, data } = await api.postStudentSurvey(courseNumber, sectionNumber, year, semester, program, classification, anticipatedGrade, outcomeRatings, taRatings, taComment, courseComment); // status is an object with code and message, data is an array of student outcomes
   */
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

// Displays an error message to the user
class ErrorObj {
  constructor(message = "", isLoggedIn = true) {
    this.failure = true;
    this.message = message;
    this.isLoggedIn = isLoggedIn;
  }
}
