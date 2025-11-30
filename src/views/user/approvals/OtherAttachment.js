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
    Button
} from '@mui/material';
import { Add } from '@mui/icons-material';
import CreateOtherAttachment from './CreateOtherAttachment';

const OtherAttachment = () => {
    const theme = useTheme();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // dialog state
    const [open, setOpen] = useState(false);

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
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => window.open(it.attachmentPath, '_blank')}
                                                >
                                                    Preview
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell>{createdBy}</TableCell>
                                        <TableCell>{approvedBy}</TableCell>
                                        <TableCell>
                                            {!approvedBy && (
                                                <Button variant="contained" color="success">
                                                    Approve
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <CreateOtherAttachment open={open} setOpen={setOpen} addItem={addItem} setError={setError} />
        </Box>
    );
};

export default OtherAttachment;
