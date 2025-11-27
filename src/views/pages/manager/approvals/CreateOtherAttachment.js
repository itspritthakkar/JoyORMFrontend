import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axiosExtended from 'utils/axios';
import { useOtherAttachmentsContext } from '../task/contexts/OtherAttachmentsContext';

const CreateOtherAttachment = ({ open, setOpen, setError }) => {
    const { setItems } = useOtherAttachmentsContext();
    const [saving, setSaving] = useState(false);
    const [label, setLabel] = useState('');
    const [file, setFile] = useState(null);

    const addItem = (item) => {
        setItems((prev) => [item, ...prev]);
    };

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
        if (!label.trim() || !file) return;
        setSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('label', label.trim());
            formData.append('file', file);

            const { data } = await axiosExtended.post('/OtherAttachment', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // if API returns created object, prepend it; otherwise fallback to local item
            const created = data && typeof data === 'object' ? data : { id: Date.now().toString(), label: label.trim() };
            addItem(created);
            handleClose();
        } catch (err) {
            setError(err?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Add Other Attachment
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
                    helperText="Allowed: PDF, DOCX (Max 5MB)"
                />
                {file && (
                    <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        Selected: {file.name}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ pr: 3, pb: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} variant="contained" disabled={saving || !label.trim() || !file}>
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateOtherAttachment.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
};

export default CreateOtherAttachment;
