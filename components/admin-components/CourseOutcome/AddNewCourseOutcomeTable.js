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
import {
  addNewCourseOutcome,
  deleteCourseOutcome,
} from "../../../api/APIHelper";

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

const AddNewCourseOutcomeTable = ({
  term,
  year,
  department,
  selectCourseNumber,
  majorName,
  refreshTable,
  columns,
  data,
}) => {
  //Toast
  const toast = useToast({ position: "top" });

  //Handle remove
  const handleRemoveOutcome = async (oldData) => {
    console.log(majorName);
    try {
      const deleteRes = await deleteCourseOutcome(
        year,
        term,
        department,
        selectCourseNumber,
        oldData.name
      );
      const status = deleteRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error deleting the course! Error: ${status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          description: `Successfully deleted`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
    refreshTable();
  };

  //Handle add
  const handleAddOutcomeToCourse = async (newData) => {
    console.log(newData);
    console.log(term, year, department, selectCourseNumber);
    try {
      const res = await addNewCourseOutcome(
        year,
        term,
        department,
        selectCourseNumber,
        String(newData.name),
        newData.description
      );
      const status = res.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error adding the course! Error: ${status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: `Successfully add new outcome: ${newData.name} to course: ${selectCourseNumber}! Please refresh the page if you don't see the new change.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      refreshTable();
    } catch (error) {
      console.log(error);
    }
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
      title=" "
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleAddOutcomeToCourse(newData);
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              console.log(oldData);
              handleRemoveOutcome(oldData);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};
export default AddNewCourseOutcomeTable;
