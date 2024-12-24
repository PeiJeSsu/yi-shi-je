import { Box } from '@mui/material';
import FloorSelector from './FloorSelector';
import ClassroomCodeSelector from './ClassroomCodeSelector';

export default function FloorAndClassroomCodeSelector({ floor, setFloor, classroomCode, setClassroomCode }) {

    return (
        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'row', width: '100%' }}>
            <FloorSelector floor={floor} setFloor={setFloor} setClassroomCode={setClassroomCode}/>
            <ClassroomCodeSelector floor={floor} classroomCode={classroomCode} setClassroomCode={setClassroomCode} />
        </Box>
    );
}
