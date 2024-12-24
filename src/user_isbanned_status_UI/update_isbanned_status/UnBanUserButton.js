import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const UnBanUserButton = ({ user, setReload }) => {

    const handleUnban = async () => {
        try {
            const response = await axios.patch(`https://classroomreservationbackend.onrender.com/api/users/${user.email}/unban`);
            if (response.status === 200) {
                alert('使用者解禁成功');
                setReload(true);
            } else if (response.status === 404) {
                console.error('未找到使用者');
                alert('未找到使用者');
            }
        } catch (error) {
            console.error('解禁失敗:', error);
            alert(`解禁失敗：${error.response?.data || error.message}`);
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleUnban} disabled={!user.isBanned}>
            解禁
        </Button>
    );
};

export default UnBanUserButton;
