import React from 'react';
import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";

const FloorAndRoomSelection = () => {
    return (
        <div>
            <TextField label="選擇樓層" select fullWidth />
            <Box sx={{ marginTop: 2 }} />
            <TextField label="選擇教室編號" select fullWidth />
        </div>
    );
};

export default FloorAndRoomSelection;
