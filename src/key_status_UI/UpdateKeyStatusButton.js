import React, { useState } from 'react';
import Button from '@mui/material/Button';
import UpdateKeyStatus from "./UpdateKeyStatus";

const UpdateKeyStatusButton = ({initialFloor, initialClassroomCode, classroomId, keyStatus, borrower, borrowerRole, setReload}) => {
    const [openKeyStatus, setOpenKeyStatus] = useState(false);
    const [initialBorrower, setInitialBorrower] = useState({email: '', role: null})

    const handleOpen = () => {
        setInitialBorrower({email: borrower, role: borrowerRole});
        setOpenKeyStatus(true);
    };

    const handleClose = () => {
        setOpenKeyStatus(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>更改鑰匙狀態</Button>
            <UpdateKeyStatus
                open={openKeyStatus}
                onClose={handleClose}
                classroomId={classroomId}
                initialFloor={initialFloor}
                initialClassroomCode={initialClassroomCode}
                initialKeyStatus={keyStatus}
                initialBorrower={initialBorrower}
                setReload={setReload}
            />
        </div>
    );
};

export default UpdateKeyStatusButton;
