import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axiosExtended from 'utils/axios';

const CreateApplicationType = ({ open, setOpen, addItem, setError }) => {
    const [saving, setSaving] = useState(false);
    const [label, setLabel] = useState('');

    const handleClose = () => {
        setOpen(false);
        setLabel('');
    };

    const handleSave = async () => {
        if (!label.trim()) return;
        setSaving(true);
        setError(null);
        try {
            const { data } = await axiosExtended.post('/ApplicationType', { label: label.trim() });
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
                Add Application Type
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

            <DialogContent dividers>
                <TextField
                    fullWidth
                    label="Application Type Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    variant="outlined"
                />
            </DialogContent>

            <DialogActions sx={{ pr: 3, pb: 2, justifyContent: 'flex-end' }}>
                <Button onClick={handleSave} variant="contained" disabled={saving || !label.trim()}>
                    {saving ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateApplicationType.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
};

export default CreateApplicationType;
