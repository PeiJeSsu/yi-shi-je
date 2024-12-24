import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BanUserButton from "./update_isbanned_status/BanUserButton";
import UnBanUserButton from "./update_isbanned_status/UnBanUserButton";
import axios from 'axios';

export default function UserList({ user, reload, setReload }) {
    const [users, setUsers] = useState([]);
    // console.log('UserList', user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('api/users/allUsers');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUsers();

        if (reload) {
            setReload(false);
        }
    }, [reload, setReload]);

    const usersToDisplay = user ? users.filter(u => u.email.includes(user.email)) : users;

    return (
        <Paper elevation={3} sx={{ padding: '20px', marginTop: '20px' }}>
            {usersToDisplay.length === 0 ? (
                <Typography variant="body1">沒有找到相關的使用者。</Typography>
            ) : (
                usersToDisplay.map((user) => (
                    <Box
                        key={user.id}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '20px',
                        }}
                    >
                        <Box sx={{ display: 'flex' }}>
                            <Typography variant="body1" sx={{ minWidth: '150px' }}>
                                使用者: {user.email.split('@')[0]}
                            </Typography>
                            <Typography variant="body1" sx={{ minWidth: '120px' }}>
                                身分: {user.role === 'borrower' ? '借用人' : '管理者'}
                            </Typography>
                            <Typography variant="body1" sx={{ minWidth: '120px' }}>
                                狀態: {user.isBanned ? '禁用中' : '可用'}
                            </Typography>
                            {user.isBanned && user.unbanTime && (
                                <Typography variant="body1" sx={{ minWidth: '150px' }}>
                                    解禁時間: {new Date(user.unbanTime).toLocaleString('zh-TW', {
                                        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit',
                                        minute: '2-digit', second: '2-digit', hour12: false
                                    })}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <UnBanUserButton variant="contained" user={user} setReload={setReload}/>
                            <BanUserButton variant="contained" user={user} setReload={setReload}/>
                        </Box>
                    </Box>
                ))
            )}
        </Paper>
    );
}
