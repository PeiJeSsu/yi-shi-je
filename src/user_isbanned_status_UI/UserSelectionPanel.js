import React from 'react';
import { Grid2, Paper } from '@mui/material';
import UserSelector from "./UserSelector";

const UserSelectionPanel = ({user, setUser}) => {
    // console.log('UserSelectionPanel', user);

    return (
        <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
            <Grid2 container spacing={5}>
                <Grid2 item xs={3}>
                    <UserSelector user={user} setUser={setUser} disabled={false}></UserSelector>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default UserSelectionPanel;
