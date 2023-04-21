import { Grid, GridItem, Text, Button, useToast } from "@chakra-ui/react";
import EditFacultyMember from "../admin-components/EditFacultyList/EditFacultyMember";
import { deleteFacultyUser } from "../../api/APIHelper";
import { useState } from "react";

const FacultyMember = ({ refreshTable, member, id, color }) => {
  const toast = useToast({position: "top"});
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, SettoggleEdditing] = useState(false);

  const deleteUser = async (id = { id }) => {
    if (window.confirm("Are you sure you want to delete User: " + id)) {
      console.log("Delete ID " + id);
      try {
        const res = await deleteFacultyUser(id);
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
          refreshTable();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleEditing = () => {
    SettoggleEdditing((isEdditing) => !isEdditing);
  };

  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      bg={color}
      padding=".5em"
      alignItems="center"
    >
      {isEditing ? (
        <EditFacultyMember
          refreshTable={refreshTable}
          toggleEditing={toggleEditing}
          id={id}
        />
      ) : (
        <>
          <GridItem rowSpan={"auto"}>
            <Text>Name: {member}</Text>
            <Text>ID: {id}</Text>
          </GridItem>

          <GridItem>
            <Button
              variant="solid"
              onClick={() => {
                toggleEditing();
              }}
              marginRight="1em"
            >
              Edit
            </Button>
            <Button
              variant="solid"
              onClick={() => {
                deleteUser(id);
                refreshTable();
              }}
            >
              Delete
            </Button>
          </GridItem>
        </>
      )}
    </Grid>
  );
};

export default FacultyMember;
