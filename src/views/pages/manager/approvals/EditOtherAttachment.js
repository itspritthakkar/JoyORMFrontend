import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axiosExtended from 'utils/axios';

const EditOtherAttachment = ({ open, setOpen, item, updateItem, setError }) => {
    const [saving, setSaving] = useState(false);
    const [label, setLabel] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (open && item) {
            setLabel(item.label || '');
            setFile(null);
        }
    }, [item, open]);

    const handleClose = () => {
        setOpen(false);
        setLabel('');
        setFile(null);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Only PDF and DOCX files are allowed');
                return;
            }

            if (selectedFile.size > maxSize) {
                setError('File size must not exceed 5MB');
                return;
            }

            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSave = async () => {
        if (!label.trim() || !item) return;
        setSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('label', label.trim());
            if (file) {
                formData.append('file', file);
            }

            const { data } = await axiosExtended.put(`/OtherAttachment/${item.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updated = data && typeof data === 'object' ? data : { ...item, label: label.trim() };
            updateItem(updated);
            handleClose();
        } catch (err) {
            setError(err?.message || 'Failed to update');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Edit Other Attachment
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                    size="large"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    fullWidth
                    label="Other Attachment Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    type="file"
                    inputProps={{ accept: '.pdf,.docx' }}
                    onChange={handleFileChange}
                    variant="outlined"
                    helperText="Optional: Upload new file (PDF, DOCX, Max 5MB)"
                />
                {file && (
                    <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        New file selected: {file.name}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ pr: 3, pb: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} variant="contained" disabled={saving || !label.trim()}>
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditOtherAttachment.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    item: PropTypes.object,
    updateItem: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
};

export default EditOtherAttachment;
