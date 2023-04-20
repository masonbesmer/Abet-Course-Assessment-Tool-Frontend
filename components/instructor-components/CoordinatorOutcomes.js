import React from 'react';
import {Text, Divider, List} from '@chakra-ui/react';

const CoordinatorOutcomes = ({outcome, index, result}) => {
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
                        {/* TODO: insert list of student work attachments here */}
                    </List>
                </div>
                <div className="vertical-container">
                    <Text fontSize="lg" fontWeight="bold">Number of Students Who Achieved 75% of this Outcome</Text>
                    <div className="student-outcome-container">
                        {/* TODO: insert percentages of student results here */}
                    </div>
                </div>
            </div>
            <Divider borderColor="black"/>
        </div>
    )
}

export default CoordinatorOutcomes;