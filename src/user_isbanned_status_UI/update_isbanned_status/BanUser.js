import React, { useLayoutEffect, useState } from "react";
import { Box, Card, CardContent, Button, CardActions, Modal, Fade, ThemeProvider, IconButton, createTheme, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import LastTimeSelector from './LastTimeSelector';
import ErrorSnackbar from "../../custom_snackbar/ErrorSnackbar";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
        background: { default: '#ffffff', paper: '#ffffff' }
    }
});

const BanUser = ({ open, onClose, user, setReload }) => {
    const [inputMonth, setInputMonth] = useState(0);
    const [inputDay, setInputDay] = useState(0);
    const [inputHour, setInputHour] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useLayoutEffect(() => {
        if (open) {
            setInputMonth(0);
            setInputDay(0);
            setInputHour(0);
        }
    }, [open]);

    const calculateBanDuration = () => {
        return (inputMonth * 30 * 24 * 60 * 60) + (inputDay * 24 * 60 * 60) + (inputHour * 60 * 60);
    };

    const handleSubmit = async () => {
        if (inputMonth === 0 && inputDay === 0 && inputHour === 0) {
            setErrorMessage('請至少輸入一個非零的時間');
            setOpenSnackbar(true);
            setTimeout(() => {
                setErrorMessage('請至少輸入一個非零的時間');
                setOpenSnackbar(true);
            }, 100);
            return;
        }
        try {
            const lastTimeInSeconds = calculateBanDuration();

            const response = await axios.patch(`api/users/${user.email}/ban`, lastTimeInSeconds, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                alert('使用者狀態更新成功');
                setReload(true);
                onClose();
            }
        } catch (error) {
            console.error('Error banning user:', error);
            setErrorMessage(error.response.data);
            setOpenSnackbar(true);

        }
    };

    const handleTimeChange = (month, day, hour) => {
        setInputMonth(month);
        setInputDay(day);
        setInputHour(hour);
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
                            <Card variant="outlined" sx={{ width: 400, height: '18em' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <IconButton aria-label="close" onClick={onClose}>
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                                <Box sx={{ paddingTop: 1.5, paddingBottom: 1.5, paddingLeft: 4, paddingRight: 4 }}>
                                    <TextField
                                        label="使用者"
                                        value={user.email.split('@')[0]}
                                        fullWidth
                                        disabled
                                    />
                                </Box>
                                <CardContent sx={{ paddingTop: 1.5, paddingBottom: 2, paddingLeft: 4, paddingRight: 4 }}>
                                    <LastTimeSelector onTimeChange={handleTimeChange} />
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center' }}>
                                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                                        禁用
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    </Fade>
                </Modal>
                <ErrorSnackbar
                    open={openSnackbar}
                    onClose={() => setOpenSnackbar(false)}
                    message={errorMessage}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default BanUser;
