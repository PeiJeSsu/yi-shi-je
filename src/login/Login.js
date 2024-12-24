import React, { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Box, TextField, Button, Typography, Alert, Container, RadioGroup, FormControlLabel, Radio, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(null);
    const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
    const [selectedRole, setSelectedRole] = useState(""); // 用戶選擇的角色
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const handleLogin = async (e) => {
        e.preventDefault();
        setAlert(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setAlert({
                    type: "error",
                    message: "請檢查您的電子郵件並完成驗證。",
                });
                return;
            }

            try {
                const response = await axios.post("https://classroomreservationbackend.onrender.com/api/users/role", {email: user.email}, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const role = response.data; // Assuming the role is returned as plain text
                const name = email.split("@")[0];
                localStorage.setItem("userRole", role);
                localStorage.setItem("userName", name);
                localStorage.setItem("userEmail", email);

                setAlert({
                    type: "success",
                    message: "登入成功！",
                });
                navigate("/");
            } catch (error) {
                setAlert({
                    type: "error",
                    message: `取得角色失敗：${error.response?.data || error.message}`,
                });
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: `登入失敗：${error.message}`,
            });
        }
    }

    const handleGoogleLogin = async () => {
        setAlert(null);

        try {
            googleProvider.setCustomParameters({
                prompt: 'select_account',  // 強制顯示帳戶選擇框
            });

            // 進行 Google 登入
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            try {
                const response = await axios.get(`https://classroomreservationbackend.onrender.com/api/users/${user.email}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const userData = response.data;

                if (userData && userData.email) {
                    setAlert({
                        type: "success",
                        message: "Google 登入成功！",
                    });
                    navigate("/");
                } else {
                    setEmail(user.email); // 設定 email 為後續角色設定使用
                    setIsFirstTimeLogin(true); // 顯示第一次登入 UI
                }
            } catch (error) {
                setAlert({
                    type: "error",
                    message: `無法取得用戶資訊：${error.response?.data || error.message}`,
                });
            }
        } catch (error) {
            setAlert({
                type: "error",
                message: `Google 登入失敗：${error.message}`,
            });
        }
    };

    const handleRoleSubmit = async () => {
        if (selectedRole === "borrower" && !/^\d{8}@mail\.ntou\.edu\.tw$/.test(email) && !/^\d{8}@email\.ntou\.edu\.tw$/.test(email)) {
            setAlert({
                type: "error",
                message: "只有符合特定 email 格式的借用人可以註冊。",
            });
            setIsFirstTimeLogin(false);
            return; // 停止繼續執行
        }

        try {
            await axios.post("https://classroomreservationbackend.onrender.com/api/users/register", {
                email: email,
                role: selectedRole,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            setAlert({
                type: "success",
                message: "角色設定成功，註冊完成！",
            });
            navigate("/");
        } catch (error) {
            setAlert({
                type: "error",
                message: `註冊失敗：${error.response?.data || error.message}`,
            });
            setIsFirstTimeLogin(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mt: 4,
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    登入
                </Typography>
                {isFirstTimeLogin ? (
                    <>
                        <Typography variant="h5" component="h1" gutterBottom>
                            第一次登入，請選擇您的角色
                        </Typography>
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <FormControlLabel value="borrower" control={<Radio />} label="借用人" />
                                <FormControlLabel value="admin" control={<Radio />} label="管理員" />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRoleSubmit}
                            disabled={!selectedRole} // 沒選角色時禁用按鈕
                        >
                            確認角色
                        </Button>
                    </>
                ) : (
                    <>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="密碼"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            登入
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={handleGoogleLogin}
                        >
                            使用 Google 登入
                        </Button>
                        {alert && <Alert severity={alert.type}>{alert.message}</Alert>}
                        <Button
                            variant="text"
                            color="secondary"
                            fullWidth
                            onClick={() => navigate("/register")}
                        >
                            還沒有帳號？點此註冊
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
}

export default Login;
