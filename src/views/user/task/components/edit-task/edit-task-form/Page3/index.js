import React, { useState } from 'react';
import { Box, Grid, Typography, IconButton, TextField, Button, useTheme } from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import QuestionMarkRoundedIcon from '@mui/icons-material/QuestionMarkRounded';
import CreateClientDataDialog from './CreateClientDataDialog';
import { useClientDataContext } from 'views/user/task/contexts/ClientDataContext';
import { LoadingButton } from '@mui/lab';

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
        isSaving
    } = useClientDataContext();

    const [openCreate, setOpenCreate] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard?.writeText(text);
    };

    return (
        <Box>
            <Box sx={{ overflowY: 'auto', height: '40vh' }}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Typography sx={{ fontWeight: 700 }}>Client Data</Typography>
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

                                        {!available && !missing && <Box sx={{ height: 40, bgcolor: COLORS.bluePill, borderRadius: 1 }} />}
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
                                                <IconButton size="small" onClick={() => copyToClipboard(f.paraText)}>
                                                    <ContentCopyRoundedIcon />
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
