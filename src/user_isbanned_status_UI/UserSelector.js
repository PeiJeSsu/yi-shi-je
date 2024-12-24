import React, { useState, useEffect } from 'react';
import {Autocomplete, TextField, Typography} from '@mui/material';
import axios from 'axios';

const UserSelector = ({ user, setUser, disabled }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('https://classroomreservationbackend.onrender.com/api/users/allUsers')
            .then(response => {
                const sortedUsers = response.data.sort((a, b) => {
                    if (a.role !== b.role)
                        return a.role > b.role ? 1 : -1;
                    return a.email.localeCompare(b.email);
                });
                setUsers(sortedUsers);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleValueUpdate = (value) => {
        if (typeof value === 'object' && value !== null) {
            setUser(value);
        } else if (typeof value === 'string') {
            const matchedUser = users.find(user => user.email.split('@')[0] === value);
            if (matchedUser) {
                setUser(matchedUser);
            } else {
                setUser({
                    email: value,
                    role: 'unknown',
                    isBanned: false,
                    unbanTime: null,
                });
            }
        }
    };

    const handleUserChange = (event, value) => {
        // console.log('UserSelector', value);
        handleValueUpdate(value);
    };

    const handleInputBlur = (event) => {
        handleValueUpdate(event.target.value);
    };

    return (
        <Autocomplete
            options={users}
            getOptionLabel={(option) => {
                if (typeof option === 'string') 
                    return option;
                return option.email.split('@')[0];
            }}
            groupBy={(option) => option.role}
            freeSolo
            value={user || null}
            onChange={handleUserChange}
            renderOption={(props, option) => (
                <li {...props}>
                    <Typography sx={{ display: 'inline-block', width: '10ch' }}>
                        {option.email.split('@')[0]}
                    </Typography>
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="請選擇使用者（輸入關鍵字查詢）"
                    variant="outlined"
                    onBlur={handleInputBlur}
                />
            )}
            sx={{ minWidth: 300 }}
            disabled={disabled}
        />
    );
};

export default UserSelector;
