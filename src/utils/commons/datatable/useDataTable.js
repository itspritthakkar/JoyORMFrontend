import { useState, useCallback, useEffect } from 'react';
import axiosExtended from 'utils/axios';

export function useDataTable({ url, defaultSortBy = 'createdAt', defaultSortOrder = 'Descending', pageSizeOptions = [5, 10, 25, 50] }) {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizeOptions[1]);
    const [sortBy, setSortBy] = useState(defaultSortBy);
    const [sortOrder, setSortOrder] = useState(defaultSortOrder);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const buildParams = useCallback(
        () => ({
            Page: page + 1,
            PageSize: pageSize,
            SortBy: sortBy,
            SortOrder: sortOrder,
            Search: search
        }),
        [page, pageSize, sortBy, sortOrder, search]
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const req = await axiosExtended.get(url, { params: buildParams() });
            setRows(req.data.data ?? []);
            setTotal(req.data.totalElements ?? 0);
        } finally {
            setLoading(false);
        }
    }, [buildParams, url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 500);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleRequestSort = (property) => {
        const isAsc = sortBy === property && sortOrder === 'Ascending';
        setSortOrder(isAsc ? 'Descending' : 'Ascending');
        setSortBy(property);
        setPage(0);
    };

    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setPageSize(parseInt(e.target.value, 10));
        setPage(0);
    };

    return {
        rows,
        total,
        page,
        pageSize,
        loading,
        pageSizeOptions,
        sortBy,
        sortOrder,
        searchInput,
        setSearchInput,
        handleRequestSort,
        handleChangePage,
        handleChangeRowsPerPage
    };
}
