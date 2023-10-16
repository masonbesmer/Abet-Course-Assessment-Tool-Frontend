import React, { useState, useEffect } from "react";
import { Box, Text, Select, Flex, VStack, useToast } from "@chakra-ui/react";
import {
  getSemesters,
  deleteSemester,
  addNewSemester,
} from "../../../api/APIHelper";
import SemesterTable from "./SemesterTable";
import { SingleSelect } from "react-select-material-ui";

const EditSemesterList = () => {
  const toast = useToast({ position: "top" });
  const [refreshKey, setRefreshKey] = useState(0); //For refreshing the table
  const [semesters, setSemesterList] = useState();

  const columns = [
    {
      title: "Year",
      field: "year",
      type: "numeric",
      validate: (rowData) =>
        rowData.year ? true : "Year cannot be empty and must be numeric",
    },
    {
      title: "Term",
      field: "term",
      validate: (rowData) =>
        rowData.term ? true : "Term cannot be empty",
        lookup: { Summer: "Summer", Fall: "Fall", Winter: "Winter", Spring: "Spring" },
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

  const refreshTable = () => {
    setRefreshKey(refreshKey + 1);
  };

  //Fetch semester list on semester change w={{ base: "80%", sm: "80%"}}>
  useEffect(() => {
    getSemesterList();
  }, [refreshKey]);

  return (
    <div>
      <Box align="center" margin="auto" w={{ base:"80%", md: "30%"}}>
          <Text
            fontWeight="bold"
            mt="1em"
            mb="1em"
            fontSize="lg"
            align="center"
          >
            Semesters Table
          </Text>
          <SemesterTable
            columns={columns}
            data={semesters}
            refreshTable={refreshTable}
          />
      </Box>
    </div>
  );
};
export default EditSemesterList;