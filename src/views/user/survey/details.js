import PropTypes from 'prop-types';
import PersonIcon from '@mui/icons-material/Person';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import OwnerInfo from './details-wizard/OwnerInfo';
import PropertyInfo from './details-wizard/PropertyInfo';
import BusinessInfo from './details-wizard/BusinessInfo';
import PropertyData from './details-wizard/PropertyData';
import DocumentAndSignature from './details-wizard/DocumentAndSignature';
import MainCard from 'ui-component/cards/MainCard';
import {
    Box,
    Divider,
    Grid,
    Skeleton,
    Step,
    StepConnector,
    stepConnectorClasses,
    StepLabel,
    Stepper,
    Typography,
    useMediaQuery
} from '@mui/material';
import Slider from 'react-slick';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SkeletonGridContainer } from 'utils/commons/components';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import { useNavigate, useParams } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import { propertyInfoSchema, recordSchema } from 'types';
import { FormattedMessage } from 'react-intl';
import PropertyLocation from './details-wizard/PropertyLocation';

const initialSteps = [
    {
        value: 'owner-info',
        label: (
            <>
                1. <FormattedMessage id={'Owner-Info'} />
            </>
        ),
        component: OwnerInfo,
        icon: <PersonIcon fontSize="inherit" />
    },
    {
        value: 'property-info',
        label: (
            <>
                2. <FormattedMessage id={'Property-Info'} />
            </>
        ),
        component: PropertyInfo,
        icon: <HomeRoundedIcon fontSize="inherit" />
    },
    {
        value: 'business-info',
        label: (
            <>
                2.1. <FormattedMessage id={'Business-Info'} />
            </>
        ),
        component: BusinessInfo,
        icon: <BusinessCenterRoundedIcon fontSize="inherit" />
    },
    {
        value: 'property-data',
        label: (
            <>
                3. <FormattedMessage id={'Property-Data'} />
            </>
        ),
        component: PropertyData,
        icon: <HomeWorkRoundedIcon fontSize="inherit" />
    },
    {
        value: 'document-and-signature',
        label: (
            <>
                4. <FormattedMessage id={'Document-and-Signature'} />
            </>
        ),
        component: DocumentAndSignature,
        icon: <DocumentScannerRoundedIcon fontSize="inherit" />
    },
    {
        value: 'property-location',
        label: (
            <>
                5. <FormattedMessage id={'Property-Location'} />
            </>
        ),
        component: PropertyLocation,
        icon: <FmdGoodIcon fontSize="inherit" />
    }
];

const sliderSettings = {
    slidesToShow: 1,
    autoplay: false,
    cssEase: 'ease-in-out',
    infinite: false,
    arrows: false,
    swipeToSlide: false,
    swipe: false
};

