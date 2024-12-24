import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Makechoice from './Makechoice';

const MakeChoiceButton = ({initialFloor, initialClassroomCode, isBanned, setDisplayReload}) => {
    const [isMakeChoiceOpen, setIsMakeChoiceOpen] = useState(false);

    const handleOpen = () => {
        setIsMakeChoiceOpen(true);
    };

    const handleClose = () => {
        setIsMakeChoiceOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen} disabled={isBanned}>申請</Button>
            <Makechoice open={isMakeChoiceOpen} onClose={handleClose} initialFloor={initialFloor} initialClassroomCode={initialClassroomCode} setDisplayReload={setDisplayReload}/>
        </div>
    );
};

export default MakeChoiceButton;
