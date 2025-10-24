import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import { businessInfoSchema, recordSchema } from 'types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage } from 'react-intl';

const initialValues = {
    organizationName: '',
    ownerName: '',
    organizationAddress: '',
    shopActLicenseNumber: '',
    businessType: '',
    // businessStartDate: new Date(),
    businessStartDate: null,
    panCardNumber: '',
    organizationTurnover: 0,
    balanceSheetTotal: 0,
    totalEmployees: 0
};

const BusinessInfo = ({ handleBack, handleNext, recordData }) => {
    const recordDataValidated = recordSchema.cast(recordData.data);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        businessInfoId: null
    });

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const [formControllers, setFormControllers] = useState({
        isOwnerNameAccordingToRecords: false,
        isPropertyAddressAccordingToRecords: false
    });

    let formik = useFormik({
        initialValues: { ...initialValues },
        validationSchema: yup.object({
            organizationName: yup.string().required('Organization Name is required'),
            ownerName: yup.string().required('Owner Name is required'),
            organizationAddress: yup.string().required('Organization Address is required'),
            shopActLicenseNumber: yup.string().optional(),
            businessType: yup.string().required('Business Type is required'),
            businessStartDate: yup.date().optional(),
            panCardNumber: yup.string().optional(),
            organizationTurnover: yup.number().required('Organization Turnover is Required'),
            balanceSheetTotal: yup.number().required('Balance Sheet Total is Required'),
            totalEmployees: yup.number().required('Total Employees is Required')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setIsFormSubmitting(true);
            try {
                if (formik.isValid && formik.dirty) {
                    const {
                        organizationName,
                        ownerName,
                        organizationAddress,
                        shopActLicenseNumber,
                        businessType,
                        businessStartDate,
                        panCardNumber,
                        organizationTurnover,
                        balanceSheetTotal,
                        totalEmployees
                    } = values;

                    const { isOwnerNameAccordingToRecords, isPropertyAddressAccordingToRecords } = formControllers;

                    let rawData = {
                        organizationName,
                        ownerName,
                        isOwnerSurveyRecordPer: isOwnerNameAccordingToRecords,
                        organizationAddress,
                        isAddressSurveyRecordPer: isPropertyAddressAccordingToRecords,
                        shopActLicenseNumber,
                        businessType,
                        businessStartDate: businessStartDate.toISOString(),
                        panCardNumber,
                        organizationTurnover,
                        balanceSheetTotal,
                        totalEmployees,
                        recordId: recordDataValidated.recordId
                    };

                    let config = {
                        method: recordDataServer.infoExists ? 'put' : 'post',
                        url: `${process.env.REACT_APP_API_URL}/BusinessInfo${
                            recordDataServer.infoExists ? '/' + recordDataServer.businessInfoId : ''
                        }`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(rawData)
                    };
                    await axiosExtended.request(config);

                    showAxiosSuccessEnquebar(
                        recordDataServer.infoExists ? 'Business Info updated successfully.' : 'Business Info added successfully.'
                    );

                    await fetchBusinessInfo();

                    return 'Success';
                }
            } catch (error) {
                showAxiosErrorEnquebar(error);
                return 'Error';
            } finally {
                setSubmitting(false);
                setIsFormSubmitting(false);
            }
        }
    });

    const {
        setFieldValue: formikSetFieldValue,
        // setFieldTouched: formikSetFieldTouched
        setValues: formikSetValues
        // setTouched: formikSetTouched
    } = formik;

    const fetchBusinessInfo = useCallback(async () => {
        try {
            let config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/BusinessInfo/Records/${recordDataValidated.recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const businessInfoResponse = await axiosExtended.request(config);

            const businessInfoResponseData = await businessInfoSchema.validate(businessInfoResponse.data);

            formikSetValues({
                organizationName: businessInfoResponseData.organizationName,
                ownerName: businessInfoResponseData.ownerName,
                organizationAddress: businessInfoResponseData.organizationAddress,
                shopActLicenseNumber: businessInfoResponseData.shopActLicenseNumber,
                businessType: businessInfoResponseData.businessType,
                businessStartDate: new Date(businessInfoResponseData.businessStartDate),
                panCardNumber: businessInfoResponseData.panCardNumber,
                organizationTurnover: businessInfoResponseData.organizationTurnover,
                balanceSheetTotal: businessInfoResponseData.balanceSheetTotal,
                totalEmployees: businessInfoResponseData.totalEmployees
            });

            setFormControllers((previousState) => {
                return {
                    ...previousState,
                    isOwnerNameAccordingToRecords: businessInfoResponseData.isOwnerSurveyRecordPer,
                    isPropertyAddressAccordingToRecords: businessInfoResponseData.isAddressSurveyRecordPer
                };
            });

            setRecordDataServer((previousState) => {
                return { ...previousState, isLoaded: true, infoExists: true, businessInfoId: businessInfoResponseData.businessInfoId };
            });
        } catch (error) {
            if (error.response?.status === 404) {
                setRecordDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [formikSetValues, recordDataValidated.recordId]);

    useEffect(() => {
        fetchBusinessInfo();
    }, [fetchBusinessInfo]);

    return (
        <>
            {recordDataServer.isLoaded ? (
                <>
                    <Grid container mt={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Organization-Name'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="organizationName"
                                name="organizationName"
                                value={formik.values.organizationName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organizationName && Boolean(formik.errors.organizationName)}
                                helperText={formik.touched.organizationName && formik.errors.organizationName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 1, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Owner-name'} /> <FormattedMessage id={'according-to-record'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="occupierNameRecord"
                                name="occupierNameRecord"
                                value={recordDataValidated.ownerName}
                                slotprops={{
                                    input: {
                                        readOnly: true
                                    }
                                }}
                                sx={{ pointerEvents: 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Owner-name'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="ownerName"
                                name="ownerName"
                                disabled={formControllers.isOwnerNameAccordingToRecords}
                                value={formik.values.ownerName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                                helperText={formik.touched.ownerName && formik.errors.ownerName}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color={'secondary'}
                                            checked={formControllers.isOwnerNameAccordingToRecords}
                                            onChange={(event) => {
                                                const checked = event.target.checked;
                                                if (checked) {
                                                    formikSetFieldValue('ownerName', recordDataValidated.ownerName);
                                                }
                                                setFormControllers((previousState) => {
                                                    return { ...previousState, isOwnerNameAccordingToRecords: checked };
                                                });
                                            }}
                                        />
                                    }
                                    label={<FormattedMessage id={'According-to-record'} />}
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 1, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Organization-Address'} /> <FormattedMessage id={'according-to-record'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="organizationAddressRecord"
                                name="organizationAddressRecord"
                                value={recordDataValidated.propertyAddress}
                                slotprops={{
                                    input: {
                                        readOnly: true
                                    }
                                }}
                                sx={{ pointerEvents: 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Organization-Address'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="organizationAddress"
                                name="organizationAddress"
                                disabled={formControllers.isPropertyAddressAccordingToRecords}
                                value={formik.values.organizationAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organizationAddress && Boolean(formik.errors.organizationAddress)}
                                helperText={formik.touched.organizationAddress && formik.errors.organizationAddress}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color={'secondary'}
                                            checked={formControllers.isPropertyAddressAccordingToRecords}
                                            onChange={(event) => {
                                                const checked = event.target.checked;
                                                if (checked) {
                                                    formikSetFieldValue('organizationAddress', recordDataValidated.propertyAddress);
                                                }
                                                setFormControllers((previousState) => {
                                                    return { ...previousState, isPropertyAddressAccordingToRecords: checked };
                                                });
                                            }}
                                        />
                                    }
                                    label=<FormattedMessage id={'According-to-record'} />
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Shop-Act-License-No'} />.
                            </Typography>
                            <TextField
                                fullWidth
                                id="shopActLicenseNumber"
                                name="shopActLicenseNumber"
                                value={formik.values.shopActLicenseNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.shopActLicenseNumber && Boolean(formik.errors.shopActLicenseNumber)}
                                helperText={formik.touched.shopActLicenseNumber && formik.errors.shopActLicenseNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Type-of-Business'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="businessType"
                                name="businessType"
                                value={formik.values.businessType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.businessType && Boolean(formik.errors.businessType)}
                                helperText={formik.touched.businessType && formik.errors.businessType}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Business-Start-Date'} />
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    inputFormat="dd/MM/yyyy"
                                    id="businessStartDate"
                                    name="businessStartDate"
                                    value={formik.values.businessStartDate}
                                    maxDate={new Date()}
                                    onChange={(value) => formikSetFieldValue('businessStartDate', value, true)}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.businessStartDate && Boolean(formik.errors.businessStartDate)}
                                    helperText={formik.touched.businessStartDate && formik.errors.businessStartDate}
                                    renderInput={(params) => <TextField id={'businessStartDate'} {...params} fullWidth />}
                                />
                                <Typography variant="caption" color={'red'}>
                                    {Boolean(formik.touched.businessStartDate) &&
                                        Boolean(formik.errors.businessStartDate) &&
                                        'Please select a valid business start date'}
                                </Typography>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Pan-Card-No'} />.
                            </Typography>
                            <TextField
                                fullWidth
                                id="panCardNumber"
                                name="panCardNumber"
                                value={formik.values.panCardNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.panCardNumber && Boolean(formik.errors.panCardNumber)}
                                helperText={formik.touched.panCardNumber && formik.errors.panCardNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Organization-Total-Turnover'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="organizationTurnover"
                                name="organizationTurnover"
                                value={formik.values.organizationTurnover}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.organizationTurnover && Boolean(formik.errors.organizationTurnover)}
                                helperText={formik.touched.organizationTurnover && formik.errors.organizationTurnover}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Balance-Sheet-Total'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="balanceSheetTotal"
                                name="balanceSheetTotal"
                                value={formik.values.balanceSheetTotal}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.balanceSheetTotal && Boolean(formik.errors.balanceSheetTotal)}
                                helperText={formik.touched.balanceSheetTotal && formik.errors.balanceSheetTotal}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Total-Employees'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="totalEmployees"
                                name="totalEmployees"
                                value={formik.values.totalEmployees}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.totalEmployees && Boolean(formik.errors.totalEmployees)}
                                helperText={formik.touched.totalEmployees && formik.errors.totalEmployees}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 2, display: 'flex', justifyContent: 'end' }} spacing={1}>
                        <Grid item>
                            <AnimateButton>
                                <LoadingButton
                                    loading={isFormSubmitting}
                                    onClick={() => formik.submitForm()}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    {recordDataServer.infoExists ? <FormattedMessage id={'Update'} /> : <FormattedMessage id={'Save'} />}
                                </LoadingButton>
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton>
                                <LoadingButton
                                    loading={isFormSubmitting}
                                    onClick={async () => {
                                        const result = await formik.submitForm();
                                        if (result === 'Success') {
                                            handleNext();
                                        }
                                    }}
                                    variant="contained"
                                    color="secondary"
                                >
                                    {recordDataServer.infoExists ? <FormattedMessage id={'Update'} /> : <FormattedMessage id={'Save'} />} &{' '}
                                    <FormattedMessage id={'Next'} />
                                </LoadingButton>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ justifyContent: 'space-between', mt: 1, mb: 3 }} spacing={1}>
                        <Grid item>
                            <AnimateButton>
                                <Button onClick={handleBack} variant="contained" startIcon={<ArrowBackIcon />} color="secondary">
                                    <FormattedMessage id={'Previous'} />
                                </Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item sx={{ display: 'flex', gap: 1 }}>
                            <AnimateButton>
                                <Button
                                    sx={{ minWidth: 130 }}
                                    onClick={
                                        recordDataServer.infoExists
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
                    </Grid>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

BusinessInfo.propTypes = {
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    recordData: PropTypes.object.isRequired
};

export default BusinessInfo;
