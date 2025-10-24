import PropTypes from 'prop-types';
import * as yup from 'yup';
import { Box, Button, Grid, IconButton, Menu, MenuItem, TextField, Typography } from '@mui/material';
import { floorInfoListSchema, recordSchema } from 'types';
import AnimateButton from 'ui-component/extended/AnimateButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage, useIntl } from 'react-intl';

const floorOptions = ['Ground Floor', 'Open Area', 'First Floor', 'Second Floor', 'Third Floor', 'Fourth Floor', 'Fifth Floor'];

const PropertyData = ({ handleBack, handleNext, recordData }) => {
    const theme = useTheme();
    const intlHook = useIntl();
    const recordDataValidated = recordSchema.cast(recordData.data);
    const [propertyDataServer, setPropertyDataServer] = useState({
        isLoaded: false,
        infoExists: false
    });

    const [isFormSubmitting, setIsFormSubmitting] = useState(false);

    const [selectableFloorOptions, setSelectableFloorOptions] = useState(floorOptions);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Validation schema for Formik
    const validationSchema = yup.object({
        floors: yup.array().of(
            yup.object({
                floorName: yup.string().required('Floor name is required'),
                totalSqFt: yup.number().min(1, 'Total Sq Feet must be positive').required('Total Sq Feet is required and must be a number'),
                plans: yup.array().of(
                    yup.object({
                        planName: yup.string().optional(),
                        width: yup.number().min(1, 'Width must be positive').required('Width is required and must be a number'),
                        length: yup.number().min(1, 'Length must be positive').required('Length is required and must be a number')
                    })
                )
            })
        )
    });

    // Formik hook for managing the form
    const formik = useFormik({
        initialValues: { floors: [] },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            setIsFormSubmitting(true);
            try {
                if (formik.isValid && formik.dirty) {
                    const rawData = formik.values.floors;

                    let config = {
                        method: 'post',
                        url: `${process.env.REACT_APP_API_URL}/FloorInfo/AddFloorWithPlans/${recordDataValidated.recordId}`,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify(rawData)
                    };
                    await axiosExtended.request(config);

                    await fetchPropertyData();

                    showAxiosSuccessEnquebar(
                        propertyDataServer.infoExists ? 'Property Data updated successfully.' : 'Property Data added successfully.'
                    );

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

    const fetchPropertyData = useCallback(async () => {
        try {
            let config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/FloorInfo/Records/${recordDataValidated.recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const floorInfoResponse = await axiosExtended.request(config);

            const floorInfoResponseData = await floorInfoListSchema.validate(floorInfoResponse.data);

            formikSetValues({
                floors: floorInfoResponseData
            });

            if (floorInfoResponseData.length > 0) {
                setPropertyDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: true };
                });
            } else {
                setPropertyDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setPropertyDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [formikSetValues, recordDataValidated.recordId]);

    useEffect(() => {
        fetchPropertyData();
    }, [fetchPropertyData]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        let updatedSelectedFloorOptions = floorOptions.filter(
            (floorOp) => !formik.values.floors.filter((floor) => floor.floorName === floorOp)[0]
        );

        setSelectableFloorOptions(updatedSelectedFloorOptions);
    }, [formik.values.floors]);

    // Function to add a new floor
    const addFloor = (floorName) => {
        handleClose();
        formikSetFieldValue('floors', [...formik.values.floors, { floorName, totalSqFt: 0, plans: [] }]);
    };

    const deleteFloor = (floorName) => {
        const updatedFloors = formik.values.floors.filter((floor) => floor.floorName !== floorName);
        formikSetFieldValue('floors', updatedFloors);
    };

    // // Function to add a new plan to a specific floor
    const addPlan = (floorIndex) => {
        const newFloors = [...formik.values.floors];
        newFloors[floorIndex].plans.push({ planName: '', width: '', length: '', area: 0 });
        formikSetFieldValue('floors', newFloors);
    };

    const deletePlan = (floorIndex, planIndex) => {
        const newFloors = [...formik.values.floors];

        // Remove the plan from the selected floor's plans array
        newFloors[floorIndex].plans.splice(planIndex, 1);

        // Recalculate the totalSqFt for the floor after the plan is removed
        newFloors[floorIndex].totalSqFt = newFloors[floorIndex].plans.reduce(
            (sum, p) => sum + (parseFloat(p.width) * parseFloat(p.length) || 0),
            0
        );

        // Update formik values with the modified floors array
        formik.setFieldValue('floors', newFloors);
    };

    // Function to calculate area dynamically using the latest values from the event
    const calculateArea = (e, floorIndex, planIndex, fieldType) => {
        const { value } = e.target;

        const newFloors = [...formik.values.floors];
        const plan = newFloors[floorIndex].plans[planIndex];

        if (fieldType === 'width') {
            plan.width = value;
        } else if (fieldType === 'length') {
            plan.length = value;
        }

        // Calculate the area with the latest width and length
        const width = parseFloat(plan.width) || 0;
        const length = parseFloat(plan.length) || 0;
        const area = width * length;

        // Update the plan's area
        newFloors[floorIndex].plans[planIndex].area = area;

        // Recalculate totalSqFt for the floor
        newFloors[floorIndex].totalSqFt = newFloors[floorIndex].plans.reduce(
            (sum, p) => sum + (parseFloat(p.width) * parseFloat(p.length) || 0),
            0
        );

        // Update formik values
        formikSetFieldValue(`floors[${floorIndex}]`, newFloors[floorIndex]);
    };

    return (
        <>
            <Grid container sx={{ mt: 4 }}>
                <Grid item xs={12}>
                    {/* <Box sx={{ display: 'flex', width: '100%', p: 2, backgroundColor: theme.palette.grey[100], borderRadius: '10px' }}> */}
                    {selectableFloorOptions.length > 0 && (
                        <>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="secondary"
                                sx={{ height: 35 }}
                                startIcon={<AddIcon />}
                                aria-controls={open ? 'dropdown-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <FormattedMessage id={'Add-Floor'} />
                            </Button>
                            <Menu
                                id="dropdown-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button'
                                }}
                            >
                                {selectableFloorOptions.map((floorOption) => (
                                    <MenuItem key={floorOption} onClick={() => addFloor(floorOption)}>
                                        {floorOption}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                    {/* </Box> */}
                </Grid>
                {formik.values.floors.map((floor, floorIndex) => (
                    <Grid key={floorIndex} item xs={12} sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '10px' }}>
                            <Box
                                sx={{
                                    paddingY: 1,
                                    paddingX: 1.5,
                                    display: 'flex',
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: theme.palette.secondary.main + '30',
                                    color: theme.palette.secondary.dark,
                                    borderRadius: '10px 10px 0 0'
                                }}
                            >
                                <Typography fontSize={'18px'} color={'inherit'}>
                                    {floor.floorName} ({floor.totalSqFt} Sq. mt.)
                                </Typography>
                                <IconButton sx={{ color: theme.palette.secondary.dark }} onClick={() => deleteFloor(floor.floorName)}>
                                    <DeleteOutlineIcon color="inherit" />
                                </IconButton>
                            </Box>
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        p: 1,
                                        width: '100%',
                                        borderRadius: '0 0 10px 10px',
                                        backgroundColor: theme.palette.grey[50]
                                    }}
                                >
                                    {floor.plans?.map((plan, planIndex) => (
                                        <Box key={planIndex} sx={{ mt: 2 }}>
                                            <Grid container>
                                                <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                                                    <TextField
                                                        fullWidth
                                                        placeholder={intlHook.formatMessage({ id: 'Plan-Name' })}
                                                        name={`floors[${floorIndex}].plans[${planIndex}].planName`}
                                                        value={formik.values.floors[floorIndex].plans[planIndex].planName}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={
                                                            formik.touched.floors?.[floorIndex]?.plans?.[planIndex]?.planName &&
                                                            Boolean(formik.errors.floors?.[floorIndex]?.plans?.[planIndex]?.planName)
                                                        }
                                                        helperText={
                                                            formik.touched.floors?.[floorIndex]?.plans?.[planIndex]?.planName &&
                                                            formik.errors.floors?.[floorIndex]?.plans?.[planIndex]?.planName
                                                        }
                                                    />
                                                    <Box
                                                        sx={{
                                                            p: 0.5,
                                                            backgroundColor: theme.palette.secondary.light,
                                                            borderRadius: '10px',
                                                            maxHeight: '50px'
                                                        }}
                                                    >
                                                        <IconButton onClick={() => deletePlan(floorIndex, planIndex)}>
                                                            <DeleteOutlineIcon color={'secondary'} />
                                                        </IconButton>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                <TextField
                                                    variant={'standard'}
                                                    placeholder="Length"
                                                    color="secondary"
                                                    name={`floors[${floorIndex}].plans[${planIndex}].length`}
                                                    type="number"
                                                    value={formik.values.floors[floorIndex].plans[planIndex].length}
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        calculateArea(e, floorIndex, planIndex, 'length');
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.floors?.[floorIndex]?.plans?.[planIndex]?.length &&
                                                        Boolean(formik.errors.floors?.[floorIndex]?.plans?.[planIndex]?.length)
                                                    }
                                                    helperText={
                                                        formik.touched.floors?.[floorIndex]?.plans?.[planIndex]?.length &&
                                                        formik.errors.floors?.[floorIndex]?.plans?.[planIndex]?.length
                                                    }
                                                />
                                                <TextField
                                                    variant={'standard'}
                                                    placeholder="Width"
                                                    color="secondary"
                                                    name={`floors[${floorIndex}].plans[${planIndex}].width`}
                                                    type="number"
                                                    value={formik.values.floors[floorIndex].plans[planIndex].width}
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        calculateArea(e, floorIndex, planIndex, 'width');
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.floors?.[floorIndex]?.plans?.[planIndex]?.width &&
                                                        Boolean(formik.errors.floors?.[floorIndex]?.plans?.[planIndex]?.width)
                                                    }
                                                    helperText={
                                                        formik.touched.floors?.[floorIndex]?.plans?.[planIndex]?.width &&
                                                        formik.errors.floors?.[floorIndex]?.plans?.[planIndex]?.width
                                                    }
                                                />

                                                <TextField
                                                    variant={'standard'}
                                                    placeholder="Area"
                                                    color="secondary"
                                                    name={`floors[${floorIndex}].plans[${planIndex}].area`}
                                                    value={formik.values.floors[floorIndex].plans[planIndex].area}
                                                    disabled
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="secondary"
                                        sx={{ mt: 2, height: 35 }}
                                        startIcon={<AddIcon />}
                                        onClick={() => addPlan(floorIndex)}
                                    >
                                        <FormattedMessage id={'Add-Measurement'} />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                ))}
                <LoadingButton
                    loading={isFormSubmitting}
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={() => formik.submitForm()}
                >
                    <FormattedMessage id={'Save'} />
                </LoadingButton>
            </Grid>
            <Grid container sx={{ justifyContent: 'space-between', my: 3 }} spacing={1}>
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
                                propertyDataServer.infoExists
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
    );
};

PropertyData.propTypes = {
    handleNext: PropTypes.func.isRequired,
    handleBack: PropTypes.func.isRequired,
    recordData: PropTypes.object.isRequired
};

export default PropertyData;
