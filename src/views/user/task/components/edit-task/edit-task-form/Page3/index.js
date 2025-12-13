import React, { useState } from 'react';
import { Box, Grid, Typography, IconButton, TextField, Button, useTheme } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CreateClientDataDialog from './CreateClientDataDialog';
import { useClientDataContext } from 'views/user/task/contexts/ClientDataContext';
import { LoadingButton } from '@mui/lab';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import { showAxiosSuccessEnquebar } from 'utils/commons/functions';

const COLORS = {
    bluePill: '#d9f2fb',
    lightBlueField: '#dff6ff',
    green: '#c8f7c5',
    red: '#ffd6d6',
    yellowDraft: '#fff3cc'
};

const Page3 = () => {
    const theme = useTheme();

    const {
        clientDataFields,
        setClientDataFields,
        values,
        setValues,
        isMissing,
        setIsMissing,
        isAvailable,
        setIsAvailable,
        handleSave,
        isSaving,
        createSocialFollowupLog,
        isCreatingSocialLog
    } = useClientDataContext();

    const [openCreate, setOpenCreate] = useState(false);
    const [copied, setCopied] = useState({});

    const handleCopy = (id, text) => {
        navigator.clipboard?.writeText(text);
        setCopied((prev) => ({ ...prev, [id]: true }));
        showAxiosSuccessEnquebar('Copied to clipboard');
        setTimeout(() => setCopied((prev) => ({ ...prev, [id]: false })), 2000);
    };

    return (
        <Box>
            <Box sx={{ overflowY: 'auto', height: '30vh' }}>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography sx={{ fontWeight: 700 }}>Client Data</Typography>
                    </Grid>

                    <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <Box sx={{ display: 'flex', height: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                            {isCreatingSocialLog === 'SOCIAL_WHATSAPP' && (
                                <LoadingButton
                                    size="small"
                                    loading
                                    sx={{
                                        backgroundColor: '#f2f2f2',
                                        minHeight: 32,
                                        minWidth: 32,
                                        borderRadius: '8px',
                                        '& .MuiCircularProgress-root': {
                                            color: '#25D366'
                                        }
                                    }}
                                />
                            )}
                            {isCreatingSocialLog !== 'SOCIAL_WHATSAPP' && (
                                <IconButton
                                    size="small"
                                    sx={{ color: '#25D366' }}
                                    onClick={() => createSocialFollowupLog('SOCIAL_WHATSAPP')}
                                >
                                    <WhatsAppIcon />
                                </IconButton>
                            )}

                            {isCreatingSocialLog === 'SOCIAL_EMAIL' && (
                                <LoadingButton
                                    size="small"
                                    loading
                                    sx={{
                                        backgroundColor: '#f2f2f2',
                                        minHeight: 32,
                                        minWidth: 32,
                                        borderRadius: '8px',
                                        '& .MuiCircularProgress-root': {
                                            color: '#FFC107'
                                        }
                                    }}
                                />
                            )}
                            {isCreatingSocialLog !== 'SOCIAL_EMAIL' && (
                                <IconButton size="small" sx={{ color: '#FFC107' }} onClick={() => createSocialFollowupLog('SOCIAL_EMAIL')}>
                                    <EmailIcon />
                                </IconButton>
                            )}

                            {isCreatingSocialLog === 'SOCIAL_CALL' && (
                                <LoadingButton
                                    size="small"
                                    loading
                                    sx={{
                                        backgroundColor: '#f2f2f2',
                                        minHeight: 32,
                                        minWidth: 32,
                                        borderRadius: '8px',
                                        '& .MuiCircularProgress-root': {
                                            color: '#2196F3'
                                        }
                                    }}
                                />
                            )}
                            {isCreatingSocialLog !== 'SOCIAL_CALL' && (
                                <IconButton size="small" sx={{ color: '#2196F3' }} onClick={() => createSocialFollowupLog('SOCIAL_CALL')}>
                                    <CallIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={4}>
                        <Box sx={{ background: COLORS.yellowDraft, py: 2, borderRadius: 2, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: 12 }}>Automated followup message draft</Typography>
                        </Box>
                    </Grid>

                    {clientDataFields.map((f) => {
                        const id = f.id;
                        const missing = isMissing[id] === true;
                        const available = isAvailable[id] === true;

                        return (
                            <Grid item xs={12} key={id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {/* Left Label Pill */}
                                    <Box
                                        sx={{
                                            minWidth: 220,
                                            bgcolor: COLORS.bluePill,
                                            p: 1.2,
                                            borderRadius: '20px',
                                            pl: 2
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 600 }}>{f.label}</Typography>
                                    </Box>

                                    {/* Buttons */}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {/* Missing (NO) */}
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setIsMissing((p) => ({ ...p, [id]: true }));
                                                setIsAvailable((p) => ({ ...p, [id]: false }));
                                            }}
                                            sx={{
                                                bgcolor: missing ? theme.palette.error.light : undefined
                                            }}
                                        >
                                            <QuestionMarkRoundedIcon />
                                        </IconButton>

                                        {/* Available (YES) */}
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setIsMissing((p) => ({ ...p, [id]: false }));
                                                setIsAvailable((p) => ({ ...p, [id]: true }));
                                            }}
                                            sx={{
                                                bgcolor: available ? theme.palette.success.light : undefined
                                            }}
                                        >
                                            <CheckRoundedIcon />
                                        </IconButton>
                                    </Box>

                                    {/* Input */}
                                    <Box sx={{ flex: 1 }}>
                                        {(available || missing) && (
                                            <TextField
                                                size="small"
                                                fullWidth
                                                placeholder={missing ? `${f.label}:` : ''}
                                                value={values[id] || ''}
                                                onChange={(e) => setValues((p) => ({ ...p, [id]: e.target.value }))}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': missing ? { border: '1px solid #ff7b7b' } : {}
                                                }}
                                            />
                                        )}
                                    </Box>

                                    {/* ParaText when Missing */}
                                    <Box sx={{ minWidth: 280 }}>
                                        {missing && f.paraText && (
                                            <Box
                                                sx={{
                                                    bgcolor: COLORS.yellowDraft,
                                                    p: 1,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography sx={{ flex: 1, fontSize: 13 }}>{f.paraText}</Typography>
                                                <IconButton size="small" onClick={() => handleCopy(id, f.paraText)}>
                                                    {copied[id] ? <DoneRoundedIcon /> : <ContentCopyRoundedIcon />}
                                                </IconButton>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}

                    {/* Add New */}
                    <Grid item xs={12}>
                        <Button variant="outlined" size="small" onClick={() => setOpenCreate(true)}>
                            + Add new
                        </Button>
                    </Grid>

                    <CreateClientDataDialog
                        open={openCreate}
                        onClose={() => setOpenCreate(false)}
                        onCreated={(field) => setClientDataFields((prev) => [...prev, field])}
                    />
                </Grid>
            </Box>

            {/* Save Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <LoadingButton loading={isSaving} variant="contained" color="primary" onClick={handleSave}>
                    Save
                </LoadingButton>
            </Box>
        </Box>
    );
};

export default Page3;
