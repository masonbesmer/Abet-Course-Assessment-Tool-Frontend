//imports
import { useEffect, useState } from 'react';
import {
    VStack,
    Button,
    Text,
    Box,
    Flex,
    Center,
    Textarea
} from "@chakra-ui/react";

//api
import { getFormBySection } from '../api/APIHelper';
import ReportGrades from '../components/report-components/ReportGrades';
import ReportOutcomesTable from '../components/report-components/ReportOutcomesTable';


const report = ({ number, section, semester, year, id }) => {
    const [form, setForm] = useState();
    const getForm = async () => {
        const formData = await getFormBySection(id, 2020, "Fall", "CSCE", number.toString(), section);
        setForm(formData);
    };
    console.log(form);

    // retrieves the form data and sets the state when the page (component) loads (mounts)
    useEffect(() => {
        getForm();
    }, []);

    return (
        <Center>
            {form ? (
                <Flex mt="2em" direction="column" w="90%">
                    <Box w="80%">
                        <Text fontSize="2xl" fontWeight="bold">
                            {form.section.department} {number}.{section}
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color="green" mb="2em">
                            ABET Course Assesment
                        </Text>
                    </Box>
                    <ReportGrades csGrades={form.csGrades} ceGrades={form.ceGrades} itGrades={form.itGrades} cGrades={form.cGrades} />
                    <ReportOutcomesTable courseOutcomes={form.outcomes} />
                    <Text fontSize="xl" fontWeight="bold" mb="1em">
                        Instructor Comments
                    </Text>
                    <Box
                        m="2em"
                        padding="1em"
                        bg="#edf2f7"
                        borderRadius="4px"
                    >
                        <Text bg="white" padding="1em">
                            Best students I've ever had.
                        </Text>
                    </Box>
                </Flex>)
                : null
            }
        </Center>
    )
}

report.getInitialProps = ({ query }) => {
    return {
        number: query.number,
        section: query.section,
        semester: query.semester,
        year: query.year,
        id: 'MT2020'
    };
}

export default report;