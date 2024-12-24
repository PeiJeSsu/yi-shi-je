import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.setItem("isLoggedIn", "false");
            localStorage.setItem("userRole", "");
            navigate("/login");
        } catch (error) {
            console.error("登出失敗：", error.message);
        }
    };

    return (
        <Button
            onClick={handleLogout}
            variant="contained"
            color="primary"
            size="small"
        >
            登出
        </Button>
    );
}

export default Logout;
