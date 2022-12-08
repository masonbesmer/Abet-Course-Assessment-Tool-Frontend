//imports
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Grid, Button, Text, Center } from "@chakra-ui/react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { GenerateFullReport } from "../api/APIHelper";
import AdminReportTable from "../components/admin-components/AdminReport/AdminReportTable";
import AdminNavigation from "../components/admin-components/AdminNavigation";

// will need to update when backend is completed
const adminFullReport = ({
  /*semester, year*/ number,
  section,
  semester,
  year,
  id,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeError", (e) => setLoading(false));
    router.events.on("routeChangeStart", (e) => setLoading(false));
    router.events.on("routeChangeComplete", (e) => setLoading(true));

    return () => {
      router.events.off("routeChangeError", (e) => setLoading(false));
      router.events.off("routeChangeStart", (e) => setLoading(false));
      router.events.off("routeChangeComplete", (e) => setLoading(true));
    };
  }, [router.events]);

  //Document to pdf
  var document = {
    content: [
      {
        text: "Spring 2023 Full Report",
        style: "header",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      subheader: {
        fontSize: 12,
        bold: true,
      },
      outcomeHeader: {
        bold: true,
      },
    },
  };

  const [reportITJson, setReportITJson] = useState();
  const [reportCEJson, setReportCEJson] = useState();
  const [reportCSJson, setReportCSJson] = useState();
  const [reportCYSJson, setReportCYSJson] = useState();

  const getReportData = async () => {
    try {
      setLoading(true);
      const reportResponse = await GenerateFullReport(year, semester);
      const reportData = reportResponse.data;
      console.log(reportData);
      if (reportData.CS) {
        setReportCSJson(reportData.CS);
      }
      if (reportData.IT) {
        setReportITJson(reportData.IT);
      }
      if (reportData.CE) {
        setReportCEJson(reportData.CE);
      }
      if (reportData.CYS) {
        setReportCYSJson(reportData.CYS);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

  //Add
  const addMajorGradeToTable = (majorName, majorData) => {
    console.log(document.content.length);
    var pagebreak = "none";
    if (document.content.length > 1) {
      pagebreak = "before";
    }
    let obj = {
      style: "tableExample1",
      color: "#111",
      alignment: "center",
      pageBreak: pagebreak,
      table: {
        widths: [50, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
        headerRows: 1,
        // keepWithHeaderRows: 1,
        body: [
          [
            {},
            {
              text: "Student Outcomes %",
              alignment: "center",
              colSpan: 10,
              style: "outcomeHeader",
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: "Course",
              style: "outcomeHeader",
              colSpan: 1,
              alignment: "center",
            },
            { text: "1", style: "outcomeHeader" },
            { text: "2", style: "outcomeHeader" },
            { text: "3", style: "outcomeHeader" },
            { text: "4", style: "outcomeHeader" },
            { text: "5", style: "outcomeHeader" },
            { text: "6", style: "outcomeHeader" },
            { text: "7", style: "outcomeHeader" },
            { text: "8", style: "outcomeHeader" },
            { text: "9", style: "outcomeHeader" },
            { text: "10", style: "outcomeHeader" },
          ],
        ],
      },
    };
    var index = document.content.length;
    document.content.push(obj);
    console.log(document);
    document.content[index].table.body.unshift([
      {
        text: majorName,
        style: "subheader",
        colSpan: 11,
        alignment: "center",
      },
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
      {},
    ]);

    for (const course in majorData) {
      let ArrOfOutcomes = majorData[course];
      document.content[index].table.body.push([
        {
          text: course,
          style: "tableHeader",
          colSpan: 1,
          alignment: "center",
        },
        { text: ArrOfOutcomes[0] },
        { text: ArrOfOutcomes[1] },
        { text: ArrOfOutcomes[2] },
        { text: ArrOfOutcomes[3] },
        { text: ArrOfOutcomes[4] },
        { text: ArrOfOutcomes[5] },
        { text: ArrOfOutcomes[6] },
        { text: ArrOfOutcomes[7] },
        { text: ArrOfOutcomes[8] },
        { text: ArrOfOutcomes[9] },
      ]);
    }
  };

  const createPdfFile = () => {
    if (reportCSJson) {
      addMajorGradeToTable("Computer Science", reportCSJson);
    }
    if (reportCEJson) {
      addMajorGradeToTable("Computer Engineering", reportCEJson);
    }
    if (reportITJson) {
      addMajorGradeToTable("Information Technology", reportITJson);
    }
    if (reportCYSJson) {
      addMajorGradeToTable("Cyber Security", reportCYSJson);
    }
    pdfMake.createPdf(document).open();
    setTimeout(
      function () {
        window.location.reload();
      }.bind(this),
      1000
    );
  };

  return (
    <>
      <AdminNavigation />
      {loading ? (
        <Center>
          <Text fontSize="6xl">Loading...</Text>
        </Center>
      ) : (
        <Grid templateColumns="repeat(1, 1fr)" gap={8} margin="50px 200px 150px 200px">
          <Button onClick={createPdfFile} colorScheme="teal" w="30%" mt="1%">
            Download pdf
          </Button>
          {reportITJson && (
            <AdminReportTable
              id="MyTable"
              reportITJson={reportITJson}
              majorName={"Information Technology"}
            />
          )}
          {reportCSJson && (
            <AdminReportTable
              reportITJson={reportCSJson}
              majorName={"Computer Science"}
            />
          )}
          {reportCYSJson && (
            <AdminReportTable
              reportITJson={reportCYSJson}
              majorName={"Cyber Security"}
            />
          )}
          {reportCEJson && (
            <AdminReportTable
              reportITJson={reportCEJson}
              majorName={"Computer Engineering"}
            />
          )}
        </Grid>
      )}
    </>
  );
};

adminFullReport.getInitialProps = ({ query }) => {
  return {
    number: query.number,
    section: query.section,
    semester: query.semester,
    year: query.year,
    id: "MT2020",
  };
};

export default adminFullReport;
