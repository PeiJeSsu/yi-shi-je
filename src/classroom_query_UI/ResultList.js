import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import axios from 'axios';
import ClassroomStatusButton from "../classroom_status_UI/ClassroomStatusButton";
import MakeChoiceButton from "../MakeTimeChoice/MakeChoiceButton";
import UpdateKeyStatusButton from "../key_status_UI/UpdateKeyStatusButton";
import ExportScheduleButton from "../export/ExportScheduleButton";
import ClassroomBanStatusButton from "../classroom_reserve_status/ClassroomBanStatusButton";
import ClassroomUnbanStatusButton from "../classroom_reserve_status/ClassroomUnbanStatusButton";
export default function ResultList({ floor, classroomCode, reload, setReload, isBanned, setDisplayReload }) {
    const [classrooms, setClassrooms] = useState([]);
    const userRole = localStorage.getItem("userRole");



    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                let url = '/classroom_build/all';
                if (classroomCode) {
                    url = `/classroom_build/room/${classroomCode}`;
                } else if (floor) {
                    url = `/classroom_build/floor/${floor}`;
                }
                const response = await axios.get(url);
                const classroomData = Array.isArray(response.data) ? response.data : [response.data];
                setClassrooms(classroomData);
                console.log(classroomData);
            } catch (error) {
                console.error("Error fetching classroom data", error);
            }
        };

        fetchClassrooms();

        if (reload) {
            setReload(false);
        }
    }, [floor, classroomCode, reload, setReload]);

    return (
        <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
            {classrooms.length === 0 ? (
                <Typography variant="body1">沒有找到相關的教室。</Typography>
            ) : (
                classrooms.map((classroom) => (
                    <Box
                        key={classroom.id}
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
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="body1" sx={{ minWidth: '110px' }}>教室編號: {classroom.roomNumber}</Typography>
                            <Typography variant="body1" sx={{ minWidth: '60px' }}>樓層: {classroom.floor}</Typography>
                            <Typography variant="body1" sx={{ minWidth: '120px' }}>
                                教室狀態: {classroom.banned ? '不可用' : '可用'}
                            </Typography>
                            {userRole !== "borrower" && (
                                <>
                                    <Typography variant="body1" sx={{ minWidth: '160px' }}>鑰匙狀態: {classroom.keyStatus}</Typography>
                                    {classroom.borrower && (
                                        <Typography variant="body1">借用人: {classroom.borrower.split('@')[0]}</Typography>
                                    )}
                                </>
                            )}

                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2
                            }}
                        >
                            {userRole !== "borrower" && (
                                <ExportScheduleButton variant="contained" classroom={classroom} />
                            )}
                            <ClassroomStatusButton variant="contained" initialFloor={classroom.floor} initialClassroomCode={classroom.roomNumber} />
                            <MakeChoiceButton variant="contained" initialFloor={classroom.floor} initialClassroomCode={classroom.roomNumber} isBanned={isBanned || classroom.banned} setDisplayReload={setDisplayReload}/>
                            {userRole !== "borrower" && (
                                <>
                                    <ClassroomBanStatusButton variant="contained" initialFloor={classroom.floor} initialClassroomCode={classroom.roomNumber} setReload={setReload}/>
                                    <ClassroomUnbanStatusButton variant="contained" initialClassroomCode={classroom.roomNumber} isBanned={classroom.banned} setReload={setReload} />
                                </>
                            )}
                            {userRole !== "borrower" && (
                                <UpdateKeyStatusButton
                                    variant="contained"
                                    initialFloor={classroom.floor}
                                    initialClassroomCode={classroom.roomNumber}
                                    classroomId={classroom.id}
                                    keyStatus={classroom.keyStatus}
                                    borrower={classroom.borrower || ''}
                                    borrowerRole={classroom.borrowerRole || null}
                                    setReload={setReload}
                                />
                            )}
                        </Box>
                    </Box>
                ))
            )}
        </Paper>
    );
}
