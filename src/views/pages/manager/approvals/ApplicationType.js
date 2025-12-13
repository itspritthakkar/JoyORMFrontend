// ...existing code...
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
import CreateApplicationType from './CreateApplicationType';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditIcon from '@mui/icons-material/Edit';
import { useDialog } from 'utils/commons/dialog/useDialog';
import GenericDialog from 'utils/commons/dialog/GenericDialog';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import EditApplicationType from './EditApplicationType';

const ApplicationType = () => {
    const theme = useTheme();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [applicationTypeToDeleteId, setApplicationTypeToDeleteId] = useState(null);

    const [editingItem, setEditingItem] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const { isOpen, openDialog, closeDialog, config } = useDialog({
        title: 'Delete Application Type',
        content: (
            <>
                <Typography variant="h5" sx={{ fontSize: '14px' }}>
                    You are about to delete an Application Type.
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
                        if (!applicationTypeToDeleteId) return;

                        await axiosExtended.delete(`/ApplicationType/${applicationTypeToDeleteId}`);
                        setItems((prev) => prev.filter((item) => item.id !== applicationTypeToDeleteId));
                        setApplicationTypeToDeleteId(null);
                    } catch (err) {
                        showAxiosErrorEnquebar(err);
                    } finally {
                        closeDialog();
                    }
                }
            }
        ]
    });

    // dialog state
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchApplicationTypes = async () => {
            try {
                setLoading(true);
                const { data } = await axiosExtended.get('/ApplicationType');
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err?.message || 'Failed to load');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationTypes();
    }, []);

    const handleOpen = () => setOpen(true);

    const addItem = (item) => {
        setItems((prev) => [item, ...prev]);
    };

    const handleApprove = async (id) => {
        try {
            const { data } = await axiosExtended.post(`/ApplicationType/approve/${id}`);
            setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));
        } catch (err) {
            setError(err?.message || 'Failed to approve');
        }
    };

    return (
        <Box>
            <Button variant="contained" sx={{ mb: 1 }} startIcon={<Add />} onClick={handleOpen}>
                Add Application Type
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
                            <TableCell>Created By</TableCell>
                            <TableCell>Approved By</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                        <CircularProgress size={20} />
                                        <Typography>Loading...</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography color="error">Error: {error}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
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
                                        <TableCell>{createdBy}</TableCell>
                                        <TableCell>{approvedBy}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                {!it.approvedById && (
                                                    <Button variant="contained" color="success" onClick={() => handleApprove(it.id)}>
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
                                                        setApplicationTypeToDeleteId(it.id);
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

            <CreateApplicationType open={open} setOpen={setOpen} addItem={addItem} setError={setError} />

            <EditApplicationType
                open={editOpen}
                setOpen={setEditOpen}
                item={editingItem}
                updateItem={(updated) => setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))}
                setError={setError}
            />

            <GenericDialog isOpen={isOpen} onClose={closeDialog} title={config.title} actions={config.actions}>
                {config.content}
            </GenericDialog>
        </Box>
    );
};

export default ApplicationType;
// ...existing code...
