import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Grid2} from '@mui/material';
import axios from 'axios';

function FloorRoomSelector({ floor, setFloor, room, setRoom }) {
    const [classrooms, setClassrooms] = useState([]);
    const [floors, setFloors] = useState([]);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios.get('/classroom_build/all')
            .then((response) => {
                setClassrooms(response.data);
                const uniqueFloors = [...new Set(response.data.map(classroom => classroom.floor))];
                setFloors(uniqueFloors);
            })
            .catch((error) => {
                console.error("Error fetching classrooms:", error);
            });
    }, []);

    useEffect(() => {
        const filteredRooms = classrooms
            .filter(classroom => classroom.floor === floor)
            .map(classroom => classroom.roomNumber);
        setRooms(filteredRooms);

    }, [floor, classrooms, room, setRoom]);

    const handleFloorChange = (event) => {
        setFloor(event.target.value);
        setRoom('');
    };

    return (
        <>
            <Grid2 xs={12} md={3.5} sx={{ ml: 2 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>樓層</InputLabel>
                    <Select value={floor} onChange={handleFloorChange} label="樓層" variant={}>
                        {floors.map((floorNumber) => (
                            <MenuItem key={floorNumber} value={floorNumber}>
                                {floorNumber}樓
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>
            <Grid2 xs={12} md={3.5} sx={{ ml: 2 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>教室編號</InputLabel>
                    <Select value={rooms.includes(room) ? room : ''} onChange={(event) => setRoom(event.target.value)} label="教室編號" disabled={!floor} variant={}>
                        {rooms.map((roomNumber) => (
                            <MenuItem key={roomNumber} value={roomNumber}>
                                {roomNumber}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid2>
        </>
    );
}

export default FloorRoomSelector;