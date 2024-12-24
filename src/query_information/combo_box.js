import React from 'react';
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from '@mui/material/Box';

export default function ComboBox({
                                     options = [],
                                     label = "選擇選項",
                                     multiple = false,
                                     value,
                                     onChange,
                                     sx = {},
                                 }) {
    return (
        <Box sx={sx}>
            <Autocomplete
                options={options}
                multiple={multiple}
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                        // 如果是自由輸入的文字
                        onChange(event, { label: newValue, value: newValue });
                    } else if (newValue && newValue.inputValue) {
                        // 如果是輸入的新選項
                        onChange(event, { label: newValue.inputValue, value: newValue.inputValue });
                    } else {
                        // 選擇既有選項
                        onChange(event, newValue);
                    }
                }}
                getOptionLabel={(option) => {
                    // 處理自由輸入的選項
                    if (typeof option === "string") {
                        return option;
                    }
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    return option.label || "";
                }}
                
                freeSolo
                renderInput={(params) => <TextField {...params} label={label} />}
                isOptionEqualToValue={(option, value) => option.value === value?.value}
            />
        </Box>
    );
}
