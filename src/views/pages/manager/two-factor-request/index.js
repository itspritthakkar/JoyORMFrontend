// ...existing code...
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Typography,
    TextField,
    CircularProgress,
    Box,
    useTheme,
    InputAdornment,
    Button
} from '@mui/material';
import axiosExtended from '../../../../utils/axios';
import MainCard from 'ui-component/cards/MainCard';
import SearchIcon from '@mui/icons-material/Search';
import { showAxiosErrorEnquebar, showAxiosInfoEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = 'CreatedAt';
const DEFAULT_SORT_ORDER = 'desc'; // 'asc' | 'desc'

// polling interval constant (10 seconds)
const POLL_INTERVAL_MS = 10000;

function mapSortOrderToApi(order) {
    // API expects 0 = ascending, 1 = descending
    return order === 'asc' ? 0 : 1;
}

export default function TwoFactorRequest() {
    const theme = useTheme();
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0); // MUI 0-based
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
    const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
    const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // track which requests are being processed (approve/reject)
    const [processingIds, setProcessingIds] = useState([]);
    // ref to track first fetch (show loader only on first fetch)
    const isFirstFetchRef = useRef(true);
    // ref to keep latest controller so we can abort on unmount
    const latestControllerRef = useRef(null);

    const buildParams = useCallback(() => {
        return {
            Status: '0',
            Page: String(page + 1), // server expects 1-based page
            PageSize: String(pageSize),
            SortBy: sortBy,
            SortOrder: String(mapSortOrderToApi(sortOrder)),
            Search: search || ''
        };
    }, [page, pageSize, sortBy, sortOrder, search]);

    useEffect(() => {
        let intervalId = null;

        async function fetchData() {
            // create a new controller per request and store it
            const controller = new AbortController();
            latestControllerRef.current = controller;

            // show loader only for the very first fetch
            if (isFirstFetchRef.current) setLoading(true);
            setError(null);

            try {
                const res = await axiosExtended.get('/TwoFactorRequest/Paged', {
                    params: buildParams(),
                    signal: controller.signal
                });
                const json = res.data;
                // Response shape:
                // { totalElements: 0, data: [] }
                const items = Array.isArray(json.data) ? json.data : [];
                const count = typeof json.totalElements === 'number' ? json.totalElements : items.length;
                setRows(items);
                setTotal(count);
            } catch (err) {
                // ignore cancel errors
                if (axiosExtended.isCancel?.(err)) {
                    // request was cancelled
                } else {
                    const msg = err?.response?.data?.message || err?.message || 'Failed to fetch';
                    setError(msg);
                    setRows([]);
                    setTotal(0);
                }
            } finally {
                // hide loader only after the first fetch; subsequent fetches won't toggle loader
                if (isFirstFetchRef.current) {
                    setLoading(false);
                    isFirstFetchRef.current = false;
                }
            }
        }

        // initial fetch + start polling every POLL_INTERVAL_MS
        fetchData();
        intervalId = setInterval(fetchData, POLL_INTERVAL_MS);

        return () => {
            // stop polling and abort any in-flight request
            if (intervalId) clearInterval(intervalId);
            if (latestControllerRef.current) latestControllerRef.current.abort();
        };
        // rebuild effect when params change so polling uses fresh params
    }, [buildParams]);

    // debounce search input -> update search param
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleRequestSort = (property) => {
        const isAsc = sortBy === property && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(property);
        setPage(0);
    };

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setPageSize(parseInt(e.target.value, 10));
        setPage(0);
    };

    const columns = [
        { id: 'id', label: 'User ID', sortable: false },
        { id: 'approvedByAdminId', label: 'Approved By', sortable: false }, // keep null for now
        { id: 'ipAddress', label: 'IP Address', sortable: false },
        { id: 'deviceName', label: 'Device Name', sortable: false },
        { id: 'operatingSystem', label: 'Operating System', sortable: false },
        { id: 'browser', label: 'Browser', sortable: false },
        { id: 'expiresAt', label: 'Expires At', sortable: true },
        { id: 'status', label: 'Status', sortable: false },
        { id: 'createdAt', label: 'Created At', sortable: true },
        { id: 'actions', label: 'Actions', sortable: false }
    ];

    // API calls to update status
    const handleAcceptRequest = async (id) => {
        setProcessingIds((p) => (p.includes(id) ? p : [...p, id]));
        try {
            // Adjust endpoint & body to match backend contract; this posts desired status
            await axiosExtended.put(`/TwoFactorRequest/${id}`, { status: 'Approved' });
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
            showAxiosSuccessEnquebar('Two-factor request approved successfully');
        } catch (err) {
            showAxiosErrorEnquebar(err);
        } finally {
            setProcessingIds((p) => p.filter((x) => x !== id));
        }
    };

    const handleRejectRequest = async (id) => {
        setProcessingIds((p) => (p.includes(id) ? p : [...p, id]));
        try {
            await axiosExtended.put(`/TwoFactorRequest/${id}`, { status: 'Declined' });
            setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
            showAxiosInfoEnquebar('Two-factor request rejected');
        } catch (err) {
            showAxiosErrorEnquebar(err);
        } finally {
            setProcessingIds((p) => p.filter((x) => x !== id));
        }
    };

    const formatValue = (row, colId) => {
        // model uses PascalCase on server but client may receive camelCase
        // try both forms
        const val = row[colId] ?? row[colId.charAt(0).toLowerCase() + colId.slice(1)] ?? (colId === 'approvedByAdminId' ? null : '');
        if (val === null || val === undefined) return '';
        if (
            colId.toLowerCase().includes('date') ||
            colId.toLowerCase().includes('createdAt') ||
            colId.toLowerCase().includes('updatedAt')
        ) {
            const d = new Date(val);
            if (isNaN(d)) return String(val);
            return d.toLocaleString();
        }
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
    };

    return (
        <MainCard>
            <Paper sx={{ width: '100%', mb: 2, p: 1 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h3">Two Factor Requests</Typography>
                    <TextField
                        size="small"
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </Toolbar>

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
                                {columns.map((col) => (
                                    <TableCell key={col.id}>
                                        {col.sortable ? (
                                            <TableSortLabel
                                                active={sortBy.toLowerCase() === col.id.toLowerCase()}
                                                direction={sortOrder}
                                                onClick={() => handleRequestSort(col.id)}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        ) : (
                                            col.label
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <Typography color="error">Error: {String(error)}</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <Typography>No records</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row, idx) => (
                                    <TableRow key={row.id ?? idx} hover>
                                        {columns.map((col) => {
                                            if (col.id === 'actions') {
                                                const processing = processingIds.includes(row.id);
                                                if (row.status?.toLowerCase() !== 'pending') return <TableCell key={col.id}></TableCell>;

                                                return (
                                                    <TableCell key={col.id}>
                                                        {processing ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={() => handleAcceptRequest(row.id)}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="error"
                                                                    onClick={() => handleRejectRequest(row.id)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                );
                                            }
                                            return <TableCell key={col.id}>{formatValue(row, col.id)}</TableCell>;
                                        })}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={pageSize}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </Paper>
        </MainCard>
    );
}
// ...existing code...
