import { Box, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import * as yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage } from 'react-intl';
import { ArrowBack } from '@mui/icons-material';
import { DASHBOARD_PATH } from 'config';
import { useNavigate } from 'react-router-dom';

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const ManagerAccount = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFormSubmitting, setIsFormSubmitting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    let formik = useFormik({
        initialValues: { ...initialValues },
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
                if (formik.isValid) {
                    let rawData = {
                        firstName: formik.values.firstName,
                        lastName: formik.values.lastName,
                        email: formik.values.email,
                        password: formik.values.password
                    };

                    let config = {
                        method: 'put',
                        url: `${process.env.REACT_APP_API_URL}/User/Manager`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(rawData)
                    };
                    await axiosExtended.request(config);

                    showAxiosSuccessEnquebar('User updated successfully.');
                }
            } catch (error) {
                // Handle Yup validation errors
                showAxiosErrorEnquebar(error);
            } finally {
                setIsFormSubmitting(false);
            }
        }
    });
    const { setFieldValue: formikSetFieldValue, setFieldTouched: formikSetFieldTouched } = formik;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/User/${user.id}`;

                const config = {
                    method: 'get',
                    url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axiosExtended.request(config);
                const { firstName, lastName, email, status } = response.data;

                formikSetFieldValue('firstName', firstName);
                formikSetFieldValue('lastName', lastName);
                formikSetFieldValue('email', email);
                formikSetFieldValue('status', status);

                setIsLoaded(true);
            } catch (error) {
                showAxiosErrorEnquebar(error);
            }
        };

        if (!isLoaded) {
            fetchUser();
        }
    }, [formikSetFieldTouched, formikSetFieldValue, isLoaded, user.id]);
    return (
        <MainCard
            key={'background-main'}
            title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => navigate(DASHBOARD_PATH)}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant={'body1'} fontSize={20}>
                        <FormattedMessage id={'Profile'} />
                    </Typography>
                </Box>
            }
            sx={{ minHeight: '70vh' }}
        >
            {isLoaded && (
                <Grid container>
                    <Grid item xs={12} md={6} sx={{ paddingRight: { md: 2 } }}>
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
                    <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 'unset' } }}>
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
                    <Grid item xs={12} sx={{ mt: { xs: 1, md: 2 } }}>
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

                    <Grid item xs={12} md={6} sx={{ paddingRight: { md: 2 }, mt: { xs: 1, md: 2 } }}>
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
                                        onClick={() => setShowPassword((previousState) => !previousState)}
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
                    <Grid item xs={12} md={6} sx={{ mt: { xs: 1, md: 2 } }}>
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
                                        onClick={() => setShowConfirmPassword((previousState) => !previousState)}
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

                    <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'end', width: '100%' }}>
                        <LoadingButton
                            loading={isFormSubmitting}
                            variant="contained"
                            color="secondary"
                            onClick={() => formik.handleSubmit()}
                            autoFocus
                        >
                            Save
                        </LoadingButton>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
};

export default ManagerAccount;
