import React, {useLayoutEffect, useState} from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {CardActions, createTheme, Fade, Modal, ThemeProvider} from '@mui/material';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import DateTimeSelection from './DateTimeSelection';
import FloorAndClassroomCodeSelector from "../floor_and_classroom_code_selection/FloorAndClassroomCodeSelector";
import ErrorSnackbar from '../custom_snackbar/ErrorSnackbar';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(timezone);

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#1976d2'},
        secondary: {main: '#dc004e'},
        background: {default: '#ffffff', paper: '#ffffff'}
    }
});

const Makechoice = ({open, onClose, initialFloor, initialClassroomCode, setDisplayReload}) => {
    const [floor, setFloor] = useState(initialFloor);
    const [classroomCode, setClassroomCode] = useState(initialClassroomCode);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [snackbar, setSnackbar] = useState({open: false, message: ''});
    const userEmail = localStorage.getItem("userEmail");

    const handleSnackbarClose = () => {
        setSnackbar({open: false, message: ''});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!startTime || !endTime) {
            setSnackbar({ open: true, message: 'Start Time and End Time must not be null!' });
            return;
        }

        try {
            const startTimeInUTC8 = startTime ? dayjs(startTime).tz('Asia/Taipei').format() : null;
            const endTimeInUTC8 = endTime ? dayjs(endTime).tz('Asia/Taipei').format() : null;

            const borrower = localStorage.getItem("userName");
            if (!borrower) {
                setSnackbar({ open: true, message: '未找到借用者！' });
                return;
            }
            const params = {
                floor,
                classroomCode,
                startTime: startTimeInUTC8,
                endTime: endTimeInUTC8,
                borrower,
                userEmail,
            };

            // console.log("borrower userEmail", userEmail);
            console.log(startTime.toISOString(), endTime.toISOString());

            const response = await axios.post('/api/classroom_apply/apply', null, { params });

            if (response.status === 200) {
                const responseData = response.data;
                alert('申請成功: ' + responseData);
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                if (errorData === 'User is banned. Should not apply classroom.') {
                    setDisplayReload(true);
                    onClose(true);
                    alert('您已經被禁用申請權限，系統將自動刷新頁面，禁用訊息顯示於右上角');
                }
                setSnackbar({ open: true, message: '申請失敗: ' + errorData });
            } else {
                setSnackbar({ open: true, message: '申請失敗: ' + error.message });
            }
        }
    };


    useLayoutEffect(() => {
        if (open) {
            setFloor(initialFloor);
            setClassroomCode(initialClassroomCode);
        }
    }, [initialFloor, initialClassroomCode, open]);

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
                            <Card variant="outlined" sx={{width: '%', height: '17em'}}>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end',}}>
                                    <IconButton aria-label="close" onClick={onClose}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box>
                                <Box sx={{paddingTop: 1.5, paddingBottom: 1.5, paddingLeft: 4, paddingRight: 4}}>
                                    <FloorAndClassroomCodeSelector
                                        floor={floor} setFloor={setFloor}
                                        classroomCode={classroomCode} setClassroomCode={setClassroomCode}
                                    />
                                </Box>
                                <CardContent sx={{paddingTop: 1.5, paddingBottom: 2, paddingLeft: 4, paddingRight: 4}}>
                                    <DateTimeSelection startDateTime={startTime} setStartDateTime={setStartTime}
                                                       endDateTime={endTime} setEndDateTime={setEndTime}
                                    />
                                </CardContent>
                                <CardActions sx={{justifyContent: 'center'}}>
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

export default Makechoice;
