import { createSlice } from '@reduxjs/toolkit';
import { propertySituations } from 'utils/commons/values';

const allPropertySituations = [{ value: 'all', label: 'All' }, ...propertySituations];

const defaultStartDate = new Date();
defaultStartDate.setFullYear(defaultStartDate.getFullYear() - 1);

const defaultEndDate = new Date();

const userSurveyFilterInitial = {
    wardList: {
        selectedValues: [],
        tempSelectedValues: []
    },
    status: {
        selectedValue: allPropertySituations[0],
        tempSelectedValue: allPropertySituations[0]
    },
    search: '',
    showMarkForResurveyOnly: false
};

const managerSurveyFilterInitial = {
    pagination: {
        rowsPerPage: 5,
        page: 1,
        order: 'asc',
        orderBy: 'createdat'
    },
    project: {
        isLoaded: false,
        data: {
            data: [],
            dropdownData: [],
            totalElements: 0
        },
        selectedValue: null
    },
    ward: {
        isLoaded: false,
        data: [],
        selectedValues: [],
        tempSelectedValues: []
    },
    user: {
        isLoaded: false,
        data: [],
        selectedValues: [],
        tempSelectedValues: []
    },
    status: {
        selectedValue: allPropertySituations[0],
        tempSelectedValue: allPropertySituations[0]
    },
    date: {
        tempStartDate: defaultStartDate,
        tempEndDate: defaultEndDate,
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        startDateError: '',
        endDateError: ''
    },
    search: '',
    showMarkForResurveyOnly: false,
    showMarkForResurveyDoneOnly: false
};

const initialState = {
    userSurveyFilter: userSurveyFilterInitial,
    managerSurveyFilter: managerSurveyFilterInitial
};
// ==============================|| SLICE - SUBSCRIPTION EDIT WIZARD DATA ||============================== //

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setUserSurveyWardListFilter(state, action) {
            state.userSurveyFilter.wardList = { ...state.userSurveyFilter.wardList, ...action.payload };
        },
        setUserSurveyStatusFilter(state, action) {
            state.userSurveyFilter.status = { ...state.userSurveyFilter.status, ...action.payload };
        },
        setUserSurveySearchFilter(state, action) {
            state.userSurveyFilter.search = action.payload;
        },
        setUserMarkedForResurveyOnly(state, action) {
            state.userSurveyFilter.showMarkForResurveyOnly = Boolean(action.payload);
        },
        resetUserSurveyFilter(state) {
            state.userSurveyFilter = userSurveyFilterInitial;
        },
        setManagerSurveyProjectFilter(state, action) {
            state.managerSurveyFilter.project = { ...state.managerSurveyFilter.project, ...action.payload };
        },
        setManagerSurveyWardFilter(state, action) {
            state.managerSurveyFilter.ward = { ...state.managerSurveyFilter.ward, ...action.payload };
        },
        resetManagerSurveyWardFilter(state) {
            state.managerSurveyFilter.ward = { ...initialState.managerSurveyFilter.ward };
        },
        setManagerSurveySearchFilter(state, action) {
            state.managerSurveyFilter.search = action.payload;
        },
        setManagerSurveyStatusFilter(state, action) {
            state.managerSurveyFilter.status = { ...state.managerSurveyFilter.status, ...action.payload };
        },
        setManagerSurveyDateFilter(state, action) {
            state.managerSurveyFilter.date = { ...state.managerSurveyFilter.date, ...action.payload };
        },
        resetManagerSurveyDateFilter(state) {
            state.managerSurveyFilter.date = { ...initialState.managerSurveyFilter.date };
        },
        setManagerSurveyPaginationFilter(state, action) {
            state.managerSurveyFilter.pagination = { ...state.managerSurveyFilter.pagination, ...action.payload };
        },
        setManagerSurveyUserFilter(state, action) {
            state.managerSurveyFilter.user = { ...state.managerSurveyFilter.user, ...action.payload };
        },
        setManagerMarkedForResurveyOnly(state, action) {
            state.managerSurveyFilter.showMarkForResurveyOnly = Boolean(action.payload);
        },
        setManagerMarkedForResurveyDoneOnly(state, action) {
            state.managerSurveyFilter.showMarkForResurveyDoneOnly = Boolean(action.payload);
        }
    }
});

export default filterSlice.reducer;

export const {
    setUserSurveyWardListFilter,
    setUserSurveyStatusFilter,
    setUserMarkedForResurveyOnly,
    setUserSurveySearchFilter,
    resetUserSurveyFilter,
    setManagerSurveyProjectFilter,
    setManagerSurveyWardFilter,
    resetManagerSurveyWardFilter,
    setManagerSurveySearchFilter,
    setManagerSurveyStatusFilter,
    setManagerSurveyDateFilter,
    resetManagerSurveyDateFilter,
    setManagerSurveyPaginationFilter,
    setManagerSurveyUserFilter,
    setManagerMarkedForResurveyOnly,
    setManagerMarkedForResurveyDoneOnly
} = filterSlice.actions;
