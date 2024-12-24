import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const timeSlots = [
    '08:00 ~ 09:00', '09:00 ~ 10:00', '10:00 ~ 11:00', '11:00 ~ 12:00',
    '12:00 ~ 13:00', '13:00 ~ 14:00', '14:00 ~ 15:00', '15:00 ~ 16:00',
    '16:00 ~ 17:00', '17:00 ~ 18:00', '18:00 ~ 19:00', '19:00 ~ 20:00'
];

const TableBodyComponent = ({ weekDates, unavailableSlots }) => {
    const isSlotUnavailable = (date, slot) => {
        const startTime = new Date(`${date.toISOString().split('T')[0]}T${slot.split(' ~ ')[0]}:00+08:00`);
        const endTime = new Date(`${date.toISOString().split('T')[0]}T${slot.split(' ~ ')[1]}:00+08:00`);

        return unavailableSlots.some(unavailable => {
            const unavailableStart = new Date(unavailable.startTime);
            const unavailableEnd = new Date(unavailable.endTime);
            return (((startTime >= unavailableStart && startTime < unavailableEnd) ||
                    (endTime > unavailableStart && endTime <= unavailableEnd)) &&
                unavailable.isApproved === true);
        });
    };

    return (
        <>
            {timeSlots.map(slot => (
                <TableRow key={slot}>
                    <TableCell component="th" scope="row" sx={{ minHeight: '64px' }}>
                        {slot}
                    </TableCell>
                    {weekDates.map(date => (
                        <TableCell
                            key={`${slot}-${new Date(date.getTime() + (8 * 60 * 60 * 1000)).toISOString()}`}
                            align="center"
                            sx={{
                                position: 'relative',
                                padding: '4px',
                                minHeight: '64px',
                                verticalAlign: 'middle'
                            }}
                        >
                            {isSlotUnavailable(new Date(date.getTime() + (8 * 60 * 60 * 1000)), slot) ? (
                                <CloseIcon color="error" sx={{ fontSize: '1.5rem', verticalAlign: 'middle' }} />
                            ) : ''}
                        </TableCell>
                    ))}
                </TableRow>
            ))}

        </>
    );
};

export default TableBodyComponent;
