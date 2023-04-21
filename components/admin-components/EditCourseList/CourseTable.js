//Chakra
import { useToast } from "@chakra-ui/react";

//Table related
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

//API
import { deleteCourse, addNewCourse, editCourse } from "../../../api/APIHelper";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const CourseTable = ({
  theDepartment,
  columns,
  data,
  year,
  term,
  coordinatorList,
  refreshTable,
}) => {
  //Toast
  const toast = useToast({ position: "top" });

  //Handle remove
  const handleRemoveCourse = async (department, courseName) => {
    console.log(term, year, department, courseName);
    try {
      const deleteRes = await deleteCourse(term, year, department, courseName);
      const status = deleteRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error deleting the course! Error: ${status}`,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: `Course ${courseName} deleted`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
    refreshTable();
  };

  //Handle add
  const handleAddCourse = async (newCourse) => {
    try {
      var coordinatorEUID;
      console.log(newCourse);
      if (coordinatorList) {
        for (let key in coordinatorList) {
          if (coordinatorList[key].label == newCourse.coordinatorEUID) {
            coordinatorEUID = coordinatorList[key].coordinatorEUID;
            console.log(coordinatorEUID);
          }
        }
      }
      if (!coordinatorEUID) {
        toast({
          title: "Error",
          description: `Please select an instructor before adding!`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      var isCourseCompletedBool = JSON.parse(newCourse.isCourseCompleted);
      const res = await addNewCourse(
        year,
        term,
        0,
        coordinatorEUID,
        newCourse.courseNumber,
        newCourse.displayName,
        " ",
        isCourseCompletedBool,
        theDepartment
      );
      const status = res.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error adding the course! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: `Successfully added the new course! Please refresh the page if you don't see the new change.`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      refreshTable();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCourse = async (newData, oldData) => {
    console.log(newData);
    var isCourseCompletedBool = JSON.parse(newData.isCourseCompleted);

    try {
      var coordinatorEUID;
      if (coordinatorList) {
        for (let key in coordinatorList) {
          if (coordinatorList[key].label == newData.coordinatorEUID) {
            coordinatorEUID = coordinatorList[key].coordinatorEUID;
            console.log(coordinatorEUID);
          }
        }
      }
      if (!coordinatorEUID) {
        coordinatorEUID = oldData.coordinatorEUID;
      }

      const deleteRes = await editCourse(
        term,
        year,
        theDepartment,
        oldData.courseNumber,
        coordinatorEUID,
        newData.courseNumber,
        newData.displayName,
        "Hi",
        isCourseCompletedBool,
        theDepartment
      );
      const status = deleteRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error editing the course! Error: ${status}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: `Course ${oldData.displayName} Edited`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
    refreshTable();
  };

  return (
    <MaterialTable
      icons={tableIcons}
      options={{
        search: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
      }}
      columns={columns}
      data={data}
      title="Course List"
      editable={{
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleEditCourse(newData, oldData);
              resolve();
            }, 1000);
          }),
        onRowAdd: (newCourse) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleAddCourse(newCourse);
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleRemoveCourse(oldData.department, oldData.courseNumber);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};
export default CourseTable;
