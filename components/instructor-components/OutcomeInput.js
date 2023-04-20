import React, { useState} from 'react';
import {Box, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,Text, Divider, List, ListItem, Input, IconButton} from '@chakra-ui/core';
import useInputState from '../../hooks/useInputState';

const OutcomeInput = ({outcome, index, studentsByMajor, currentStudentWorks}) => {
    //console.log(currentStudentWorks);
    const [studentWork, setStudentWork, reset] = useInputState("");
    console.log(currentStudentWorks.length);
    const [studentWorks, setStudentWorks] = useState([currentStudentWorks]);
    const addStudentWork = event => {
        event.preventDefault();
        setStudentWorks([
            ...studentWorks,
            {
                id: studentWorks.length,
                studentWork: studentWork
            }
        ]);
        reset();
    }

    const removeStudentWork = (id) => {
        event.preventDefault();
        setStudentWorks(studentWorks.filter(work => work.id !== id));
    } 
    console.log(studentWorks.length);
    const renderStudentWork = studentWorks.map((work, index) => {
        return(
            <Box display="flex" alignItems="center">
                <ListItem color="">{work[index].studentWork}</ListItem>
                <IconButton ml="1rem" icon="delete" onClick={(e)=>{
                    e.preventDefault();
                    removeStudentWork(work.id)
                }}></IconButton>
                <IconButton ml="1rem" icon="attachment"></IconButton>
            </Box>
        )
    });
   
    const renderStudentNumberMenu = Object.keys(studentsByMajor).map( (key, idx) => {
        const [value, setValue] = useState(0);
        return (
            <Box>
                <Text >{key}</Text>
                <NumberInput min={0} max={studentsByMajor[key]} value={value} onChange={value=>{
                        value > studentsByMajor[key] ? setValue(0) : setValue(value);
                    }}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Text color="green.500" fontWeight="bold">{ Math.round( value/studentsByMajor[key]*100 )  + "%" }</Text>
            </Box>
        )
    })

    return(
        <div>
            <div className="outcome-input">
                <div className="vertical-container">
                    <Text fontSize="lg" fontWeight="bold">Course Outcome {++index}</Text>
                    <Text fontSize="lg">"{outcome}"</Text>
                </div>
                <div className="vertical-container">
                    <Text fontSize="lg" fontWeight="bold">Student Work Used</Text>
                    <List styleType="disc">
                        {renderStudentWork}
                    </List>
                    <form onSubmit={addStudentWork}>
                        <Input 
                            placeholder="add student work" 
                            variant="flushed" 
                            type="text" 
                            value={studentWork} 
                            onChange={setStudentWork}
                        />
                    </form>
                </div>
                <div className="vertical-container">
                    <Text fontSize="lg" fontWeight="bold">Number of Students Who Achieved 75% of this Outcome</Text>
                    <div className="student-outcome-container">
                        {renderStudentNumberMenu}
                    </div>
                </div>
            </div>
            <Divider borderColor="black"/>
        </div>
    )
}

export default OutcomeInput;