import React from 'react'
import { IconButton, Typography, Grid2 } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import Box from "@mui/material/Box";

function DateSelector({ currentDate, setCurrentDate, setYear, setMonth, setDay }) {
    const handlePrev = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate)
            newDate.setDate(newDate.getDate() - 7)
            updateDateInputs(newDate)
            return newDate
        })
    }

    const handleNext = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate)
            newDate.setDate(newDate.getDate() + 7)
            updateDateInputs(newDate)
            return newDate
        })
    }

    const updateDateInputs = (date) => {
        setYear(date.getFullYear().toString())
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'))
        setDay(date.getDate().toString().padStart(2, '0'))
    }

    return (
        <Grid2 xs={12} md={4} sx={{ ml: 6 }}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
                <IconButton onClick={handlePrev} size="small">
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h6" sx={{ mx: 2 }}>
                    {`${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`}
                </Typography>
                <IconButton onClick={handleNext} size="small">
                    <ChevronRight />
                </IconButton>
            </Box>
        </Grid2>
    )
}

export default DateSelector
