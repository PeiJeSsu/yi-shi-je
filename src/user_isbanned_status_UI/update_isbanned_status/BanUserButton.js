import React, { useState } from 'react';
import Button from '@mui/material/Button';
import BanUser from "./BanUser";

const BanUserButton = ({user, setReload}) => {
    const [openWindow, setOpenWindow] = useState(false);

    const handleOpen = () => {
        setOpenWindow(true);
    };

    const handleClose = () => {
        setOpenWindow(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>禁用使用者</Button>
            <BanUser
                open={openWindow}
                onClose={handleClose}
                user={user}
                setReload={setReload}
            />
        </div>
    );
};

export default BanUserButton;
