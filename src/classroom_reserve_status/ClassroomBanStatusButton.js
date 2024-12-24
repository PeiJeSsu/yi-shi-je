import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ClassroomBanStatus from './ClassroomBanStatus';

const ClassroomBanStatusButton = ({initialFloor, initialClassroomCode, setReload}) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>禁用教室</Button>
            <ClassroomBanStatus open={open} onClose={handleClose} initialFloor={initialFloor} initialClassroomCode={initialClassroomCode} setReload={setReload}/>
        </div>
    );
};

export default ClassroomBanStatusButton;
