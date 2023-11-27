import React from "react";

import { useToast } from "@chakra-ui/react";
import {
  addFacultyMember,
  editFacultyUser,
  removeRoleFromUser,
  addRoleToUser,
  deleteFacultyUser,
} from "../../../api/APIHelper";

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

const FacultyTable = ({ columns, data, selectFaculty, refreshTable }) => {
  const toast = useToast({ position: "top" });

  const handleAddFaculty = async (newUser) => {
    console.log(newUser);
    if (!newUser.lastName || !newUser.firstName || !newUser.euid) {
      toast({
        description: "Required field empty!",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      const res = await addFacultyMember(
        newUser.lastName,
        newUser.firstName,
        newUser.euid,
        selectFaculty
      );
      console.log(res);
      const status = res.status;
      console.log(status);
      
      const roleRes = await addRoleToUser (
        newUser.euid, selectFaculty
      );
      console.log(roleRes);
      const roleStatus = roleRes.status;
      console.log(roleStatus)
      
      if (status == "SUCCESS") {
        toast({
          description: `Successfully added the new faculty member! Please refresh the page if you don't see the new change.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else if (roleStatus == "SUCCESS") {
        toast({
          description: `Role added to existing user! Please refresh the page if you don't see the new change.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          description: `There was an error! Message: ${status} `,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
    refreshTable();
  };

  const handleRemoveFaculty = async (oldData) => {
    try {
      const res = await deleteFacultyUser(oldData.euid, selectFaculty);
      if (res) {
        console.log(res);
        if (res.status == "SUCCESS") {
          toast({
            description: `User successfully deleted! Please refresh the page if you don't see the new change.`,
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            description: `There was an error! Message: ${res.status} `,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    refreshTable();
  };

  const handleEditFaculty = async (newUser, oldUser) => {
    try {
      const res = await editFacultyUser(
        newUser.firstName,
        newUser.lastName,
        oldUser.euid,
        newUser.euid
      );
      const status = res.status;
      console.log(res);
      if (status == "SUCCESS") {
        toast({
          description: `Change Successful! Please refresh the page if you don't see the new change.`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          description: `There was an error! Message: ${status} `,
          status: "error",
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
      options={{
        search: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
      }}
      icons={tableIcons}
      columns={columns}
      data={data}
      title="Faculty List"
      editable={{
        onRowUpdate: () =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          }),
        onRowAdd: (newUser) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleAddFaculty(newUser);
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleRemoveFaculty(oldData);
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newUser, oldUser) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleEditFaculty(newUser, oldUser);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};
export default FacultyTable;
