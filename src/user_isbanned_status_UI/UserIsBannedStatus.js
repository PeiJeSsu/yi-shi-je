import React, {useState} from 'react';
import {Box} from '@mui/material';
import UserSelectionPanel from './UserSelectionPanel';
import UserList from "./UserList";

export default function UserIsBannedStatus() {
    const [user, setUser] = useState(null);
    const [reload, setReload] = useState(false);
    // console.log('UserIsBannedStatus', user);

    return (
        <Box>
            <UserSelectionPanel user={user} setUser={setUser}/>
            <UserList user={user} reload={reload} setReload={setReload}/>
        </Box>
    );
}

