import { Grid, GridItem, Text, Button, useToast } from "@chakra-ui/react";
import { deleteMajor } from "../../../api/APIHelper";

const MajorList = ({ refreshTable, majorName, term, year, color }) => {
  const toast = useToast({ position: "top" });

  const handleDeleteMajor = async (majorName, year, term) => {
    try {
      if (
        confirm(
          `Are you sure you want to delete Major: ${majorName} for ${year} ${term}?`
        )
      ) {
        const res = await deleteMajor(majorName, term, year);
        const status = res.status;
        if (status == "SUCCESS") {
          toast({
            description: `Successfuly removed ${majorName} for ${year} ${term}`,
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
      }
    } catch (error) {
      console.log(error);
    }
    refreshTable();
  };

  return (
    <Grid
      templateColumns="repeat(2, 1fr)"
      bg={color}
      padding=".5em"
      alignItems="center"
    >
      <>
        <GridItem rowSpan={"auto"}>
          <Text>
            Major Name: {majorName} Term: {term} Year: {year}
          </Text>
        </GridItem>
        <GridItem>
          <Button
            variant="solid"
            onClick={() => {
              handleDeleteMajor(majorName, year, term);
            }}
            marginLeft={"15em"}
          >
            Delete
          </Button>
        </GridItem>
      </>
    </Grid>
  );
};
export default MajorList;
