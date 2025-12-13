import React, { useEffect, useState } from 'react';
import axiosExtended from 'utils/axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Box,
    useTheme,
    Button,
    IconButton
} from '@mui/material';
import { Add } from '@mui/icons-material';
import CreateOtherAttachment from './CreateOtherAttachment';
import EditIcon from '@mui/icons-material/Edit';
import EditOtherAttachment from './EditOtherAttachment';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useDialog } from 'utils/commons/dialog/useDialog';
import GenericDialog from 'utils/commons/dialog/GenericDialog';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';

const OtherAttachment = () => {
    const theme = useTheme();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // dialog state
    const [open, setOpen] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const [otherAttachmentToDeleteId, setOtherAttachmentToDeleteId] = useState(null);

    const { isOpen, openDialog, closeDialog, config } = useDialog({
        title: 'Delete Other Attachment',
        content: (
            <>
                <Typography variant="h5" sx={{ fontSize: '14px' }}>
                    You are about to delete an Other Attachment.
                </Typography>
                <Typography>This action cannot be undone.</Typography>
            </>
        ),
        actions: [
            {
                label: 'Cancel',
                color: 'secondary',
                variant: 'text',
                onClick: () => closeDialog()
            },
            {
                label: 'Delete',
                color: 'error',
                variant: 'contained',
                onClick: async () => {
                    try {
                        if (!otherAttachmentToDeleteId) return;

                        await axiosExtended.delete(`/OtherAttachment/${otherAttachmentToDeleteId}`);
                        setItems((prev) => prev.filter((item) => item.id !== otherAttachmentToDeleteId));
                        setOtherAttachmentToDeleteId(null);
                    } catch (err) {
                        showAxiosErrorEnquebar(err);
                    } finally {
                        closeDialog();
                    }
                }
            }
        ]
    });

    useEffect(() => {
        const fetchOtherAttachments = async () => {
            try {
                setLoading(true);
                const { data } = await axiosExtended.get('/OtherAttachment');
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err?.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };

        fetchOtherAttachments();
    }, []);

    const handleOpen = () => setOpen(true);

    const addItem = (item) => {
        setItems((prev) => [item, ...prev]);
    };

    const updateItem = (updated) => {
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    };

    const previewAttachment = async (id) => {
        try {
            const newTab = window.open('', '_blank');

            const response = await axiosExtended.get(`/OtherAttachment/${id}/preview`, {
                responseType: 'blob'
            });

            const blob = new Blob([response.data], {
                type: response.headers['content-type']
            });

            const blobUrl = URL.createObjectURL(blob);

            newTab.location.href = blobUrl;
        } catch (err) {
            setError(err?.message || 'Failed to preview attachment');
        }
    };

    return (
        <Box>
            <Button variant="contained" sx={{ mb: 1 }} startIcon={<Add />} onClick={handleOpen}>
                Add Other Attachment
            </Button>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow
                            sx={{
                                '& th': {
                                    backgroundColor:
                                        theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100]
                                }
                            }}
                        >
                            <TableCell>Label</TableCell>
                            <TableCell>Attachment</TableCell>
                            <TableCell>Created By</TableCell>
                            <TableCell>Approved By</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                        <CircularProgress size={20} />
                                        <Typography>Loading...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography color="error">Error: {error}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography>No records found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((it) => {
                                const createdBy = [it.createdByFirstName, it.createdByLastName].filter(Boolean).join(' ') || '-';
                                const approvedBy = [it.approvedByFirstName, it.approvedByLastName].filter(Boolean).join(' ') || '-';
                                return (
                                    <TableRow key={it.id || `${it.label}-${Math.random()}`}>
                                        <TableCell>{it.label || '-'}</TableCell>
                                        <TableCell>
                                            {it.attachmentPath && (
                                                <Button variant="outlined" size="small" onClick={() => previewAttachment(it.id)}>
                                                    Preview
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell>{createdBy}</TableCell>
                                        <TableCell>{approvedBy}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {!approvedBy && (
                                                    <Button variant="contained" color="success">
                                                        Approve
                                                    </Button>
                                                )}

                                                <IconButton
                                                    onClick={() => {
                                                        setEditingItem(it);
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    <EditIcon color="primary" />
                                                </IconButton>

                                                <IconButton
                                                    onClick={() => {
                                                        setOtherAttachmentToDeleteId(it.id);
                                                        openDialog();
                                                    }}
                                                >
                                                    <DeleteTwoToneIcon color="error" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <CreateOtherAttachment open={open} setOpen={setOpen} addItem={addItem} setError={setError} />
            <EditOtherAttachment open={editOpen} setOpen={setEditOpen} item={editingItem} updateItem={updateItem} setError={setError} />

            <GenericDialog isOpen={isOpen} onClose={closeDialog} title={config.title} actions={config.actions}>
                {config.content}
            </GenericDialog>
        </Box>
    );
};

export default OtherAttachment;
