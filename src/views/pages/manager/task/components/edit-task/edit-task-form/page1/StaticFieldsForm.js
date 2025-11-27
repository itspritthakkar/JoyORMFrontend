import { Add } from '@mui/icons-material';
import { Box, Button, Grid, Stack, TextField, Typography, useTheme, FormHelperText } from '@mui/material';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { useCallback, useEffect, useState } from 'react';
import CreateApplicationType from 'views/pages/manager/approvals/CreateApplicationType';
import PropTypes from 'prop-types';

const StaticFieldsForm = ({ formik }) => {
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [applicationTypes, setApplicationTypes] = useState({ isLoaded: false, isError: false, data: [] });

    useEffect(() => {
        const fetchApplicationTypes = async () => {
            try {
                setApplicationTypes({ isLoaded: false, isError: false, data: [] });
                const { data } = await axiosExtended.get('/ApplicationType');
                setApplicationTypes({ isLoaded: true, data: Array.isArray(data) ? data : [] });
            } catch (err) {
                setApplicationTypes({ isLoaded: true, isError: true, data: [] });
                showAxiosErrorEnquebar(err);
            }
        };

        fetchApplicationTypes();
    }, []);

    const addItem = useCallback((newItem) => {
        setApplicationTypes((prev) => ({ ...prev, data: [newItem, ...prev.data] }));
    }, []);

    const setError = useCallback((error) => {
        if (!error) return;
        setApplicationTypes((prev) => ({ ...prev, isError: true }));
    }, []);

    const handleOpen = () => setOpen(true);

    const handleApplicationTypeSelect = (typeId) => {
        formik.setFieldValue('applicationTypeId', typeId);
        formik.setFieldTouched('applicationTypeId', true);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2, fontSize: '18px' }}>
                Static Fields
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        {/* initial static fields */}
                        <Box>
                            <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                Name of Applicant
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Name of Applicant"
                                variant="outlined"
                                name="nameOfApplicant"
                                value={formik.values.nameOfApplicant}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nameOfApplicant && Boolean(formik.errors.nameOfApplicant)}
                                helperText={formik.touched.nameOfApplicant && formik.errors.nameOfApplicant}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                Passport No
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Passport No"
                                variant="outlined"
                                name="passportNo"
                                value={formik.values.passportNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.passportNo && Boolean(formik.errors.passportNo)}
                                helperText={formik.touched.passportNo && formik.errors.passportNo}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                Application Type
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{ mr: 1, mb: 1 }}
                                size="small"
                                fullWidth
                                startIcon={<Add />}
                                onClick={handleOpen}
                            >
                                Add Application Type
                            </Button>
                            {applicationTypes.isLoaded &&
                                !applicationTypes.isError &&
                                applicationTypes.data.map((type) => (
                                    <Button
                                        key={type.id}
                                        variant={formik.values.applicationTypeId === type.id ? 'contained' : 'outlined'}
                                        onClick={() => handleApplicationTypeSelect(type.id)}
                                        sx={{
                                            mr: 1,
                                            mb: 1,
                                            ...(formik.values.applicationTypeId === type.id && {
                                                backgroundColor: theme.palette.primary.main,
                                                color: theme.palette.primary.contrastText
                                            }),
                                            ...(formik.values.applicationTypeId !== type.id && {
                                                backgroundColor: `${theme.palette.primary.main}4D`,
                                                color: theme.palette.primary.dark,
                                                boxShadow: 'none',
                                                '&:hover': { backgroundColor: `${theme.palette.primary.main}66`, boxShadow: 'none' }
                                            })
                                        }}
                                        size="small"
                                        fullWidth
                                    >
                                        {type.label}
                                    </Button>
                                ))}
                            {formik.touched.applicationTypeId && formik.errors.applicationTypeId && (
                                <FormHelperText error>{formik.errors.applicationTypeId}</FormHelperText>
                            )}
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                Contact No
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Contact No"
                                variant="outlined"
                                name="contactNo"
                                value={formik.values.contactNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                                helperText={formik.touched.contactNo && formik.errors.contactNo}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ ml: 0.5, mb: 1 }}>
                                Email Id
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Email Id"
                                variant="outlined"
                                type="email"
                                name="emailId"
                                value={formik.values.emailId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                                helperText={formik.touched.emailId && formik.errors.emailId}
                            />
                        </Box>
                    </Stack>
                </Grid>
            </Grid>

            <CreateApplicationType open={open} setOpen={setOpen} addItem={addItem} setError={setError} />
        </Box>
    );
};

StaticFieldsForm.propTypes = {
    formik: PropTypes.object.isRequired
};

export default StaticFieldsForm;
