import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Strip from "./information_strip";
import axios from 'axios';

export default function PersonalInformation() {
    const [personalInfo, setPersonalInfo] = useState([]);

    useEffect(() => {
        const userName = localStorage.getItem('userName');
        console.log("Logged in userName: ", userName);

        if (userName) {
            axios.get(`https://classroomreservationbackend.onrender.com/api/classroom_apply/borrower/${userName}`)
                .then((response) => {
                    if (response.status !== 200) {
                        throw new Error("Network response was not ok");
                    }
                    return response.data;
                })
                .then((data) => {
                    console.log("後端傳回的完整資料: ", data);
                    const transformedData = data.map((item) => {
                        return {
                            user: item.borrower,
                            classroom: item.classroom,
                            rentalDate: new Date(item.startTime).toLocaleString(),
                            endtime: new Date(item.endTime).toLocaleString(),
                            isRented: item.isApproved === null || item.isApproved === undefined
                                ? "尚未審核"
                                : item.isApproved ? "已出租" : "未出租",
                            floor: item.floor
                        };
                    });
                    setPersonalInfo(transformedData);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    alert("無法加載資料，請稍後再試。");
                });
        }
    }, []);


    return (
        <Box sx={{ width: '100%', height: '95vh' }}>
            <Card sx={{ width: '100%', height: '100%' }}>
                <Box sx={{
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    padding: '1%',
                }}>
                    {personalInfo.map((item, index) => (
                        <Strip
                            key={index}
                            user={item.user}
                            classroomId={item.classroom}
                            rentalDate={item.rentalDate}
                            isRented={item.isRented}
                            denyReason={item.denyReason}
                            floor={item.floor}
                            endTime={item.endtime}
                        />
                    ))}
                </Box>
            </Card>
        </Box>
    );
}
