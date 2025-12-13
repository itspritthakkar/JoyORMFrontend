import React, { useState } from 'react';
import { Box, useTheme, Button, Checkbox, IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import CreateOtherAttachment from 'views/user/approvals/CreateOtherAttachment';
import { useOtherAttachmentValuesContext } from 'views/user/task/contexts/OtherAttachmentValuesContext';
import { useOtherAttachmentsContext } from 'contexts/OtherAttachmentsContext';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import axiosExtended from 'utils/axios';
import { downloadBlob } from 'utils/commons/functions';

const Page2 = ({ handleNext }) => {
    const theme = useTheme();

    const { loadingItems, items } = useOtherAttachmentsContext();
    const { loadingValues, selectedItemsLocal, setSelectedItemsLocal, handleSave, isSaving } = useOtherAttachmentValuesContext();

    // dialog
    const [open, setOpen] = useState(false);

    const handleCheckboxChange = (id) => {
        setSelectedItemsLocal((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleOpen = () => setOpen(true);

    const downloadAttachment = async (id) => {
        try {
            const response = await axiosExtended.get(`/OtherAttachment/${id}/file`, {
                responseType: 'blob'
            });

            downloadBlob(response);
        } catch (err) {
            console.error('Failed to download attachment', err);
        }
    };

    if (loadingItems || loadingValues) return <>Loading...</>;

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    height: '30vh',
                    maxWidth: { xs: '100%', md: 350 }
                }}
            >
                <Button variant="contained" sx={{ mb: 1 }} startIcon={<Add />} onClick={handleOpen}>
                    Add Other Attachment
                </Button>

                {items.map((item) => (
                    <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {/* Checkbox */}
                        <Checkbox
                            checked={selectedItemsLocal.has(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            sx={{
                                width: 50,
                                height: 40,
                                backgroundColor: `${theme.palette.primary.main}4D`,
                                borderRadius: 2,
                                padding: 0.5,
                                '&.Mui-checked': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText
                                }
                            }}
                        />

                        {/* Label */}
                        <Button
                            sx={{
                                backgroundColor: `${theme.palette.primary.main}4D`,
                                color: theme.palette.primary.dark,
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: `${theme.palette.primary.main}4D`, boxShadow: 'none' }
                            }}
                            size="small"
                            fullWidth
                        >
                            {item.label}
                        </Button>

                        {/* Download Button */}
                        <Box sx={{ backgroundColor: `${theme.palette.primary.main}4D`, borderRadius: 2 }}>
                            <IconButton onClick={() => downloadAttachment(item.id)} sx={{ color: theme.palette.primary.main }}>
                                <DownloadRoundedIcon color="inherit" />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </Box>

            <CreateOtherAttachment open={open} setOpen={setOpen} />

            {/* Footer Save Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                <LoadingButton loading={isSaving} variant="contained" color="primary" onClick={async () => await handleSave()}>
                    Save
                </LoadingButton>

                <LoadingButton
                    loading={isSaving}
                    variant="contained"
                    color="primary"
                    onClick={async () => {
                        await handleSave();
                        handleNext();
                    }}
                >
                    Save & Continue
                </LoadingButton>
            </Box>
        </Box>
    );
};

Page2.propTypes = {
    handleNext: PropTypes.func.isRequired
};
export default Page2;
