import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    CircularProgress,
    Box,
    Typography,
    useTheme,
    Toolbar,
    TextField,
    InputAdornment
} from '@mui/material';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';

const DataTable = ({
    columns,
    rows,
    total,
    page,
    pageSize,
    sortBy,
    sortOrder,
    loading,
    pageSizeOptions,
    onSort,
    onPageChange,
    onRowsChange,
    searchInput,
    setSearchInput,
    searchPlaceholder,
    showSearch,
    rowSx = {}
}) => {
    const theme = useTheme();

    return (
        <>
            {/* 🔍 Search Toolbar - shown only if enabled */}
            {showSearch && (
                <Toolbar sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <TextField
                        size="small"
                        placeholder={searchPlaceholder}
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
            )}

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
                                        <TableSortLabel active={sortBy === col.id} direction={sortOrder} onClick={() => onSort(col.id)}>
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
                                    <Box textAlign="center" p={2}>
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <Typography>No records found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, i) => (
                                <TableRow key={row.id ?? i} sx={{ ...rowSx }}>
                                    {columns.map((col) => (
                                        <TableCell key={col.id} sx={{ ...(col.cellSx ?? {}) }}>
                                            {col.render ? col.render(row) : row[col.id]}
                                        </TableCell>
                                    ))}
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
                rowsPerPage={pageSize}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsChange}
                rowsPerPageOptions={pageSizeOptions}
            />
        </>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            sortable: PropTypes.bool,
            render: PropTypes.func // custom rendering of a cell
        })
    ).isRequired,

    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
    total: PropTypes.number.isRequired,

    // Pagination
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number),

    // Sorting
    sortBy: PropTypes.string.isRequired,
    sortOrder: PropTypes.oneOf(['asc', 'desc']).isRequired,

    // Loading state
    loading: PropTypes.bool,

    // Handlers
    onSort: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsChange: PropTypes.func.isRequired,

    // Search
    searchInput: PropTypes.string,
    setSearchInput: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    showSearch: PropTypes.bool,

    // Row styles
    rowSx: PropTypes.object
};

DataTable.defaultProps = {
    loading: false,
    pageSizeOptions: [5, 10, 25, 50]
};

export default DataTable;
