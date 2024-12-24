import React, {useState, useEffect} from 'react';
import {Box, Typography, Paper, Button, Grid2} from '@mui/material';
import axios from 'axios';
import FloorAndClassroomCodeSelector from "../floor_and_classroom_code_selection/FloorAndClassroomCodeSelector";
import HistoryDialog from './historyDialog';

export default function ApplyList() {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [reload, setReload] = useState(false);
    const [personalInfo, setPersonalInfo] = useState([]);
    const [open, setOpen] = useState(false);
    const [floor, setFloor] = useState('');  // Changed from null to empty string
    const [classroomCode, setClassroomCode] = useState('');  // Changed from null to empty string

    useEffect(() => {
        axios
            .get('/api/classroom_apply/pending')
            .then((response) => {
                console.log('API Response:', response);
                if (Array.isArray(response.data)) {
                    const sortedApplications = response.data.sort((a, b) => {
                        const floorOrder = ['B1', '1', '2', '3', '4'];
                        if (a.floor !== b.floor) {
                            return floorOrder.indexOf(a.floor) - floorOrder.indexOf(b.floor);
                        }
                        return a.classroom.localeCompare(b.classroom);
                    });
                    setApplications(sortedApplications);
                } else {
                    console.error('The response data is not an array:', response.data);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [reload]);

    useEffect(() => {
        const filtered = applications.filter((app) => {
            const matchesFloor = !floor || app.floor === floor;
            const matchesClassroom = !classroomCode || app.classroom === classroomCode;
            return matchesFloor && matchesClassroom;
        });
        setFilteredApplications(filtered);
    }, [floor, classroomCode, applications]);

    const handleClose = () => {
        setOpen(false);
    };

    const showHistory = async (borrower) => {
        try {
            const response = await axios.get(`https://classroomreservationbackend.onrender.com/api/classroom_apply/borrower/${borrower}`);
            const transformedData = response.data.map((item) => ({
                user: item.borrower,
                classroom: item.classroom,
                rentalDate: new Date(item.startTime).toLocaleDateString(),
                isRented:
                    item.isApproved === null || item.isApproved === undefined
                        ? '尚未審核'
                        : item.isApproved
                            ? '已出租'
                            : '未出租',
            }));
            setPersonalInfo(transformedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('無法加載資料，請稍後再試。');
        }
        setOpen(true);
    };


    const handleApprove = (id) => {
        axios
            .put(`/api/classroom_apply/${id}/approve`)
            .then(() => {
                setReload((prev) => !prev);
            })
            .catch((error) => {
                console.error('Error approving application:', error);
            });
    };

    const handleDeny = (id, reason) => {
        console.log("Reason:", reason);
        axios
            .put(`/api/classroom_apply/${id}/deny`, {reason})
            .then(() => {
                setReload((prev) => !prev);
            })
            .catch((error) => {
                console.error('Error denying application:', error);
            });
    };

    return (
        <Box>
            <Paper elevation={3} sx={{padding: '20px', marginTop: '20px'}}>
                <Grid2 container justifyContent="space-between">
                    <Grid2 item xs={3}>
                        <FloorAndClassroomCodeSelector
                            floor={floor}
                            setFloor={setFloor}
                            classroomCode={classroomCode}
                            setClassroomCode={setClassroomCode}
                            required  // Add required prop to remove default "全部" option
                        />
                    </Grid2>
                </Grid2>
            </Paper>
            <Paper elevation={3} sx={{padding: '20px', marginTop: '20px'}}>
                {filteredApplications.length === 0 ? (
                    <Typography variant="h6" sx={{mt: 2}}>
                        目前沒有符合篩選條件的申請
                    </Typography>
                ) : (
                    filteredApplications.map((result) => (
                        <Box
                            key={result.id}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                marginBottom: '10px',
                                border: '1px solid #ccc',
                                borderRadius: '20px',
                            }}
                        >
                            <Box sx={{display: 'flex', gap: 2}}>
                                <Typography variant="body1">教室編號: {result.classroom}</Typography>
                                <Typography variant="body1" sx={{minWidth: '55px'}}>樓層: {result.floor}</Typography>
                                <Typography variant="body1" sx={{minWidth: '150px'}}>
                                    借用人: {result.borrower ? result.borrower : '未知使用者'}
                                </Typography>
                                <Typography variant="body1">
                                    借用時間: {`${new Date(result.startTime).toLocaleString()} - ${new Date(
                                    result.endTime
                                ).toLocaleString()}`}
                                </Typography>
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    sx={{marginRight: 4}}
                                    onClick={() => showHistory(result.borrower)}
                                >
                                    檢視歷史紀錄
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{marginRight: 4}}
                                    onClick={() => handleApprove(result.id)}
                                >
                                    同意
                                </Button>
                                <Button variant="contained" onClick={() => handleDeny(result.id)}>
                                    不同意
                                </Button>
                            </Box>
                        </Box>
                    ))
                )}
                <HistoryDialog open={open} onClose={handleClose} title="歷史紀錄">
                    {personalInfo.length === 0 ? (
                        <Typography>尚無歷史紀錄</Typography>
                    ) : (
                        personalInfo.map((info, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '20px',
                                }}
                            >
                                <Typography variant="body1" sx={{minWidth: '150px'}}>借用者: {info.user}</Typography>
                                <Typography variant="body1" sx={{minWidth: '120px'}}>教室代號: {info.classroom}</Typography>
                                <Typography variant="body1" sx={{minWidth: '180px'}}>出租日期: {info.rentalDate}</Typography>
                                <Typography variant="body1">出租結果: {info.isRented}</Typography>
                            </Box>
                        ))
                    )}
                </HistoryDialog>
            </Paper>
        </Box>
    );
}