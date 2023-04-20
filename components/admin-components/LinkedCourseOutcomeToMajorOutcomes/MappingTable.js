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
  LinkToMajorOutcome,
  RemoveLinkToMajorOutcome,
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

const MappingTable3 = ({
  term,
  year,
  department,
  selectCourseNumber,
  majorName,
  selectOutcome,
  refreshTable,
  columns,
  data,
}) => {
  //Toast
  const toast = useToast({ position: "top" });

  const handleLinkedMajorOutcome = async (newLink) => {
    try {
      const linkedMajorOutcomeRes = await LinkToMajorOutcome(
        year,
        term,
        department,
        selectCourseNumber,
        selectOutcome,
        majorName,
        newLink.name
      );
      const status = linkedMajorOutcomeRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error mapping the course outcome to major outcome! Error: ${status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: `Successfuly mapped course outcome: ${selectOutcome} to major outcome: ${newLink.name}`,
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

  const handleRemoveLinkedMajorOutcome = async (deleteLink) => {
    try {
      const linkedMajorOutcomeRes = await RemoveLinkToMajorOutcome(
        year,
        term,
        department,
        selectCourseNumber,
        selectOutcome,
        majorName,
        deleteLink.name
      );
      const status = linkedMajorOutcomeRes.status;
      if (status != "SUCCESS") {
        toast({
          title: "Error",
          description: `There was an error deleting the link! Error: ${status}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      } else {
        toast({
          title: "Success",
          description: `Successfuly deleted major outcome: ${deleteLink.name} from course outcome: ${selectOutcome}`,
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
      title="List of Mapped Major Outcomes"
      editable={{
        onRowAdd: (newLink) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleLinkedMajorOutcome(newLink);
              resolve();
            }, 1000);
          }),
        onRowDelete: (deleteData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleRemoveLinkedMajorOutcome(deleteData);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};
export default MappingTable3;
