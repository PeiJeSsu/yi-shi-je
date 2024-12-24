import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Informaion_strip({ user, classroomId, rentalDate, isRented ,floor,endTime}) {
    return (
        <Box
            sx={{
                display: 'flex',
                height: '35px',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '20px',
            }}
        >
            <Box sx={{ display: 'flex' }} >
                <Typography variant="body1" sx={{minWidth:"110px"}}>
                    教室代號: {classroomId}
                </Typography>
                <Typography variant="body1" sx={{minWidth:"80px"}}>
                    樓層: {floor}
                </Typography>
                <Typography variant="body1" sx={{minWidth:"150px"}}>
                    借用人: {user}&nbsp;&nbsp;
                </Typography>

                <Typography variant="body1" sx={{minWidth:"270px"}}>
                    出租時間: {rentalDate}&nbsp;&nbsp;
                </Typography>
                <Typography variant="body1"sx={{minWidth:"270px"}}>
                    結束時間: {endTime}&nbsp;&nbsp;
                </Typography>
                <Typography variant="body1"sx={{minWidth:"150px"}}>
                    出租結果: {isRented}&nbsp;&nbsp;
                </Typography>
                
            </Box>
        </Box>
    );
}
