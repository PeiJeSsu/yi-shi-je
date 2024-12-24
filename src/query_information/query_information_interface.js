import React, {useState, useEffect} from "react";
import {Box, Typography} from "@mui/material";
import ComboBox from "./combo_box";
import Strip from "./information_strip";
import {Paper} from '@mui/material';
import axios from 'axios';

export default function Query_information_interface() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [Info, setInfo] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        axios.get("https://classroomreservationbackend.onrender.com/api/classroom_apply")
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error("Network response was not ok");
                }
                return response.data;
            })
            .then((data) => {
                const uniqueBorrowers = Array.from(
                    new Set(
                        data
                            .map((application) => application.borrower)
                            .filter((borrower) => borrower !== null && borrower !== undefined)
                    )
                ).map((borrower) => ({
                    label: borrower,
                    value: borrower,
                }));
                setOptions(uniqueBorrowers);

                const transformedData = data.map((application) => ({
                    user: application.borrower || "未知借用者",
                    classroomId: application.classroom || "未知教室",
                    rentalDate: application.startTime
                        ? new Date(application.startTime).toLocaleString()
                        : "未知日期",
                    isRented:
                        application.isApproved === null || application.isApproved === undefined
                            ? "尚未審核"
                            : application.isApproved
                                ? "已出租"
                                : "未出租",

                    floor: application.floor,
                    endTime: application.endTime
                        ? new Date(application.endTime).toLocaleString()
                        : "未知結束時間",
                }));

                setInfo(transformedData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleChange = (event, value) => {
        setSelectedOption(value);
    };

    const filteredRentalInfo = Info.filter((item) => {
        if (selectedOption) {
            const inputValue = selectedOption.value || selectedOption.label || selectedOption;
            return item.user.toLowerCase().includes(inputValue.toLowerCase());
        }
        return true;
    });

    return (
        <Box
            sx={{
                width: "100%",
                height: "95vh",
                marginTop: "20px",
                backgroundColor: "transparent",
            }}
        >
            <Paper elevation={3}>
                <Box
                    sx={{
                        marginBottom: "20px",
                        padding: "20px",

                    }}
                >
                    <ComboBox
                        sx={{width: "20%"}}
                        options={options}
                        label="請選擇想調閱的使用者"
                        value={selectedOption}
                        onChange={handleChange}
                    />
                </Box>
            </Paper>

            <Paper elevation={3}><Box sx={{padding: "20px"}}>
                <Box
                    sx={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                    }}
                >
                    {filteredRentalInfo.length > 0 ? (
                        filteredRentalInfo.map((item, index) => (
                            <Strip
                                key={index}
                                user={item.user}
                                classroomId={item.classroomId}
                                rentalDate={item.rentalDate}
                                isRented={item.isRented}
                                denyReason={item.denyReason}
                                floor={item.floor}
                                endTime={item.endTime}
                            />
                        ))
                    ) : (
                        <Typography sx={{textAlign: "center", marginTop: "20px"}}>
                            沒有符合的使用者
                        </Typography>
                    )}
                </Box>
            </Box></Paper>

        </Box>
    );
}
