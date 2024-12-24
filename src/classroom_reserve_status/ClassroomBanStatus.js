import React, { useLayoutEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { CardActions, createTheme, Fade, Modal, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import FloorAndClassroomCodeSelector from "../floor_and_classroom_code_selection/FloorAndClassroomCodeSelector";
import ErrorSnackbar from '../custom_snackbar/ErrorSnackbar';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import LastTimeSelector from "../user_isbanned_status_UI/update_isbanned_status/LastTimeSelector";
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(timezone);

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
        background: { default: '#ffffff', paper: '#ffffff' }
    }
});

const ClassroomBanStatus = ({ open, onClose, initialFloor, initialClassroomCode, setReload }) => {
    const [floor, setFloor] = useState(initialFloor);
    const [classroomCode, setClassroomCode] = useState(initialClassroomCode);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [inputMonth, setInputMonth] = useState(0);
    const [inputDay, setInputDay] = useState(0);
    const [inputHour, setInputHour] = useState(0);

    const handleSnackbarClose = () => {
        setSnackbar({ open: false, message: '' });
    };

    const handleSubmit = async () => {
        try {
            if (inputMonth === 0 && inputDay === 0 && inputHour === 0) {
                setSnackbar({ open: true, message: '請至少輸入一個非零的時間' });
                return;
            }

            const unbanTime = calculateBanDuration();

            const response = await axios.patch(`https://classroomreservationbackend.onrender.com/classroom_build/${classroomCode}/ban`, null, {
                params: { unbanTime },
            });

            if (response.status === 200) {
                alert(`教室已成功禁用`);
                setReload(true);
                onClose();
            } else {
                setSnackbar({ open: true, message: `禁用失敗: ${response.data}` });
            }
        } catch (error) {
            setSnackbar({ open: true, message: `禁用失敗: ${error.response?.data || error.message}` });
        }
    };

    useLayoutEffect(() => {
        if (open) {
            setFloor(initialFloor);
            setClassroomCode(initialClassroomCode);
        }
    }, [initialFloor, initialClassroomCode, open]);

    const handleTimeChange = (month, day, hour) => {
        setInputMonth(month);
        setInputDay(day);
        setInputHour(hour);
    };

    const calculateBanDuration = () => {
        return (inputMonth * 30 * 24 * 60 * 60) + (inputDay * 24 * 60 * 60) + (inputHour * 60 * 60);
    };

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Modal open={open} onClose={onClose} closeAfterTransition>
                    <Fade in={open}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            <Card variant="outlined" sx={{ width: '30%', height: '17em' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                                    <IconButton aria-label="close" onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ paddingTop: 1.5, paddingBottom: 1.5, paddingLeft: 4, paddingRight: 4 }}>
                                    <FloorAndClassroomCodeSelector
                                        floor={floor} setFloor={setFloor}
                                        classroomCode={classroomCode} setClassroomCode={setClassroomCode}
                                    />
                                </Box>
                                <CardContent sx={{ paddingTop: 1.5, paddingBottom: 2, paddingLeft: 4, paddingRight: 4 }}>
                                    <LastTimeSelector onTimeChange={handleTimeChange} />
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        提交
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </Fade>
                </Modal>
            </LocalizationProvider>
            <ErrorSnackbar
                open={snackbar.open}
                onClose={handleSnackbarClose}
                message={snackbar.message}
            />
        </ThemeProvider>
    );
};

export default ClassroomBanStatus;
