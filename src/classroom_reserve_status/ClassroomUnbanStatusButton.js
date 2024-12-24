import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const UnbanClassroomButton = ({ initialClassroomCode, isBanned, setReload }) => {
    const handleUnban = async () => {
        try {
            const response = await axios.patch(`/classroom_build/${initialClassroomCode}/unban`);
            if (response.status === 200) {
                alert('教室解禁成功');
                setReload(true);
            } else if (response.status === 404) {
                console.error('未找到教室');
                alert('未找到教室');
            }
        } catch (error) {
            console.error('解禁失敗:', error);
            alert(`解禁失敗：${error.response?.data || error.message}`);
        }
    };

    return (
        <Button variant="contained" onClick={handleUnban} disabled={!isBanned}>
            解禁教室
        </Button>
    );
};

export default UnbanClassroomButton;
