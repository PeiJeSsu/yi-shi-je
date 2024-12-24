import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export  default function HistoryDialog({ open, onClose, title, children }){
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md" // 設定寬度比例
            fullWidth // 讓 maxWidth 有效
        >
            {/* 視窗標題 */}
            <DialogTitle>
                {title || "標題"}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* 視窗內容 */}
            <DialogContent dividers>
                <Box>{children}</Box>
            </DialogContent>
        </Dialog>
    );
}