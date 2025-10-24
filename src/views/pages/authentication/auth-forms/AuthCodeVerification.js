import { useCallback, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// third-party
import OtpInput from 'react18-input-otp';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import useAuth from 'hooks/useAuth';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const RESEND_DELAY = 30; // seconds

const AuthCodeVerification = () => {
    const theme = useTheme();
    const { mobileVerified } = useAuth();
    const [otp, setOtp] = useState();
    const [isSubmit, setIsSubmit] = useState(false);
    const [otpError, setOtpError] = useState(false);

    const [resendTimeLeft, setResendTimeLeft] = useState(30); // initial 30 seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];

    const startOtpCountdown = () => {
        const expiryTimestamp = Date.now() + RESEND_DELAY * 1000;
        localStorage.setItem('otpResendExpiry', expiryTimestamp.toString());
        setResendTimeLeft(RESEND_DELAY);
        setIsResendDisabled(true);
    };

    useEffect(() => {
        // On mount, check if there's an existing expiry time
        const storedExpiry = localStorage.getItem('otpResendExpiry');
        if (storedExpiry) {
            const expiry = parseInt(storedExpiry, 10);
            const now = Date.now();
            const diff = Math.max(Math.ceil((expiry - now) / 1000), 0);

            if (diff > 0) {
                setResendTimeLeft(diff);
                setIsResendDisabled(true);
            } else {
                setResendTimeLeft(0);
                setIsResendDisabled(false);
            }
        }
    }, []);

    useEffect(() => {
        if (resendTimeLeft <= 0) {
            setIsResendDisabled(false);
            return;
        }

        const timerId = setInterval(() => {
            setResendTimeLeft((prev) => {
                const newVal = prev - 1;
                if (newVal <= 0) {
                    localStorage.removeItem('otpResendExpiry');
                }
                return newVal;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [resendTimeLeft]);

    useEffect(() => {
        const sendOtpMessage = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/Otp/send`;

                await axiosExtended.request({
                    url,
                    method: 'POST',
                    data: {
                        purpose: 'Signup'
                    }
                });
                startOtpCountdown();
            } catch (error) {
                if (error.response?.status == 409) {
                    return;
                }
                showAxiosErrorEnquebar(error);
            }
        };
        sendOtpMessage();
    }, []);

    const validateOtp = useCallback(() => {
        if (!otp || otp.length < 4) {
            setOtpError(true);
            return false;
        }
        setOtpError(false);
        return true;
    }, [otp]);

    useEffect(() => {
        validateOtp();
    }, [validateOtp]);

    const handleOtpSubmit = async () => {
        setIsSubmit(true);
        if (!validateOtp()) {
            return;
        }

        try {
            const url = `${process.env.REACT_APP_API_URL}/Otp/verify`;
            await axiosExtended.request({
                url,
                method: 'POST',
                data: {
                    otpCode: otp,
                    purpose: 'Signup'
                }
            });

            await mobileVerified();
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    };

    const handleResend = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/Otp/resend`;

            await axiosExtended.request({
                url,
                method: 'POST',
                data: {
                    purpose: 'Signup'
                }
            });
            startOtpCountdown();

            showAxiosSuccessEnquebar('OTP code resent successfully.');
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <OtpInput
                    shouldAutoFocus
                    value={otp}
                    onChange={(otpNumber) => {
                        const numericValue = otpNumber.replace(/\D/g, '').slice(0, 4); // max 6 digits
                        setOtp(numericValue);
                    }}
                    numInputs={4}
                    containerStyle={{ justifyContent: 'space-between' }}
                    inputStyle={{
                        width: '100%',
                        margin: '8px',
                        padding: '10px',
                        border: isSubmit && otpError ? `2px solid ${theme.palette.error.main}` : `1px solid ${borderColor}`,
                        borderRadius: 10,
                        background: theme.palette.grey[200],
                        ':hover': {
                            borderColor: theme.palette.primary.main
                        }
                    }}
                    focusStyle={{
                        outline: 'none',
                        border: `2px solid ${theme.palette.primary.main}`
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Button disableElevation fullWidth size="large" type="submit" variant="contained" onClick={handleOtpSubmit}>
                    Continue
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                    <Box>
                        <Typography variant="h6" fontSize={16}>
                            Did not receive the code?
                        </Typography>
                        {isResendDisabled && <Typography>Retry after: {resendTimeLeft}s</Typography>}
                    </Box>
                    <Button variant="text" color="primary" onClick={handleResend} disabled={isResendDisabled}>
                        Resend code
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    );
};
export default AuthCodeVerification;
