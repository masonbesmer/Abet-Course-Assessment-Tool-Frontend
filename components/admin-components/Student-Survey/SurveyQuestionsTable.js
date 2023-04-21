import React from "react";

import { useToast } from "@chakra-ui/react";
import { saveQuestions } from "../../../api/APIHelper";

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

const SurveyQuestionsTable = ({
  columns,
  data,
  selectQuestionSet,
  year,
  term,
  refreshTable,
}) => {
  const toast = useToast({ position: "top" });

  Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
  };

  Array.prototype.swapItems = function (a, b) {
    this[a] = this.splice(b, 1, this[a])[0];
    return this;
  };

  //Handle adding questions
  const handleAddQuestion = async (newQuestion) => {
    try {
      var newQuestionsArray;
      var newQuestionsArray = data.map(function (question) {
        return question["question"];
      });
      if (!newQuestion.id) {
        newQuestionsArray.push(newQuestion.question);
      } else {
        newQuestionsArray.insert(newQuestion.id, newQuestion.question);
      }
      console.log(newQuestionsArray);

      const res = await saveQuestions(
        year,
        term,
        selectQuestionSet,
        newQuestionsArray
      );
      const status = res.status;
      if (status == "SUCCESS") {
        toast({
          description: `Successfully added the new question! Please refresh the page if you don't see the new change.`,
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
      refreshTable();
    } catch (error) {
      console.log(error);
    }
  };

  //Handle remove question
  const handleRemoveQuestion = async (oldQuestion) => {
    try {
      var questionsArray;
      var questionsArray = data.map(function (question) {
        return question["question"];
      });
      const index = questionsArray.indexOf(oldQuestion.question); // Find the index of the question
      if (index > -1) {
        questionsArray.splice(index, 1); //Remove the question
      }
      console.log(questionsArray);
      //Save questions by calling api
      const res = await saveQuestions(
        year,
        term,
        selectQuestionSet,
        questionsArray
      );
      const status = res.status;
      if (status == "SUCCESS") {
        toast({
          description: `Successfully deleted the question! Please refresh the page if you don't see the new change.`,
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
      refreshTable();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditQuestion = async (newQuestion, oldQuestion) => {
    try {
      var questionsArray;
      var questionsArray = data.map(function (question) {
        return question["question"];
      });

      //handle text change
      if (newQuestion.question != oldQuestion.question) {
        const index = questionsArray.indexOf(oldQuestion.question); // Find the index of the question
        if (index > -1) {
          questionsArray[index] = newQuestion.question;
        }
      }

      //Handle id or order change
      if (newQuestion.id != oldQuestion.id) {
        questionsArray.swapItems(oldQuestion.id, newQuestion.id);
      }

      console.log(questionsArray);

      const res = await saveQuestions(
        year,
        term,
        selectQuestionSet,
        questionsArray
      );
      const status = res.status;
      if (status == "SUCCESS") {
        toast({
          description: `Successfully edited the question! Please refresh the page if you don't see the new change.`,
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
      refreshTable();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MaterialTable
      options={{
        search: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        tableLayout: "auto",
      }}
      icons={tableIcons}
      columns={columns}
      data={data}
      title=""
      editable={{
        onRowUpdate: () =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          }),
        onRowAdd: (newQuestion) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleAddQuestion(newQuestion);
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldQuestion) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleRemoveQuestion(oldQuestion);
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newQuestion, oldQuestion) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              handleEditQuestion(newQuestion, oldQuestion);
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};
export default SurveyQuestionsTable;
