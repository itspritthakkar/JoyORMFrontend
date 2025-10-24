import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Autocomplete, Button, Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography, useTheme } from '@mui/material';
import { ownerInfoSchema, recordSchema } from 'types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { appendSearchParams, showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { autocompleteListSchema, autocompleteSchema } from 'types/commons';
import { propertySituationAutocomplete } from 'utils/commons/values';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const typeOfOccupancyAutocomplete = autocompleteListSchema.cast([
    { label: 'Owner', value: 'Owner' },
    { label: 'Rented', value: 'Rented' },
    { label: 'Both', value: 'Both' }
]);

const initialValues = {
    ownerNameSurvey: '',
    occupierNameSurvey: '',
    propertyAddressSurvey: '',
    citySurveyNo: '',
    tpNo: '',
    revenueSurveyNo: '',
    mobileNo: ''
};

const initialAutocompleteValues = {
    propertySituation: propertySituationAutocomplete[0],
    typeOfOccupancy: typeOfOccupancyAutocomplete[0]
};

const phoneRegExp = /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[56789]\d{9}$/;

const OwnerInfo = ({ handleNext, recordData, fetchRecordData }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const recordDataValidated = recordSchema.cast(recordData.data);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        ownerInfoId: null
    });

    const [formControllers, setFormControllers] = useState({
        isOwnerNameAccordingToRecords: false,
        isOccupierNameAccordingToRecords: false,
        isPropertyAddressAccordingToRecords: false
    });

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    let formik = useFormik({
        initialValues: { ...initialValues, ...initialAutocompleteValues },
        validationSchema: yup.object({
            ownerNameSurvey: yup.string().required('Owner Name acdording to Survey is required'),
            occupierNameSurvey: yup.string().required('Occupier Name acdording to Survey is required'),
            propertyAddressSurvey: yup.string().required('Property Address acdording to Survey is required'),
            citySurveyNo: yup.string(), //.required('City Survey No. is required'),
            tpNo: yup.string(), //.required('T.P. No. is required'),
            revenueSurveyNo: yup.string(),
            mobileNo: yup.string().matches(phoneRegExp, 'Mobile No. is not valid').optional(), //.required('Mobile No. is required'),
            propertySituation: autocompleteSchema,
            typeOfOccupancy: autocompleteSchema
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setIsFormSubmitting(true);
            try {
                if (formik.isValid && formik.dirty) {
                    const {
                        propertySituation,
                        ownerNameSurvey,
                        occupierNameSurvey,
                        propertyAddressSurvey,
                        typeOfOccupancy,
                        citySurveyNo,
                        tpNo,
                        revenueSurveyNo,
                        mobileNo
                    } = values;

                    const { isOwnerNameAccordingToRecords, isOccupierNameAccordingToRecords, isPropertyAddressAccordingToRecords } =
                        formControllers;

                    let rawData = {
                        ownerSurveyName: ownerNameSurvey,
                        isOwnerSurveyRecordPer: isOwnerNameAccordingToRecords,
                        occupierSurveyName: occupierNameSurvey,
                        isOccupierSurveyRecordPer: isOccupierNameAccordingToRecords,
                        addressSurvey: propertyAddressSurvey,
                        isAddressSurveyRecordPer: isPropertyAddressAccordingToRecords,
                        occupancyType: typeOfOccupancy.value,
                        citySurveyNumber: citySurveyNo,
                        tpNumber: tpNo,
                        revenueSurveyNumber: revenueSurveyNo,
                        mobileNumber: mobileNo,
                        recordId: recordDataValidated.recordId
                    };

                    let config = {
                        method: recordDataServer.infoExists ? 'put' : 'post',
                        url: `${process.env.REACT_APP_API_URL}/OwnerInfo${
                            recordDataServer.infoExists ? '/' + recordDataServer.ownerInfoId : ''
                        }`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(rawData)
                    };
                    await axiosExtended.request(config);

                    let url = `${process.env.REACT_APP_API_URL}/Records/Status/${recordDataValidated.recordId}`;

                    const searchParams = {
                        status: propertySituation.value
                    };

                    url = appendSearchParams(url, searchParams);

                    let recordConfig = {
                        method: 'put',
                        url,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };
                    await axiosExtended.request(recordConfig);

                    showAxiosSuccessEnquebar(
                        recordDataServer.infoExists ? 'Owner Info updated successfully.' : 'Owner Info added successfully.'
                    );

                    if (recordDataValidated.status == propertySituation.value) {
                        await fetchOwnerInfo();
                    } else {
                        await fetchRecordData();
                    }

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

    const fetchOwnerInfo = useCallback(async () => {
        try {
            let config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/OwnerInfo/Records/${recordDataValidated.recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const ownerInfoResponse = await axiosExtended.request(config);

            const ownerInfoResponseData = await ownerInfoSchema.validate(ownerInfoResponse.data);

            const propertySituation =
                propertySituationAutocomplete.filter(
                    (propertySituationItem) => propertySituationItem.value === recordDataValidated.status
                )[0] ?? propertySituationAutocomplete.filter((propertySituationItem) => propertySituationItem.value === 'Active')[0];

            // if (!propertySituation) {
            //     throw new Error('Property Situation of Server appears invalid');
            // }

            const typeOfOccupancy = typeOfOccupancyAutocomplete.filter(
                (typeOfOccupancyItem) => typeOfOccupancyItem.value === ownerInfoResponseData.occupancyType
            )[0];

            if (!typeOfOccupancy) {
                throw new Error('Occupancy Type of Server appears invalid');
            }

            formikSetValues({
                ownerNameSurvey: ownerInfoResponseData.ownerSurveyName,
                occupierNameSurvey: ownerInfoResponseData.occupierSurveyName,
                propertyAddressSurvey: ownerInfoResponseData.addressSurvey,
                citySurveyNo: ownerInfoResponseData.citySurveyNumber,
                tpNo: ownerInfoResponseData.tpNumber,
                revenueSurveyNo: ownerInfoResponseData.revenueSurveyNumber,
                mobileNo: ownerInfoResponseData.mobileNumber,
                propertySituation,
                typeOfOccupancy
            });

            setFormControllers((previousState) => {
                return {
                    ...previousState,
                    isOwnerNameAccordingToRecords: ownerInfoResponseData.isOwnerSurveyRecordPer,
                    isOccupierNameAccordingToRecords: ownerInfoResponseData.isOccupierSurveyRecordPer,
                    isPropertyAddressAccordingToRecords: ownerInfoResponseData.isAddressSurveyRecordPer
                };
            });

            setRecordDataServer((previousState) => {
                return { ...previousState, isLoaded: true, infoExists: true, ownerInfoId: ownerInfoResponseData.ownerInfoId };
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
    }, [formikSetValues, recordDataValidated.recordId, recordDataValidated.status]);

    useEffect(() => {
        fetchOwnerInfo();
    }, [fetchOwnerInfo]);

    return (
        <>
            {recordDataServer.isLoaded ? (
                <>
                    <Grid container mt={3}>
                        <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
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
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Owner-name'} /> <FormattedMessage id={'according-to-survey'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="ownerNameSurvey"
                                name="ownerNameSurvey"
                                disabled={formControllers.isOwnerNameAccordingToRecords}
                                value={formik.values.ownerNameSurvey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.ownerNameSurvey && Boolean(formik.errors.ownerNameSurvey)}
                                helperText={formik.touched.ownerNameSurvey && formik.errors.ownerNameSurvey}
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
                                                    formikSetFieldValue('ownerNameSurvey', recordDataValidated.ownerName);
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
                                <FormattedMessage id={'Occupier-name'} /> <FormattedMessage id={'according-to-record'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="occupierNameRecord"
                                name="occupierNameRecord"
                                value={recordDataValidated.occupierName}
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
                                <FormattedMessage id={'Occupier-name'} /> <FormattedMessage id={'according-to-survey'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="occupierNameSurvey"
                                name="occupierNameSurvey"
                                disabled={formControllers.isOccupierNameAccordingToRecords}
                                value={formik.values.occupierNameSurvey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.occupierNameSurvey && Boolean(formik.errors.occupierNameSurvey)}
                                helperText={formik.touched.occupierNameSurvey && formik.errors.occupierNameSurvey}
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color={'secondary'}
                                            checked={formControllers.isOccupierNameAccordingToRecords}
                                            onChange={(event) => {
                                                const checked = event.target.checked;
                                                if (checked) {
                                                    formikSetFieldValue('occupierNameSurvey', recordDataValidated.occupierName);
                                                }
                                                setFormControllers((previousState) => {
                                                    return { ...previousState, isOccupierNameAccordingToRecords: checked };
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
                                <FormattedMessage id={'Address'} /> <FormattedMessage id={'according-to-record'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="propertyAddressRecord"
                                name="propertyAddressRecord"
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
                                <FormattedMessage id={'Address'} /> <FormattedMessage id={'according-to-survey'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="propertyAddressSurvey"
                                name="propertyAddressSurvey"
                                disabled={formControllers.isPropertyAddressAccordingToRecords}
                                value={formik.values.propertyAddressSurvey}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.propertyAddressSurvey && Boolean(formik.errors.propertyAddressSurvey)}
                                helperText={formik.touched.propertyAddressSurvey && formik.errors.propertyAddressSurvey}
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
                                                    formikSetFieldValue('propertyAddressSurvey', recordDataValidated.propertyAddress);
                                                }
                                                setFormControllers((previousState) => {
                                                    return { ...previousState, isPropertyAddressAccordingToRecords: checked };
                                                });
                                            }}
                                        />
                                    }
                                    label={<FormattedMessage id={'According-to-record'} />}
                                />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 }, mt: 1 }}>
                            <Typography variant="h5" sx={{ mb: 1, mt: { xs: 1, sm: 'unset' } }}>
                                <FormattedMessage id={'Property-Situation'} />
                            </Typography>
                            <Autocomplete
                                fullWidth
                                disableClearable
                                disablePortal
                                options={propertySituationAutocomplete}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                value={formik.values.propertySituation}
                                onChange={(event, newValue) => {
                                    formikSetFieldValue('propertySituation', newValue);
                                }}
                                sx={{ width: { xs: '100%' } }}
                                renderInput={(params) => <TextField fullWidth {...params} onKeyDown={(e) => e.preventDefault()} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 1, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1, mt: { xs: 1, sm: 'unset' } }}>
                                <FormattedMessage id={'Type-of-Occupancy'} />
                            </Typography>
                            <Autocomplete
                                fullWidth
                                disableClearable
                                disablePortal
                                options={typeOfOccupancyAutocomplete}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                value={formik.values.typeOfOccupancy}
                                onChange={(event, newValue) => {
                                    formikSetFieldValue('typeOfOccupancy', newValue);
                                }}
                                sx={{ width: { xs: '100%' } }}
                                renderInput={(params) => <TextField fullWidth {...params} onKeyDown={(e) => e.preventDefault()} />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'City-Survey-No'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="citySurveyNo"
                                name="citySurveyNo"
                                value={formik.values.citySurveyNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.citySurveyNo && Boolean(formik.errors.citySurveyNo)}
                                helperText={formik.touched.citySurveyNo && formik.errors.citySurveyNo}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'T-P-No'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="tpNo"
                                name="tpNo"
                                value={formik.values.tpNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.tpNo && Boolean(formik.errors.tpNo)}
                                helperText={formik.touched.tpNo && formik.errors.tpNo}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2, paddingRight: { sm: 2 } }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Revenue-No'} />
                            </Typography>
                            <TextField
                                fullWidth
                                id="revenueSurveyNo"
                                name="revenueSurveyNo"
                                value={formik.values.revenueSurveyNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.revenueSurveyNo && Boolean(formik.errors.revenueSurveyNo)}
                                helperText={formik.touched.revenueSurveyNo && formik.errors.revenueSurveyNo}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                <FormattedMessage id={'Mobile-No'} />
                            </Typography>
                            {/* <TextField
                                fullWidth
                                id="mobileNo"
                                name="mobileNo"
                                value={formik.values.mobileNo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
                                helperText={formik.touched.mobileNo && formik.errors.mobileNo}
                            /> */}

                            <PhoneInput
                                placeholder=""
                                country={'in'} // Set the default country
                                value={formik.values.mobileNo} // Bind the value from Formik
                                onChange={(value) => formik.setFieldValue('mobileNo', value)} // Update Formik's state on change
                                onBlur={() => formik.setFieldTouched('mobileNo', true)} // Mark the field as touched on blur
                                inputStyle={{
                                    width: '100%', // Full-width input styling
                                    borderColor: formik.touched.mobileNo && formik.errors.mobileNo ? 'red' : undefined, // Highlight border on error
                                    backgroundColor: theme.palette.grey[100],
                                    height: 50
                                }}
                                containerStyle={{
                                    marginBottom: '1rem' // Optional: margin styling for the container
                                }}
                                inputProps={{
                                    name: 'mobileNo',
                                    id: 'mobileNo'
                                }}
                            />
                            {formik.touched.mobileNo && formik.errors.mobileNo && (
                                <div style={{ color: 'red', fontSize: '0.8rem' }}>{formik.errors.mobileNo}</div>
                            )}
                        </Grid>
                    </Grid>

                    <AnimateButton>
                        <LoadingButton
                            loading={isFormSubmitting}
                            onClick={() => formik.submitForm()}
                            variant="contained"
                            color="secondary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {recordDataServer.infoExists ? <FormattedMessage id={'Update'} /> : <FormattedMessage id={'Save'} />}
                        </LoadingButton>
                    </AnimateButton>
                    <Grid container sx={{ justifyContent: 'space-between', mt: 2 }} spacing={1}>
                        <Grid item>
                            <AnimateButton>
                                <Button
                                    onClick={() => navigate('/app/survey')}
                                    variant="contained"
                                    startIcon={<ArrowBackIcon />}
                                    color="secondary"
                                >
                                    <FormattedMessage id={'Back'} />
                                </Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <AnimateButton>
                                <Button
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
                        {/* <Grid item>
                            <AnimateButton>
                                <Button
                                    onClick={async () => {
                                        const result = await formik.submitForm();
                                        if (result === 'Success') {
                                            ['Active'].includes(formik.values.propertySituation.value)
                                                ? handleNext()
                                                : navigate('/app/survey');
                                        }
                                    }}
                                    variant="contained"
                                    color="secondary"
                                >
                                    {recordDataServer.infoExists ? 'Update' : 'Save'} & Next
                                </Button>
                            </AnimateButton>
                        </Grid> */}
                    </Grid>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

OwnerInfo.propTypes = {
    handleNext: PropTypes.func.isRequired,
    recordData: PropTypes.object.isRequired,
    fetchRecordData: PropTypes.func.isRequired
};

export default OwnerInfo;
