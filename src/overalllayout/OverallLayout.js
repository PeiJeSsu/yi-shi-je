import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from './CustomTabPanel';
import ClassroomQuery from "../classroom_query_UI/ClassroomQuery";
import ApplyList from "../design_apply_list_UI/ApplyList";
import ClassroomMap from "../classroom_map_UI/Classroom_map";
import Logout from "../login/Logout";
import Information from "../query_information/query_information_interface";
import UserIsBannedStatus from "../user_isbanned_status_UI/UserIsBannedStatus";
import PersonalInformation from "../query_information/personal_informaion";
export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const userRole = localStorage.getItem("userRole");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const a11yProps = (index) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="查詢教室" {...a11yProps(0)} />
                    {userRole !== "borrower" && <Tab label="申請管理" {...a11yProps(1)} />}
                    {userRole !== "borrower" && <Tab label="使用者狀態管理" {...a11yProps(2)} />}
                    <Tab label="教室地圖" {...a11yProps(userRole !== "borrower" ? 3 : 1)} />
                    <Tab label="資訊查詢" {...a11yProps(userRole !== "borrower" ? 4 : 2)} />
                </Tabs>
                <Box sx={{ paddingRight: 2 }}>
                    <Logout />
                </Box>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <ClassroomQuery />
            </CustomTabPanel>

            {userRole !== "borrower" && (
                <CustomTabPanel value={value} index={1}>
                    <ApplyList />
                </CustomTabPanel>
            )}

            {userRole !== "borrower" && (
                <CustomTabPanel value={value} index={2}>
                    <UserIsBannedStatus />
                </CustomTabPanel>
            )}

            <CustomTabPanel
                value={value}
                index={userRole !== "borrower" ? 3 : 1} // Adjust index dynamically
            >
                <ClassroomMap />
            </CustomTabPanel>

            <CustomTabPanel
                value={value}
                index={userRole !== "borrower" ? 4 : 2} //
            >
                {userRole === "borrower" ? <PersonalInformation /> : <Information />}
            </CustomTabPanel>
        </Box>
    );
}
