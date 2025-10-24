// material-ui
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useCallback, useEffect, useState } from 'react';
import { appendSearchParams, showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import { useTheme } from '@emotion/react';
import TablePlaceholder from 'ui-component/cards/Skeleton/TablePlaceholder';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';
import axiosExtended from 'utils/axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { SkeletonInputField, SkeletonInputLabel } from 'utils/commons/components';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from '@mui/lab';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    status: 'Active',
    password: '',
    confirmPassword: ''
};

const initialAutocompleteValues = {
    role: {
        value: 0,
        label: ''
    }
};

const addOrEditUserDialogInitialState = {
    isOpen: false,
    isEditLoaded: false,
    isEdit: false,
    editId: null
};

const deleteUserDialogInitialState = {
    isOpen: false,
    deleteId: null
};

const statusValues = ['Active', 'Inactive'];

// ==============================|| SAMPLE PAGE ||============================== //

const UsersPage = () => {
    const theme = useTheme();

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    let formik = useFormik({
        initialValues: { ...initialValues, ...initialAutocompleteValues },
        validationSchema: yup.object({
            firstName: yup
                .string()
                .min(3, 'First Name must be atleast 3 characters long')
                .max(100, 'First Name can be maximum 100 characters long')
                .required('First Name is required'),
            lastName: yup
                .string()
                .min(3, 'Last Name must be atleast 3 characters long')
                .max(100, 'Last Name can be maximum 100 characters long')
                .required('Last Name is required'),
            email: yup.string().email('Please enter a valid Email').required('Email is required'),
            status: yup.string().required('Status is required'),
            password: yup
                .string()
                .min(8, 'Password must be at least 8 characters long')
                .when('isEdit', {
                    is: false, // Password is required only in 'add' mode (not editing)
                    then: yup.string().required('Password is required'),
                    otherwise: yup.string().notRequired()
                }),
            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password'), null], 'Passwords must match')
                .when('isEdit', {
                    is: false, // Confirm Password validation is required only when adding
                    then: yup.string().required('Confirm password is required'),
                    otherwise: yup.string().notRequired()
                })
        }),
        onSubmit: async () => {
            setIsFormSubmitting(true);
            try {
                if (formik.isValid && (formik.dirty || Boolean(addOrEditUserDialog.isEdit))) {
                    let rawData = {
                        firstName: formik.values.firstName,
                        lastName: formik.values.lastName,
                        email: formik.values.email,
                        status: formik.values.status,
                        password: formik.values.password,
                        roleId: formik.values.role.value
                    };

                    let config = {
                        method: addOrEditUserDialog.isEdit ? 'put' : 'post',
                        url: addOrEditUserDialog.isEdit
                            ? `${process.env.REACT_APP_API_URL}/User/${addOrEditUserDialog.editId}`
                            : `${process.env.REACT_APP_API_URL}/User`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(rawData)
                    };
                    await axiosExtended.request(config);

                    fetchUserList();

                    showAxiosSuccessEnquebar(addOrEditUserDialog.isEdit ? 'User updated successfully.' : 'User added successfully.');

                    handleCloseAddOrUpdateUserDialog();
                }
            } catch (error) {
                // Handle Yup validation errors
                showAxiosErrorEnquebar(error);
            } finally {
                setIsFormSubmitting(false);
            }
        }
    });
    const {
        setFieldValue: formikSetFieldValue,
        setFieldTouched: formikSetFieldTouched
        // setValues: formikSetValues,
        // setTouched: formikSetTouched
    } = formik;

    const [userList, setUserList] = useState({
        isLoaded: false,
        data: {
            users: [],
            totalElements: 0
        },
        rowsPerPage: 5,
        page: 1,
        searchFilter: '',
        order: null,
        orderBy: null
    });

    const [rolesList, setRolesList] = useState({
        isLoaded: false,
        roles: []
    });

    const [addOrEditUserDialog, setAddOrEditUserDialog] = useState(addOrEditUserDialogInitialState);
    const [deleteUserDialog, setDeleteUserDialog] = useState(deleteUserDialogInitialState);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fetchUserList = useCallback(async () => {
        try {
            let url = `${process.env.REACT_APP_API_URL}/User`;
            const searchParams = {
                page: userList.page,
                pageSize: userList.rowsPerPage,
                searchValue: userList.searchFilter,
                sortOrder: userList.order,
                sortField: userList.orderBy
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
            const { users, totalCount } = response.data;

            setUserList((previousState) => {
                return {
                    ...previousState,
                    isLoaded: true,
                    data: {
                        users,
                        totalElements: totalCount
                    }
                };
            });
        } catch (error) {
            showAxiosErrorEnquebar(error);
            setUserList((previousState) => {
                return { ...previousState, isLoaded: true };
            });
        }
    }, [userList.order, userList.orderBy, userList.page, userList.rowsPerPage, userList.searchFilter]);

    useEffect(() => {
        fetchUserList();
    }, [fetchUserList]);

    useEffect(() => {
        const fetchRoleList = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/Roles`;

                const config = {
                    method: 'get',
                    url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axiosExtended.request(config);
                const roles = response.data;

                const mutatedData = roles.map((role) => ({
                    label: role.roleName, // Project Name as the label
                    value: role.id // Project Id as the value
                }));

                setRolesList((previousState) => {
                    return {
                        ...previousState,
                        isLoaded: true,
                        roles: mutatedData
                    };
                });

                formikSetFieldValue('role', mutatedData[0]);
            } catch (error) {
                showAxiosErrorEnquebar(error);
                setRolesList((previousState) => {
                    return { ...previousState, isLoaded: true };
                });
            }
        };

        fetchRoleList();
    }, [formikSetFieldValue]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/User/${addOrEditUserDialog.editId}`;

                const config = {
                    method: 'get',
                    url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axiosExtended.request(config);
                const { firstName, lastName, email, status, roleId } = response.data;

                let selectedRole = rolesList.roles.filter((role) => role.value === roleId)[0];

                formikSetFieldValue('firstName', firstName);
                formikSetFieldValue('lastName', lastName);
                formikSetFieldValue('email', email);
                formikSetFieldValue('status', status);

                if (selectedRole) {
                    formikSetFieldValue('role', selectedRole);
                }

                setAddOrEditUserDialog((previousState) => {
                    return {
                        ...previousState,
                        isEditLoaded: true
                    };
                });
            } catch (error) {
                showAxiosErrorEnquebar(error);
            }
        };

        if (addOrEditUserDialog.editId && rolesList.isLoaded) {
            fetchUser();
        }
    }, [addOrEditUserDialog.editId, formikSetFieldTouched, formikSetFieldValue, rolesList.isLoaded, rolesList.roles]);

    const handleChangePage = (event, newPage) => {
        newPage = newPage + 1;

        setUserList((previousState) => {
            return { ...previousState, page: newPage };
        });
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event?.target.value, 10);
        setUserList((previousState) => {
            return { ...previousState, page: 1, rowsPerPage: newRowsPerPage };
        });
    };

    const handleSearchFilter = (event) => {
        setUserList((previousState) => {
            return { ...previousState, searchFilter: event.target.value };
        });
    };

    const handleSort = (property) => {
        const isAsc = userList.orderBy === property && userList.order === 'asc';

        setUserList((previousState) => ({
            ...previousState,
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        }));
    };

    const resetFormik = () => {
        Object.keys(initialValues).forEach((value) => {
            formikSetFieldValue(value, initialValues[value]);
            formikSetFieldTouched(value, false);
        });
    };

    const handleAddUser = () => {
        resetFormik();
        formikSetFieldValue('isEdit', false);

        setAddOrEditUserDialog((previousState) => {
            return { ...previousState, isOpen: true };
        });
    };

    const handleEditUser = async (userId) => {
        resetFormik();
        formikSetFieldValue('isEdit', true);

        setAddOrEditUserDialog((previousState) => {
            return { ...previousState, isOpen: true, isEdit: true, editId: userId };
        });
    };

    const handleCloseAddOrUpdateUserDialog = () => {
        setAddOrEditUserDialog(addOrEditUserDialogInitialState);
    };

    const handleDeleteUser = (userId) => {
        setDeleteUserDialog((previousState) => {
            return { ...previousState, isOpen: true, deleteId: userId };
        });
    };

    const handleCloseDeleteUserDialog = () => {
        setDeleteUserDialog(deleteUserDialogInitialState);
    };

    const handleConfirmDeleteUser = async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/User/${deleteUserDialog.deleteId}`;

            const config = {
                method: 'delete',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axiosExtended.request(config);

            handleCloseDeleteUserDialog();

            showAxiosSuccessEnquebar('User deleted successfully');

            fetchUserList();
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    };

    return (
        <MainCard key={'background-main'} sx={{ minHeight: '70vh' }}>
            {userList.isLoaded && rolesList.isLoaded ? (
                <>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <Button
                                id={'add_user'}
                                onClick={handleAddUser}
                                color="secondary"
                                variant="contained"
                                startIcon={<AddIcon />}
                                fullWidth
                            >
                                Add User
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                            <TextField
                                size="small"
                                variant="outlined"
                                placeholder="Search"
                                value={userList.searchFilter}
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
                        </Grid>
                    </Grid>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ mt: 2 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            '& th': {
                                                backgroundColor:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.background.default
                                                        : theme.palette.grey[100]
                                            }
                                        }}
                                    >
                                        <TableCell sortDirection={userList.orderBy === 'name' ? userList.order : false}>
                                            <TableSortLabel
                                                active={userList.orderBy === 'name'}
                                                direction={userList.orderBy === 'name' ? userList.order : 'asc'}
                                                onClick={() => handleSort('name')}
                                            >
                                                Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sortDirection={userList.orderBy === 'email' ? userList.order : false}>
                                            <TableSortLabel
                                                active={userList.orderBy === 'email'}
                                                direction={userList.orderBy === 'email' ? userList.order : 'asc'}
                                                onClick={() => handleSort('email')}
                                            >
                                                Email
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sortDirection={userList.orderBy === 'role' ? userList.order : false}>
                                            <TableSortLabel
                                                active={userList.orderBy === 'role'}
                                                direction={userList.orderBy === 'role' ? userList.order : 'asc'}
                                                onClick={() => handleSort('role')}
                                            >
                                                Role
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sortDirection={userList.orderBy === 'status' ? userList.order : false}>
                                            <TableSortLabel
                                                active={userList.orderBy === 'status'}
                                                direction={userList.orderBy === 'status' ? userList.order : 'asc'}
                                                onClick={() => handleSort('status')}
                                            >
                                                Status
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell>Option</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userList.data.users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                {user.firstName} {user.lastName}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.roleName}</TableCell>
                                            <TableCell>{user.status}</TableCell>
                                            {!['manager@accountmanager.in'].includes(user.email.toLowerCase()) ? (
                                                <TableCell align="left">
                                                    <IconButton
                                                        color="secondary"
                                                        size="medium"
                                                        aria-label="edit"
                                                        onClick={() => handleEditUser(user.id)}
                                                    >
                                                        <EditTwoToneIcon
                                                            style={{
                                                                color:
                                                                    theme.palette.mode === 'dark'
                                                                        ? theme.palette.grey[50]
                                                                        : theme.palette.secondary.main
                                                            }}
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        color="secondary"
                                                        size="large"
                                                        aria-label="user delete"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <DeleteTwoToneIcon
                                                            style={{
                                                                color:
                                                                    theme.palette.mode === 'dark'
                                                                        ? theme.palette.grey[50]
                                                                        : theme.palette.secondary.main
                                                            }}
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            ) : (
                                                <TableCell></TableCell>
                                            )}
                                        </TableRow>
                                    ))}

                                    {userList.isLoaded && userList.data.totalElements === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align={'center'}>
                                                No Records Found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={userList.data.totalElements}
                            rowsPerPage={userList.rowsPerPage}
                            page={userList.page - 1}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>

                    <Dialog
                        open={addOrEditUserDialog.isOpen}
                        onClose={handleCloseAddOrUpdateUserDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                    >
                        <DialogTitle id="alert-dialog-title">User</DialogTitle>
                        <DialogContent>
                            {!addOrEditUserDialog.isEdit || addOrEditUserDialog.isEditLoaded ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            First Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="firstName"
                                            name="firstName"
                                            value={formik.values.firstName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                            helperText={formik.touched.firstName && formik.errors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            Last Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="lastName"
                                            name="lastName"
                                            value={formik.values.lastName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                            helperText={formik.touched.lastName && formik.errors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            Status
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            disableClearable
                                            disablePortal
                                            options={statusValues}
                                            value={formik.values.status}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue('status', newValue);
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            Role
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            disableClearable
                                            disablePortal
                                            options={rolesList.roles}
                                            getOptionLabel={(option) => option.label}
                                            value={formik.values.role}
                                            onChange={(event, newValue) => {
                                                formik.setFieldValue('role', newValue);
                                            }}
                                            renderInput={(params) => <TextField fullWidth {...params} />}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        edge="end"
                                                        size="large"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>
                                            Confirm Password
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                            InputProps={{
                                                endAdornment: (
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        edge="end"
                                                        size="large"
                                                    >
                                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container>
                                    <Grid item xs={12} md={6} sx={{ paddingRight: { md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 'unset' } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ paddingRight: { md: 2 }, mt: { xs: 1, md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ paddingRight: { md: 2 }, mt: { xs: 1, md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ paddingRight: { md: 2 }, mt: { xs: 1, md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 2 } }}>
                                        <SkeletonInputLabel />
                                        <SkeletonInputField />
                                    </Grid>
                                </Grid>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAddOrUpdateUserDialog} color="secondary">
                                Cancel
                            </Button>
                            <LoadingButton
                                loading={isFormSubmitting}
                                variant="contained"
                                color="secondary"
                                onClick={() => formik.handleSubmit()}
                                autoFocus
                            >
                                Save
                            </LoadingButton>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={deleteUserDialog.isOpen}
                        onClose={handleCloseDeleteUserDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                    >
                        <DialogTitle id="alert-dialog-title">User Delete</DialogTitle>
                        <DialogContent>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="h2">You are about to delete a user.</Typography>
                                <Typography>The action cannot be undone</Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteUserDialog} color="secondary">
                                Cancel
                            </Button>
                            <Button variant="contained" color="error" onClick={handleConfirmDeleteUser} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            ) : (
                <TablePlaceholder />
            )}
        </MainCard>
    );
};

export default UsersPage;
