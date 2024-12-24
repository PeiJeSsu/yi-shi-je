import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

export default function FloorSelector({ floor, setFloor, setClassroomCode }) {
    const [floors, setFloors] = useState([]);

    useEffect(() => {
        const fetchFloors = async () => {
            try {
                const response = await axios.get('https://classroomreservationbackend.onrender.com/classroom_build/floors');
                setFloors(['全部', ...response.data]);
            } catch (error) {
                console.error('Error fetching floors:', error);
            }
        };
        fetchFloors();
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        setFloor(value === '全部' ? null : value);
        setClassroomCode(null);
    };

    return (
        <FormControl fullWidth variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="floor-label">樓層</InputLabel>
            <Select
                labelId="floor-label"
                value={floor === null ? '全部' : floor}
                onChange={handleChange}
                label="樓層"
            >
                {floors.map((floorValue) => (
                    <MenuItem key={floorValue} value={floorValue}>
                        {floorValue}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
