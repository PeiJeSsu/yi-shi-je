import React from 'react';
import {Grid2, Paper} from '@mui/material';
import FloorAndClassroomCodeSelector from "../floor_and_classroom_code_selection/FloorAndClassroomCodeSelector";
import DisplayIsBanned from "./DisplayIsBanned";

const ClassroomQueryPaper = ({ floor, setFloor, classroomCode, setClassroomCode, isBanned, setIsBanned, displayReload, setDisplayReload }) => {
    const userEmail = localStorage.getItem("userEmail");
    // console.log(localStorage);

    return (
        <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px'}}>
            <Grid2 container justifyContent="space-between" >
                <Grid2 item xs={3} >
                    <FloorAndClassroomCodeSelector floor={floor} setFloor={setFloor} classroomCode={classroomCode} setClassroomCode={setClassroomCode} />
                </Grid2>
                <Grid2 item xs={3} sx={{ display: 'flex', alignItems: 'center'}}>
                    <DisplayIsBanned
                        userEmail={userEmail} isBanned={isBanned} setIsBanned={setIsBanned}
                        displayReload={displayReload} setDisplayReload={setDisplayReload}
                    />
                </Grid2>
            </Grid2>

        </Paper>
    );
};

export default ClassroomQueryPaper;