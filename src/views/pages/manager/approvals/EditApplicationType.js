import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axiosExtended from 'utils/axios';

const EditApplicationType = ({ open, setOpen, item, updateItem, setError }) => {
    const [saving, setSaving] = useState(false);
    const [label, setLabel] = useState('');

    useEffect(() => {
        if (open && item) {
            setLabel(item.label || '');
        }
    }, [item, open]);

    const handleClose = () => {
        setOpen(false);
        setLabel('');
    };

    const handleSave = async () => {
        if (!label.trim() || !item) return;
        setSaving(true);
        setError(null);
        try {
            const { data } = await axiosExtended.put(`/ApplicationType/${item.id}`, { label: label.trim() });
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
                Edit Application Type
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

EditApplicationType.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    item: PropTypes.object,
    updateItem: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
};

export default EditApplicationType;
