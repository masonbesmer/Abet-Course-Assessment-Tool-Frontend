import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Grid,
  Select,
  Flex,
  VStack,
  useToast,
  GridItem,
} from "@chakra-ui/react";
import {
  getSemesters,
  getMajors,
  getMajorOutcomesBymajor,
} from "../../../../api/APIHelper";
import AddNewOutcomeToMajorTable from "./AddNewMajorOutcomeTable";

const AddNewMajorOutcome = () => {
  useEffect(() => {
    document.getElementById("top").scrollIntoView();
  });

  // State of the courses and function to set the new state.
  const [theCourse, setNewCourses] = useState({
    courses: [],
  });

  const toast = useToast({ position: "top" });
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [theDepartment, setDepartment] = useState("");
  const [semesters, setSemesterList] = useState();
  const [semJson, setSemJson] = useState();
  const [year, setYear] = useState();
  const [term, setTerm] = useState();
  const [majorSelect, setMajorSelect] = useState();
  const [majorsList, setMajorsList] = useState();
  const [outcomeList, setOutcomeList] = useState();

  const getMajorsList = async () => {
    if (!semJson) return;
    const semesterParse = JSON.parse(semJson);
    try {
      const majorListRes = await getMajors(
        semesterParse["term"],
        semesterParse["year"]
      );
      setTerm(semesterParse["term"]);
      setYear(semesterParse["year"]);
      const majorListData = majorListRes.data;
      const status = majorListRes.status;

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
      if (!majorListData) return;
      setMajorsList(majorListData);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Outcome number",
      field: "name",
      width: "6%",
      width: null,
      type: "numeric",
      cellStyle: { width: 150 },
      validate: (rowData) =>
        rowData.name
          ? true
          : "Outcome number can not be empty and can only be number",
    },
    {
      title: "Outcome Description",
      field: "description",
      validate: (rowData) =>
        rowData.description ? true : "Description can not be empty",
    },
  ];

  //Check if the department is select before enable the dropdown for semester
  const checkIfSelectMajor = () => {
    if (!theDepartment) {
      return true;
    }
    return false;
  };

  const checkIfSelectMajorAndSemseter = () => {
    if (!theDepartment || !semJson) {
      return true;
    }
    return false;
  };

  const getSemesterList = async () => {
    if (!theDepartment) return;
    try {
      const semesterlistRes = await getSemesters();
      const res = semesterlistRes.status;
      if (res != "Success") {
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

  const getMajorOutcomeList = async () => {
    if (!semJson || !theDepartment || !majorSelect) return;
    const semesterParse = JSON.parse(semJson);
    try {
      const outcomeListRes = await getMajorOutcomesBymajor(
        semesterParse["year"],
        semesterParse["term"],
        majorSelect
      );
      const outcomeListData = outcomeListRes.data;
      const status = outcomeListRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error fetching the data! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      if (outcomeListData) {
        setOutcomeList(outcomeListData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
  };

  //Fetch semester list on department change
  useEffect(() => {
    getSemesterList();
  }, [theDepartment]);

  useEffect(() => {
    getMajorsList();
  }, [semJson, theDepartment, majorSelect]);

  useEffect(() => {
    getMajorOutcomeList();
  }, [semJson, theDepartment, majorSelect, refreshKey]);

  return (
    <div>
      <VStack id="top" w="90%" m="0 auto">
        <Box m="1em" p="3em">
          <Text align="center" fontSize="2xl" fontWeight="bold" mt="1em">
            Add New Major Outcome
          </Text>

          <Grid templateColumns="repeat(3, 1fr)" gap={1}>
            <GridItem>
              <Select
                id="department"
                width="100%"
                mr="1em"
                isRequired={true}
                placeholder="Select Department"
                borderColor="teal"
                value={theDepartment}
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
              >
                <option value="CSCE">Computer Science & Engineering</option>
              </Select>
            </GridItem>
            <GridItem>
              <Select
                id="term"
                placeholder="Select semester"
                borderColor="teal"
                width="100%"
                isRequired={true}
                value={semJson}
                disabled={checkIfSelectMajor()}
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
            </GridItem>
            <GridItem>
              <Select
                id="term"
                placeholder="Select major"
                borderColor="teal"
                width="100%"
                value={majorSelect}
                isRequired={true}
                disabled={checkIfSelectMajorAndSemseter()}
                onChange={(e) => {
                  setMajorSelect(e.target.value);
                }}
              >
                {majorsList &&
                  majorsList.map((major, idx) => {
                    return (
                      <option value={major.name} key={idx}>
                        {major.name}
                      </option>
                    );
                  })}
              </Select>
            </GridItem>
          </Grid>
        </Box>
      </VStack>
      <Box align="center" w="60%" margin="auto">
        {!semJson && !theDepartment && (
          <Text fontWeight="bold" mt="1em" fontSize="lg" align="center">
            [Table] Waiting for department and semester selection
          </Text>
        )}
        {semJson && theDepartment && (
          <Text fontWeight="bold" mb="1em" fontSize="lg" align="center">
            Outcome Table
          </Text>
        )}

        {semJson && theDepartment && majorSelect && (
          <AddNewOutcomeToMajorTable
            columns={columns}
            data={outcomeList}
            year={year}
            term={term}
            majorName={majorSelect}
            refreshTable={refreshTable}
          />
        )}
      </Box>
    </div>
  );
};
export default AddNewMajorOutcome;
