import React from 'react';
import Button from '@mui/material/Button';

export default function ClassroomMapButton({text,onClick}){
    return(
        <Button variant="contained" color="primary" sx={{width:'15%',marginLeft:'2.5%',marginRight:'2.5%',marginTop:'1%',height:'7.5vh'}} onClick={() => onClick(text.trim())}>
            <h2>{text}</h2>
        </Button>
    );
}