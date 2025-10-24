// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { appendSearchParams, checkIfPageInvalid, showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import {
    AppBar,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Slide,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import { propertySituations, statusColors } from 'utils/commons/values';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetUserSurveyFilter,
    setUserMarkedForResurveyOnly,
    setUserSurveySearchFilter,
    setUserSurveyStatusFilter,
    setUserSurveyWardListFilter
} from 'store/slices/filter';
import { FormattedMessage, useIntl } from 'react-intl';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const allPropertySituations = [{ value: 'all', label: 'All' }, ...propertySituations];

// ==============================|| SAMPLE PAGE ||============================== //

const SurveysPage = () => {
    const theme = useTheme();
    const intlHook = useIntl();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userSurveyFilter = useSelector((state) => state.filter.userSurveyFilter);

    const getStyles = useCallback(
        (condition) => {
            const colors = statusColors(theme);
            return colors[condition] || colors.Default;
        },
        [theme]
    );

    const [filtersDialog, setFiltersDialog] = useState({
        isOpen: false
    });

    const [needToRefreshRecords, setNeedToRefreshRecords] = useState(false);

    const lastSearchValue = useRef('');

    const [wardList, setWardList] = useState({
        isLoaded: false,
        data: []
    });

    const [recordList, setRecordList] = useState({
        isLoaded: false,
        isNextPageLoading: false,
        data: {
            records: [],
            totalElements: 0,
            filteredTotalCount: 0,
            projectCount: 0
        },
        rowsPerPage: 20,
        page: 1
    });

    const pageInvalidCheck = useMemo(() => {
        return checkIfPageInvalid(recordList.data.filteredTotalCount, recordList.rowsPerPage, recordList.page);
    }, [recordList.data.filteredTotalCount, recordList.page, recordList.rowsPerPage]);

    const fetchRecordList = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_API_URL}/Records/User`;

            const isSearchValid = Boolean(userSurveyFilter.search) && userSurveyFilter.search !== '';
            const searchParams = {
                sortField: 'createdat',
                sortOrder: 'asc',
                page: recordList.page,
                pageSize: recordList.rowsPerPage,
                searchValue: userSurveyFilter.search,
                wards: userSurveyFilter.wardList.selectedValues.map((ward) => ward.value).join(','),
                status:
                    userSurveyFilter.status.selectedValue.value && userSurveyFilter.status.selectedValue.value != 'all'
                        ? userSurveyFilter.status.selectedValue.value
                        : undefined,
                resurveyOnly: userSurveyFilter.showMarkForResurveyOnly ?? undefined
            };

            url = appendSearchParams(url, searchParams);

            const config = {
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axiosExtended.request(config);

            const { records, totalElements, filteredTotalCount, projectCount } = response.data;

            setRecordList((previousState) => {
                return {
                    ...previousState,
                    isLoaded: true,
                    isNextPageLoading: false,
                    data: {
                        records:
                            (isSearchValid && lastSearchValue.current != userSurveyFilter.search) || needToRefreshRecords
                                ? records
                                : _.uniqBy([...previousState.data.records, ...records], 'recordId'),
                        totalElements,
                        filteredTotalCount,
                        projectCount
                    }
                };
            });
            setNeedToRefreshRecords(false);
            lastSearchValue.current = userSurveyFilter.search;
        } catch (error) {
            showAxiosErrorEnquebar(error);
            setRecordList((previousState) => {
                return { ...previousState, isLoaded: true };
            });
        }
    }, [
        userSurveyFilter.search,
        userSurveyFilter.wardList.selectedValues,
        userSurveyFilter.status.selectedValue.value,
        userSurveyFilter.showMarkForResurveyOnly,
        recordList.page,
        recordList.rowsPerPage,
        needToRefreshRecords
    ]);

    useEffect(() => {
        fetchRecordList();
    }, [fetchRecordList]);

    useEffect(() => {
        const fetchWardList = async () => {
            let url = `${process.env.REACT_APP_API_URL}/User/Wards`;

            const config = {
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axiosExtended.request(config);

            const wardsData = response.data;

            const mutatedData = wardsData.map((ward) => {
                return { value: ward.wardId, label: `Ward ${ward.wardNumber}` };
            });

            setWardList((previousState) => {
                return { ...previousState, isLoaded: true, data: mutatedData };
            });
        };

        fetchWardList();
    }, []);

    const handleSearchFilter = (event) => {
        dispatch(setUserSurveySearchFilter(event.target.value));
    };

    const handleLoadMore = () => {
        if (!pageInvalidCheck.isInvalid) {
            setRecordList((previousState) => {
                return { ...previousState, page: previousState.page + 1, isNextPageLoading: true };
            });
        }
    };

    const handleOpenFiltersDialog = () => {
        dispatch(setUserSurveyWardListFilter({ tempSelectedValues: userSurveyFilter.wardList.selectedValues }));

        dispatch(setUserSurveyStatusFilter({ tempSelectedValue: userSurveyFilter.status.selectedValue }));

        setFiltersDialog((previousState) => {
            return { ...previousState, isOpen: true };
        });
    };

    const handleCloseFiltersDialog = () => {
        setNeedToRefreshRecords(true);
        setFiltersDialog((previousState) => {
            return { ...previousState, isOpen: false };
        });
    };

    const handleApplyFilters = () => {
        dispatch(setUserSurveyWardListFilter({ selectedValues: userSurveyFilter.wardList.tempSelectedValues }));

        dispatch(setUserSurveyStatusFilter({ selectedValue: userSurveyFilter.status.tempSelectedValue }));

        handleCloseFiltersDialog();
    };

    const resetFilters = () => {
        dispatch(resetUserSurveyFilter());

        handleCloseFiltersDialog();
    };

    const handleToggleResurveyOnly = (checked) => {
        dispatch(setUserMarkedForResurveyOnly(checked));
    };

    return (
        <>
            {!recordList.isLoaded ? (
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        height: '70vh',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <>
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    backgroundColor: theme.palette.background.default,
                                    p: 2,
                                    width: '100%',
                                    borderRadius: '10px',
                                    mb: 1
                                }}
                            >
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder={intlHook.formatMessage({ id: 'Search' })}
                                    value={userSurveyFilter.search}
                                    onChange={handleSearchFilter}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Box
                                    sx={{
                                        color: theme.palette.secondary.main,
                                        '&:hover': { color: theme.palette.secondary.light }
                                    }}
                                >
                                    <Button
                                        variant={'contained'}
                                        color="inherit"
                                        sx={{
                                            backgroundColor: theme.palette.secondary.light,
                                            boxShadow: 'none',
                                            '&:hover': { backgroundColor: theme.palette.secondary.main, boxShadow: 'none' }
                                        }}
                                        onClick={handleOpenFiltersDialog}
                                    >
                                        <FilterAltTwoToneIcon />
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    {recordList.data.filteredTotalCount > 0 ? (
                        <>
                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end', paddingRight: 1 }}>
                                <Typography variant="caption" fontSize={'14px'}>
                                    Showing records: {recordList.data.filteredTotalCount}/{recordList.data.projectCount}
                                </Typography>
                            </Box>
                            {recordList.data.records.map((record, index) => (
                                <MainCard key={record.recordId} sx={{ mt: 1, mb: 2 }}>
                                    <Grid container justifyContent={'space-between'}>
                                        <Grid item xs={7} sx={{ display: 'flex', gap: 2 }}>
                                            <Box>
                                                <Typography>{index + 1}.</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant={'caption'} sx={{ mb: 0.5 }}>
                                                    {record.tenementNo}
                                                </Typography>
                                                <Typography variant={'h5'} fontWeight={600} sx={{ mb: 0.5 }}>
                                                    {record.ownerName.length > 20
                                                        ? `${record.ownerName.slice(0, 20)}...`
                                                        : record.ownerName}
                                                </Typography>
                                                <Typography variant={'caption'}>
                                                    {record.propertyAddress.length > 25
                                                        ? `${record.propertyAddress.slice(0, 25)}...`
                                                        : record.propertyAddress}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    width: '100%',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'end'
                                                }}
                                            >
                                                <Chip
                                                    label={
                                                        propertySituations.filter(
                                                            (propertySituation) => propertySituation.value == record.status
                                                        )[0]?.label
                                                    }
                                                    color={'success'}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        mb: 0.5,
                                                        ...getStyles(record.status)
                                                    }}
                                                />
                                                <IconButton
                                                    sx={{ bgcolor: theme.palette.grey[100], borderRadius: '10px', p: 0.5 }}
                                                    onClick={() => navigate(`/app/survey/details/${record.recordId}/owner-info`)}
                                                >
                                                    <ArrowForwardIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </MainCard>
                            ))}
                            {!pageInvalidCheck.isInvalid && (
                                <Grid container>
                                    <Grid item xs={12} sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 2 }}>
                                        <LoadingButton
                                            loading={recordList.isNextPageLoading}
                                            variant={'text'}
                                            color="secondary"
                                            size="large"
                                            onClick={handleLoadMore}
                                            loadingIndicator={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        width: 180,
                                                        height: 40,
                                                        borderRadius: '10px',
                                                        backgroundColor: theme.palette.grey[300]
                                                    }}
                                                >
                                                    <CircularProgress color={'secondary'} size={23} />
                                                </Box>
                                            }
                                        >
                                            Load More
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '70vh' }}>
                            <Typography>No records found</Typography>
                        </Box>
                    )}

                    {/* Dialog for Filters */}
                    <Dialog
                        id={'filters-dialog'}
                        fullScreen
                        open={filtersDialog.isOpen}
                        onClose={handleCloseFiltersDialog}
                        TransitionComponent={Transition}
                        PaperProps={{
                            sx: { padding: 0, backgroundColor: 'background.default', overflowX: 'hidden', borderRadius: 0 }
                        }}
                    >
                        <AppBar sx={{ position: 'relative', backgroundColor: 'secondary.main' }}>
                            <Toolbar>
                                <IconButton
                                    id={'close-filters-dialog'}
                                    edge="start"
                                    color="inherit"
                                    onClick={handleCloseFiltersDialog}
                                    aria-label="close"
                                    size="medium"
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography
                                    variant="h3"
                                    color={theme.palette.mode === 'dark' ? theme.palette.grey[50] : theme.palette.background.paper}
                                    sx={{ ml: 2, flex: 1 }}
                                >
                                    Filters
                                </Typography>
                            </Toolbar>
                        </AppBar>
                        <Box sx={{ p: 3 }}>
                            {wardList.isLoaded ? (
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            <FormattedMessage id={'Wards'} />
                                        </Typography>
                                        <Autocomplete
                                            multiple
                                            fullWidth
                                            disableClearable
                                            disablePortal
                                            options={wardList.data}
                                            getOptionLabel={(option) => option.label}
                                            value={userSurveyFilter.wardList.tempSelectedValues}
                                            onChange={(event, newValue) => {
                                                dispatch(setUserSurveyWardListFilter({ tempSelectedValues: newValue }));
                                            }}
                                            sx={{ width: { xs: '100%' } }}
                                            renderTags={(value) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={option.label}
                                                        color="secondary"
                                                        sx={{
                                                            marginBlock: '3px',
                                                            marginLeft: '10px',
                                                            borderRadius: '10px',
                                                            bgcolor: theme.palette.secondary.main,
                                                            color: theme.palette.common.white,
                                                            fontSize: '15px',
                                                            '& .MuiChip-deleteIcon': {
                                                                color: `${theme.palette.secondary.light} !important`
                                                            }
                                                        }}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    placeholder="Select Wards"
                                                    onKeyDown={(e) => e.preventDefault()}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            <FormattedMessage id={'Status'} />
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            disableClearable
                                            disablePortal
                                            options={allPropertySituations}
                                            getOptionLabel={(option) => option.label}
                                            value={userSurveyFilter.status.tempSelectedValue}
                                            onChange={(event, newValue) => {
                                                dispatch(setUserSurveyStatusFilter({ tempSelectedValue: newValue }));
                                            }}
                                            sx={{ width: { xs: '100%' } }}
                                            renderInput={(params) => (
                                                <TextField
                                                    fullWidth
                                                    {...params}
                                                    placeholder="Select Status"
                                                    onKeyDown={(e) => e.preventDefault()}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={userSurveyFilter.showMarkForResurveyOnly} color="secondary" />}
                                            label={<FormattedMessage id={'Marked-for-resurvey-only'} />}
                                            onChange={(event, checked) => handleToggleResurveyOnly(checked)}
                                        />
                                    </Grid>
                                    <Grid container sx={{ justifyContent: 'flex-end', my: 3 }} spacing={1}>
                                        <Grid item>
                                            <AnimateButton>
                                                <Button variant="outlined" color="secondary" onClick={() => resetFilters()}>
                                                    Reset
                                                </Button>
                                            </AnimateButton>
                                        </Grid>
                                        <Grid item>
                                            <AnimateButton>
                                                <Button onClick={handleApplyFilters} variant="contained" color="secondary">
                                                    Apply
                                                </Button>
                                            </AnimateButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            ) : (
                                <></>
                            )}
                        </Box>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default SurveysPage;
