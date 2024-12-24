import React, { useState } from 'react'
import { Button } from '@mui/material'
import ClassroomStatus from "./ClassroomStatus";

export default function ClassroomStatusButton({initialFloor, initialClassroomCode}) {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div>
            <Button onClick={handleOpen} variant="contained">查看</Button>
            <ClassroomStatus open={open} onClose={handleClose} initialFloor={initialFloor} initialClassroomCode={initialClassroomCode} />
        </div>
    )
}
