// CreateClientDataDialog.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import PropTypes from 'prop-types';

export default function CreateClientDataDialog({ open, onClose, onCreated }) {
    const [label, setLabel] = useState('');
    const [paraText, setParaText] = useState('');

    const handleSave = async () => {
        try {
            const payload = { label, paraText }; // correct DTO (paraText + isDeletable not included)
            const { data } = await axiosExtended.post('/ClientData', payload);

            showAxiosSuccessEnquebar('Client data field added');
            onCreated(data); // return new record to parent
            onClose();
            setLabel('');
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Client Data Field</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Field Label"
                    fullWidth
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <TextField margin="dense" label="Para Text" fullWidth value={paraText} onChange={(e) => setParaText(e.target.value)} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

CreateClientDataDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreated: PropTypes.func.isRequired
};
