import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Autocomplete, Box, Button, ButtonGroup, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material';
import { propertyInfoDataSchema, recordSchema } from 'types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { autocompleteBooleanListSchema, autocompleteListSchema, autocompleteSchema } from 'types/commons';
import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage, useIntl } from 'react-intl';

const propertyDescriptionAutocomplete = autocompleteListSchema.cast([
    { label: 'Independent Bungalow', value: 'IndependentBungalow' },
    { label: 'Tenament', value: 'Tenament' },
    { label: 'Row House', value: 'RowHouse' },
    { label: 'Flat', value: 'Flat' },
    { label: 'Village House', value: 'VillageHouse' },
    { label: 'Hut', value: 'Hut' },
    { label: 'Shop', value: 'Shop' },
    { label: 'None', value: 'None' }
]);

const initialValues = {
    newCode: '',
    numberOfWaterConnections: 0,
    numberOfGutterConnections: 0,
    yearOfConstruction: 0
};

const PropertyInfo = ({ handleBack, handleNext, recordData, propertyInfoData, fetchPropertyInfo }) => {
    const intlHook = useIntl();

    const propertyTypeAutocomplete = useMemo(
        () =>
            autocompleteListSchema.cast([
                { label: intlHook.formatMessage({ id: 'Residential' }), value: 'Residential' },
                { label: intlHook.formatMessage({ id: 'Commercial' }), value: 'Commercial' }
            ]),
        [intlHook]
    );

    const booleanAutocomplete = useMemo(
        () =>
            autocompleteBooleanListSchema.cast([
                { label: intlHook.formatMessage({ id: 'No' }), value: false },
                { label: intlHook.formatMessage({ id: 'Yes' }), value: true }
            ]),
        [intlHook]
    );

    const initialAutocompleteValues = useMemo(() => {
        return {
            propertyType: propertyTypeAutocomplete[0],
            propertyDescription: propertyDescriptionAutocomplete[0],
            isGovernmentProperty: booleanAutocomplete[0],
            isBorewellAvailable: booleanAutocomplete[0]
        };
    }, [booleanAutocomplete, propertyTypeAutocomplete]);

    const theme = useTheme();

    const [propertyInfoSubmitting, setPropertyInfoSubmitting] = useState(false);

    const recordDataValidated = recordSchema.cast(recordData.data);
    const propertyInfoDataValidated = propertyInfoDataSchema.cast(propertyInfoData);

    let formik = useFormik({
        initialValues: { ...initialValues, ...initialAutocompleteValues },
        validationSchema: yup.object({
            newCode: yup.string().optional(),
            numberOfWaterConnections: yup.number().required('Number Of Water Connections is required'),
            numberOfGutterConnections: yup.number().required('Number Of Gutter Connections is required'),
            yearOfConstruction: yup
                .number()
                .min(1500, 'Year must be greater than 1500')
                .max(new Date().getFullYear(), `Year must be less than ${new Date().getFullYear()}`)
                .required('Year of Construction is required'),
            propertyType: autocompleteSchema,
            propertyDescription: autocompleteSchema,
            isGovernmentProperty: autocompleteSchema,
            isBorewellAvailable: autocompleteSchema
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (formik.isValid) {
                    setPropertyInfoSubmitting(true);
                    const {
                        isGovernmentProperty,
                        newCode,
                        numberOfWaterConnections,
                        numberOfGutterConnections,
                        isBorewellAvailable,
                        yearOfConstruction,
                        propertyType,
                        propertyDescription
                    } = values;

                    let rawData = {
                        propertyType: propertyType.value,
                        propertyDescription: propertyDescription.value,
                        isGovernmentProperty: isGovernmentProperty.value,
                        isBorewellAvailable: isBorewellAvailable.value,
                        newCode,
                        numberOfWaterConnections,
                        numberOfGutterConnections,
                        yearOfConstruction,
                        recordId: recordDataValidated.recordId
                    };

                    let config = {
                        method: propertyInfoDataValidated.infoExists ? 'put' : 'post',
                        url: `${process.env.REACT_APP_API_URL}/PropertyInfo${
                            propertyInfoDataValidated.infoExists ? '/' + propertyInfoDataValidated.data.propertyInfoId : ''
                        }`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(rawData)
                    };
                    await axiosExtended.request(config);

                    showAxiosSuccessEnquebar(
                        propertyInfoDataValidated.infoExists ? 'Property Info updated successfully.' : 'Property Info added successfully.'
                    );

                    await fetchPropertyInfo();

                    return 'Success';
                }
            } catch (error) {
                showAxiosErrorEnquebar(error);
                return 'Error';
            } finally {
                setSubmitting(false);
                setPropertyInfoSubmitting(false);
            }
        }
    });

    const {
        setFieldValue: formikSetFieldValue,
        // setFieldTouched: formikSetFieldTouched
        setValues: formikSetValues
        // setTouched: formikSetTouched
    } = formik;

    useEffect(() => {
        if (propertyInfoDataValidated.infoExists) {
            const propertyType = propertyTypeAutocomplete.filter(
                (propertyTypeItem) => propertyTypeItem.value === propertyInfoDataValidated.data.propertyType
            )[0];

            if (!propertyType) {
                throw new Error('Property Type of Server appears invalid');
            }

            const propertyDescription = propertyDescriptionAutocomplete.filter(
                (propertyDescriptionItem) => propertyDescriptionItem.value === propertyInfoDataValidated.data.propertyDescription
            )[0];

            if (!propertyDescription) {
                throw new Error('Property Description of Server appears invalid');
            }

            const isGovernmentProperty = booleanAutocomplete.filter(
                (isGovernmentPropertyItem) => isGovernmentPropertyItem.value === propertyInfoDataValidated.data.isGovernmentProperty
            )[0];

            if (!isGovernmentProperty) {
                throw new Error('Is Governproperty Property of Server appears invalid');
            }

            const isBorewellAvailable = booleanAutocomplete.filter(
                (isBorewellAvailableItem) => isBorewellAvailableItem.value === propertyInfoDataValidated.data.isBorewellAvailable
            )[0];

            if (!isBorewellAvailable) {
                throw new Error('Is Borewell Available of Server appears invalid');
            }

            formikSetValues({
                isGovernmentProperty,
                newCode: propertyInfoDataValidated.data.newCode,
                numberOfWaterConnections: propertyInfoDataValidated.data.numberOfWaterConnections,
                numberOfGutterConnections: propertyInfoDataValidated.data.numberOfGutterConnections,
                isBorewellAvailable,
                yearOfConstruction: propertyInfoDataValidated.data.yearOfConstruction,
                propertyType,
                propertyDescription
            });
        }
    }, [
        booleanAutocomplete,
        formikSetValues,
        propertyInfoDataValidated.data.isBorewellAvailable,
        propertyInfoDataValidated.data.isGovernmentProperty,
        propertyInfoDataValidated.data.newCode,
        propertyInfoDataValidated.data.numberOfGutterConnections,
        propertyInfoDataValidated.data.numberOfWaterConnections,
        propertyInfoDataValidated.data.propertyDescription,
        propertyInfoDataValidated.data.propertyType,
        propertyInfoDataValidated.data.yearOfConstruction,
        propertyInfoDataValidated.infoExists,
        propertyTypeAutocomplete
    ]);

    const handleDecrement = (formikProperty) => {
        const existingValue = formik.values[formikProperty];
        if (existingValue > 0) {
            formikSetFieldValue(formikProperty, existingValue - 1);
        }
    };

    const handleIncrement = (formikProperty) => {
        const existingValue = formik.values[formikProperty];
        formikSetFieldValue(formikProperty, existingValue + 1);
    };

    return (
        <>
            <Grid container mt={3}>
                <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        <FormattedMessage id={'Property-Type'} />
                    </Typography>
                    <Autocomplete
                        fullWidth
                        disableClearable
                        disablePortal
                        options={propertyTypeAutocomplete}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={formik.values.propertyType}
                        onChange={(event, newValue) => {
                            formikSetFieldValue('propertyType', newValue);
                        }}
                        sx={{ width: { xs: '100%' } }}
                        renderInput={(params) => <TextField fullWidth {...params} onKeyDown={(e) => e.preventDefault()} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: { xs: 2, sm: 'unset' } }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        <FormattedMessage id={'Property-Description'} />
                    </Typography>
                    <Autocomplete
                        fullWidth
                        disableClearable
                        disablePortal
                        options={propertyDescriptionAutocomplete}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={formik.values.propertyDescription}
                        onChange={(event, newValue) => {
                            formikSetFieldValue('propertyDescription', newValue);
                        }}
                        sx={{ width: { xs: '100%' } }}
                        renderInput={(params) => <TextField fullWidth {...params} onKeyDown={(e) => e.preventDefault()} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: 4, paddingRight: { sm: 2 }, display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                        sx={{ width: '100%' }}
                        control={
                            <Autocomplete
                                fullWidth
                                disableClearable
                                disablePortal
                                options={booleanAutocomplete}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                value={formik.values.isGovernmentProperty}
                                onChange={(event, newValue) => {
                                    formikSetFieldValue('isGovernmentProperty', newValue);
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} onKeyDown={(e) => e.preventDefault()} />}
                            />
                        }
                        label={
                            <Typography sx={{ width: '100%' }}>
                                <FormattedMessage id={'Is-Government-Property'} />
                            </Typography>
                        }
                        labelPlacement="start"
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                    {/* <Typography variant="h5" sx={{ mb: 1 }}>
                        New Code
                    </Typography>
                    <TextField
                        fullWidth
                        id="newCode"
                        name="newCode"
                        value={formik.values.newCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.newCode && Boolean(formik.errors.newCode)}
                        helperText={formik.touched.newCode && formik.errors.newCode}
                    /> */}

                    <Typography variant="h5" sx={{ mb: 1 }}>
                        <FormattedMessage id={'Year-of-Construction'} />
                    </Typography>
                    <TextField
                        fullWidth
                        id="yearOfConstruction"
                        name="yearOfConstruction"
                        value={formik.values.yearOfConstruction}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.yearOfConstruction && Boolean(formik.errors.yearOfConstruction)}
                        helperText={formik.touched.yearOfConstruction && formik.errors.yearOfConstruction}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 2, paddingRight: { sm: 2 } }}>
                    <FormControlLabel
                        control={
                            <Box display="flex" justifyContent="center" sx={{ marginLeft: 2, paddingRight: { xs: 2, md: 'unset' } }}>
                                <ButtonGroup
                                    variant="outlined"
                                    sx={{
                                        alignItems: 'center',
                                        border: `1px solid ${theme.palette.secondary.main}`,
                                        borderRadius: '10px',
                                        backgroundColor: theme.palette.secondary.light
                                    }}
                                >
                                    <IconButton color="secondary" onClick={() => handleDecrement('numberOfWaterConnections')}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="body1">{formik.values.numberOfWaterConnections}</Typography>
                                    <IconButton color="secondary" onClick={() => handleIncrement('numberOfWaterConnections')}>
                                        <AddIcon />
                                    </IconButton>
                                </ButtonGroup>
                            </Box>
                        }
                        label={<FormattedMessage id={'Number-Of-Water-Connections'} />}
                        labelPlacement="start"
                        sx={{
                            marginLeft: '0px !important'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ my: 2 }}>
                    <FormControlLabel
                        control={
                            <Box display="flex" justifyContent="center" sx={{ marginLeft: 2, paddingRight: { xs: 2, md: 'unset' } }}>
                                <ButtonGroup
                                    variant="outlined"
                                    sx={{
                                        alignItems: 'center',
                                        border: `1px solid ${theme.palette.secondary.main}`,
                                        borderRadius: '10px',
                                        backgroundColor: theme.palette.secondary.light
                                    }}
                                >
                                    <IconButton color="secondary" onClick={() => handleDecrement('numberOfGutterConnections')}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography variant="body1">{formik.values.numberOfGutterConnections}</Typography>
                                    <IconButton color="secondary" onClick={() => handleIncrement('numberOfGutterConnections')}>
                                        <AddIcon />
                                    </IconButton>
                                </ButtonGroup>
                            </Box>
                        }
                        label={<FormattedMessage id={'Number-Of-Gutter-Connections'} />}
                        labelPlacement="start"
                        sx={{
                            marginLeft: '0px !important'
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ mt: 4, paddingRight: { sm: 2 }, display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                        sx={{ width: '100%' }}
                        control={
                            // <Switch
                            //     checked={formik.values.isBorewellAvailable}
                            //     onChange={(event) => formikSetFieldValue('isBorewellAvailable', event.target.checked)}
                            //     color="secondary"
                            // />
                            <Autocomplete
                                fullWidth
                                disableClearable
                                disablePortal
                                options={booleanAutocomplete}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                value={formik.values.isBorewellAvailable}
                                onChange={(event, newValue) => {
                                    formikSetFieldValue('isBorewellAvailable', newValue);
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} onKeyDown={(e) => e.preventDefault()} />}
                            />
                        }
                        label={
                            <Typography sx={{ width: '100%' }}>
                                <FormattedMessage id={'Is-Borewell-Available'} />
                            </Typography>
                        }
                        labelPlacement="start"
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                        Year of Construction
                    </Typography>
                    <TextField
                        fullWidth
                        id="yearOfConstruction"
                        name="yearOfConstruction"
                        value={formik.values.yearOfConstruction}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.yearOfConstruction && Boolean(formik.errors.yearOfConstruction)}
                        helperText={formik.touched.yearOfConstruction && formik.errors.yearOfConstruction}
                    />
                </Grid> */}
            </Grid>
            <Grid container sx={{ justifyContent: 'space-between', my: 3 }} spacing={1}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
                    <AnimateButton>
                        <LoadingButton
                            loading={propertyInfoSubmitting}
                            onClick={() => formik.submitForm()}
                            variant="contained"
                            color="secondary"
                        >
                            {propertyInfoDataValidated.infoExists ? <FormattedMessage id={'Update'} /> : <FormattedMessage id={'Save'} />}
                        </LoadingButton>
                    </AnimateButton>
                </Grid>
                <Grid item>
                    <AnimateButton>
                        <Button onClick={handleBack} variant="contained" startIcon={<ArrowBackIcon />} color="secondary">
                            <FormattedMessage id={'Previous'} />
                        </Button>
                    </AnimateButton>
                </Grid>
                <Grid item>
                    <AnimateButton>
                        <Button
                            sx={{ minWidth: 130 }}
                            onClick={
                                propertyInfoDataValidated.infoExists
                                    ? handleNext
                                    : () => showAxiosErrorEnquebar(new Error('Please complete this step to continue'))
                            }
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            color="secondary"
                        >
                            <FormattedMessage id={'Next'} />
                        </Button>
                    </AnimateButton>
                </Grid>
                {/* <Grid item>
                    <AnimateButton>
                        <Button
                            onClick={async () => {
                                const result = await formik.submitForm();
                                if (result === 'Success') {
                                    handleNext();
                                }
                            }}
                            variant="contained"
                            color="secondary"
                        >
                            {propertyInfoDataValidated.infoExists ? 'Update' : 'Save'} & Next
                        </Button>
                    </AnimateButton>
                </Grid> */}
            </Grid>
        </>
    );
};

PropertyInfo.propTypes = {
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    recordData: PropTypes.object.isRequired,
    propertyInfoData: PropTypes.object.isRequired,
    fetchPropertyInfo: PropTypes.func.isRequired
};

export default PropertyInfo;