const DetailsWizard = () => {
    let sliderRef = useRef(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const matchDownSm = useMediaQuery(theme.breakpoints.down('sm'));

    const { recordId, stepId } = useParams();

    const [steps, setSteps] = useState(initialSteps);
    const [filteredSteps, setFilteredSteps] = useState(initialSteps);

    const [activeStep, setActiveStep] = useState(0);
    const [recordData, setRecordData] = useState({
        isLoaded: false,
        data: recordSchema.getDefault()
    });

    const [propertyInfoData, setPropertyInfoData] = useState({
        isLoaded: false,
        infoExists: false,
        data: propertyInfoSchema.getDefault()
    });

    useEffect(() => {
        const currentTabIndex = steps.findIndex((step) => {
            return step.value.toLowerCase() === stepId;
        });

        if (stepId && currentTabIndex > -1) {
            setActiveStep(currentTabIndex);
            if (matchDownSm) {
                sliderRef.slickGoTo(currentTabIndex);
            }
        } else {
            navigate('/app/survey');
        }

        setFilteredSteps(steps);
    }, [matchDownSm, navigate, stepId, steps]);

    useEffect(() => {
        let stepsLocal = [...initialSteps];

        if (recordData.data.status && !['Active', 'Pending', 'Completed'].includes(recordData.data.status)) {
            stepsLocal = stepsLocal.filter(
                (step) => step.value === 'owner-info' || step.value === 'document-and-signature' || step.value === 'property-location'
            );
        }

        if (
            (propertyInfoData.isLoaded && !propertyInfoData.infoExists) ||
            (propertyInfoData.isLoaded && propertyInfoData.infoExists && propertyInfoData.data.propertyType === 'Residential')
        ) {
            stepsLocal = stepsLocal.filter((step) => step.value !== 'business-info');
        }

        setSteps(stepsLocal);
    }, [propertyInfoData.data.propertyType, propertyInfoData.infoExists, propertyInfoData.isLoaded, recordData.data.status]);

    const fetchRecordData = useCallback(async () => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/Records/${recordId}`;

            const config = {
                method: 'get',
                url,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axiosExtended.request(config);

            const responseData = await recordSchema.validate(response.data);

            setRecordData((previousState) => {
                return {
                    ...previousState,
                    isLoaded: true,
                    data: responseData
                };
            });
            // setSteps(initialSteps);
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    }, [recordId]);

    useEffect(() => {
        fetchRecordData();
    }, [fetchRecordData]);

    const fetchPropertyInfo = useCallback(async () => {
        try {
            let config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/PropertyInfo/Records/${recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const propertyInfoResponse = await axiosExtended.request(config);

            const propertyInfoResponseData = await propertyInfoSchema.validate(propertyInfoResponse.data);

            setPropertyInfoData((previousState) => {
                return { ...previousState, isLoaded: true, infoExists: true, data: propertyInfoResponseData };
            });
        } catch (error) {
            if (error.response?.status === 404) {
                setPropertyInfoData((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [recordId]);

    useEffect(() => {
        fetchPropertyInfo();
    }, [fetchPropertyInfo]);

    const handleNext = () => {
        if (filteredSteps[activeStep + 1]) {
            if (matchDownSm) {
                sliderRef.slickNext();
            }
            setActiveStep((prevStep) => prevStep + 1);
            navigate(`/app/survey/details/${recordId}/${filteredSteps[activeStep + 1].value}`);
        }
    };

    const handleBack = () => {
        if (filteredSteps[activeStep - 1]) {
            if (matchDownSm) {
                sliderRef.slickPrev();
            }
            setActiveStep((prevStep) => prevStep - 1);
            navigate(`/app/survey/details/${recordId}/${filteredSteps[activeStep - 1].value}`);
        }
    };

    const CurrentStepComponent = filteredSteps[activeStep].component;

    const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 27
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage: 'linear-gradient(316deg, #3e187a 0%, #994ecc 74%)'
            }
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
                backgroundImage: 'linear-gradient(316deg, #3e187a 0%, #994ecc 74%)'
            }
        },
        [`& .${stepConnectorClasses.line}`]: {
            height: 3,
            border: 0,
            backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[500] : '#eaeaf0',
            borderRadius: 1
        }
    }));

    const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark[800] : '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 60,
        height: 60,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 30,
        ...(ownerState.active && {
            backgroundColor: '#3e187a',
            backgroundImage: 'linear-gradient(316deg, #3e187a 0%, #994ecc 74%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
        }),
        ...(ownerState.completed && {
            backgroundImage: 'linear-gradient(316deg, #3e187a 0%, #994ecc 74%)'
        })
    }));

    function ColorlibStepIcon(props) {
        const { active, completed, className } = props;

        return (
            <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
                {filteredSteps[String(props.icon - 1)].icon}
            </ColorlibStepIconRoot>
        );
    }

    ColorlibStepIcon.propTypes = {
        /**
         * Whether this step is active.
         * @default false
         */
        active: PropTypes.bool,
        className: PropTypes.string,
        /**
         * Mark the step as completed. Is passed to child components.
         * @default false
         */
        completed: PropTypes.bool,
        /**
         * The label displayed in the step icon.
         */
        icon: PropTypes.node
    };

    return (
        <MainCard
            title={
                recordData.data.tenementNo && recordData.data.wardNo ? (
                    `${recordData.data.tenementNo} (Ward ${recordData.data.wardNo})`
                ) : (
                    <Skeleton height="30px" width="250px" />
                )
            }
        >
            <>
                {matchDownSm ? (
                    <Slider
                        ref={(slider) => {
                            sliderRef = slider;
                        }}
                        {...sliderSettings}
                        style={{ marginBottom: 10 }}
                    >
                        {filteredSteps.map((step, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex !important',
                                    justifyContent: 'center',
                                    padding: 0
                                }}
                            >
                                <Box
                                    sx={{
                                        padding: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: theme.palette.secondary.main,
                                        width: '100%',
                                        borderRadius: '15px'
                                        // backgroundImage: 'linear-gradient(316deg, #3e187a 0%, #994ecc 74%)'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            // width: ,
                                            height: 30,
                                            fontSize: 40,
                                            // marginBottom: 1,
                                            gap: 1
                                        }}
                                    >
                                        {step.icon}
                                        <Typography variant="h4" fontWeight={200} color={'inherit'}>
                                            {step.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Slider>
                ) : (
                    <Stepper
                        alternativeLabel
                        activeStep={activeStep}
                        //sx={{ pt: 3, pb: 5 }}
                        connector={<ColorlibConnector />}
                    >
                        {filteredSteps.map((step) => (
                            <Step sx={{ borderRadius: '5px' }} key={step.value}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>{step.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}
                {/* Divider */}
                <Grid container>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                </Grid>
                {recordData.isLoaded && propertyInfoData.isLoaded ? (
                    <CurrentStepComponent
                        handleNext={handleNext}
                        handleBack={handleBack}
                        recordData={recordData}
                        propertyInfoData={propertyInfoData}
                        fetchPropertyInfo={fetchPropertyInfo}
                        fetchRecordData={fetchRecordData}
                    />
                ) : (
                    <SkeletonGridContainer>
                        <Grid item xs={12}>
                            <Skeleton variant="rounded" animation="wave" height={530} />
                        </Grid>
                    </SkeletonGridContainer>
                )}
            </>
        </MainCard>
    );
};

export default DetailsWizard;
