import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Box, Modal, Fade, Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import axios from 'axios';

const ExportScheduleButton = ({ classroom }) => {
    const [open, setOpen] = useState(false);
    const [selectedMonday, setSelectedMonday] = useState(dayjs().startOf('week').add(1, 'day'));
    const [weekRange, setWeekRange] = useState("");
    const [reservations, setReservations] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const calculateWeekRange = (monday) => {
        const weekDates = Array.from({ length: 5 }, (_, i) =>
            monday.add(i, 'day').format('MM/DD')
        );
        return `${weekDates[0]} ~ ${weekDates[4]}`;
    };

    const handleDateChange = (newDate) => {
        const monday = newDate.startOf('week').add(1, 'day');
        setSelectedMonday(monday);
        setWeekRange(calculateWeekRange(monday));
    };
    useEffect(() => {
        setWeekRange(calculateWeekRange(selectedMonday));
    }, [selectedMonday]);
    const fetchReservations = async () => {
        try {
            const startDate = selectedMonday.format('YYYY-MM-DDTHH:mm:ss');
            const endDate = selectedMonday.add(4, 'day').endOf('day').format('YYYY-MM-DDTHH:mm:ss');

            const response = await axios.get('https://classroomreservationbackend.onrender.com/api/classroom_apply/search', {
                params: {
                    floor: classroom.floor,
                    roomNumber: classroom.roomNumber,
                    startTime: startDate,
                    endTime: endDate,
                },
            });

            const approvedReservations = response.data.filter(app => app.isApproved);
            setReservations(approvedReservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();

        const timeSlots = [
            "08:00 ~ 09:00", "09:00 ~ 10:00", "10:00 ~ 11:00", "11:00 ~ 12:00",
            "12:00 ~ 13:00", "13:00 ~ 14:00", "14:00 ~ 15:00", "15:00 ~ 16:00",
            "16:00 ~ 17:00", "17:00 ~ 18:00", "18:00 ~ 19:00", "19:00 ~ 20:00"
        ];

        const weekDates = Array.from({ length: 5 }, (_, i) =>
            selectedMonday.add(i, 'day').format('YYYY-MM-DD')
        );

        const formattedReservations = reservations.flatMap(res => {
            const start = dayjs(res.startTime);
            const end = dayjs(res.endTime);

            const slots = [];
            let current = start;

            while (current.isBefore(end)) {
                const nextSlot = current.add(1, 'hour');
                slots.push({
                    date: current.format('YYYY-MM-DD'),
                    time: `${current.format('HH:mm')} ~ ${nextSlot.format('HH:mm')}`
                });
                current = nextSlot;
            }
            return slots;
        });

        doc.setFontSize(16);
        doc.text(`Classroom Schedule - ${classroom.roomNumber}`, 14, 10);
        doc.text(`Week: ${weekRange}`, 14, 20);

        const tableColumns = ["Time Slot", ...weekDates];
        const tableRows = timeSlots.map(timeSlot => {
            const row = [timeSlot];
            weekDates.forEach(date => {
                const reserved = formattedReservations.some(res =>
                    res.date === date && res.time === timeSlot
                );
                row.push(reserved ? "X" : "");
            });
            return row;
        });

        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: 30,
        });
        const startDate = selectedMonday.format('YYYYMMDD');
        const endDate = selectedMonday.add(4, 'day').format('YYYYMMDD');
        const filename = `Classroom_${classroom.roomNumber}_Schedule_${startDate}~${endDate}.pdf`;

        doc.save(filename);
        handleClose();
    };

    useEffect(() => {
        if (isExporting) {
            exportToPDF();
            setIsExporting(false);
        }
    }, [reservations, setReservations]);

    const handleExport = async () => {
        setIsExporting(true);
        await fetchReservations();
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                匯出
            </Button>
            <Modal open={open} onClose={handleClose} closeAfterTransition>
                <Fade in={open}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Card sx={{ width: '30%', padding: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton aria-label="close" onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ mb: 3 }}>教室編號: {classroom.roomNumber}</Typography>
                                <Typography variant="h5" sx={{ mb: 4 }}>選擇要匯出的週</Typography>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Select Monday"
                                        value={selectedMonday}
                                        onChange={handleDateChange}
                                        shouldDisableDate={(date) => date.day() !== 1}
                                    />
                                </LocalizationProvider>
                                {weekRange && (
                                    <Typography sx={{ mt: 3 }}>選擇的日期範圍：{weekRange}</Typography>
                                )}
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'center' }}>
                                <Button variant="contained" color="primary" onClick={handleExport}>
                                    匯出 PDF
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default ExportScheduleButton;
