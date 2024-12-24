import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

export default function ClassroomCodeSelector({ floor, classroomCode, setClassroomCode }) {
    const [classroomCodes, setClassroomCodes] = useState([]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            if (floor) {
                try {
                    const response = await axios.get(`/classroom_build/floor/${floor}`);
                    const codes = response.data.map((classroom) => classroom.roomNumber);
                    setClassroomCodes(['全部', ...codes]);
                } catch (error) {
                    console.error('Error fetching classrooms:', error);
                }
            } else {
                setClassroomCodes(['全部']);
            }
        };

        fetchClassrooms();
    }, [floor]);

    const handleChange = (event) => {
        const value = event.target.value;
        setClassroomCode(value === '全部' ? null : value);
    };

    return (
        <FormControl fullWidth variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="classroom-code-label">教室代號</InputLabel>
            <Select
                labelId="classroom-code-label"
                value={classroomCode === null ? '全部' : classroomCode}
                onChange={handleChange}
                label="教室代號"
            >
                {classroomCodes.map((code) => (
                    <MenuItem key={code} value={code}>
                        {code}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
