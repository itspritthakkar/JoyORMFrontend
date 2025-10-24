import { Box, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { propertyInfoSchema, recordSchema } from 'types';
// import QrCodeIcon from '@mui/icons-material/QrCode';
import PropTypes from 'prop-types';
import MainCard from 'ui-component/cards/MainCard';
import { useTheme } from '@mui/material/styles';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import OwnerInfo from './OwnerInfo';
import PropertyInfoView from './PropertyInfo';
import BusinessInfo from './BusinessInfo';
import PropertyData from './PropertyData';
import DocumentAndSignature from './DocumentAndSignature';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 0
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

const tabOptions = [
    {
        label: 'Owner Info',
        tabLabel: 'owner-info',
        displayOnLandingPage: true
    },
    {
        label: 'Property Info',
        tabLabel: 'property-info',
        displayOnLandingPage: true
    },
    {
        label: 'Business Info',
        tabLabel: 'business-info',
        displayOnLandingPage: true
    },
    {
        label: 'Property Data',
        tabLabel: 'property-data',
        displayOnLandingPage: true
    },
    {
        label: 'Document and Signature',
        tabLabel: 'document-and-signature',
        displayOnLandingPage: true
    }
];

const SurveyViewPage = () => {
    const theme = useTheme();
    const { recordId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [tabSelected, setTabSelected] = useState(0);

    const [recordData, setRecordData] = useState({
        isLoaded: false,
        data: recordSchema.getDefault()
    });

    const [propertyInfoData, setPropertyInfoData] = useState({
        isLoaded: false,
        infoExists: false,
        data: propertyInfoSchema.getDefault()
    });

    const [tabOptionsFiltered, setTabOptionsFiltered] = useState(tabOptions);

    useEffect(() => {
        let tabOptionsLocal = [...tabOptions];

        if (
            (propertyInfoData.isLoaded && !propertyInfoData.infoExists) ||
            (propertyInfoData.isLoaded && propertyInfoData.infoExists && propertyInfoData.data.propertyType === 'Residential')
        ) {
            tabOptionsLocal = tabOptionsLocal.filter((step) => step.tabLabel !== 'business-info');
        }

        setTabOptionsFiltered(tabOptionsLocal);
    }, [propertyInfoData.data.propertyType, propertyInfoData.infoExists, propertyInfoData.isLoaded]);

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

    const handleTabChange = (event, newIndex) => {
        setTabSelected(newIndex);
    };

    const isDashboardView = useMemo(() => location.pathname.includes('dashboard'), [location.pathname]);

    return (
        <Box
            sx={{
                p: {
                    xs: 3,
                    lg: isDashboardView ? undefined : 10,
                    backgroundColor: isDashboardView ? theme.palette.background.default : undefined
                }
            }}
        >
            {recordData.isLoaded && propertyInfoData.isLoaded && (
                <>
                    <Grid container sx={{ alignItems: 'flex-start' }}>
                        {isDashboardView && (
                            <IconButton size="medium" aria-label="edit" onClick={() => navigate(`/dashboard/survey`)}>
                                <ArrowBackIcon />
                            </IconButton>
                        )}
                        <Grid item xs={8}>
                            <Typography variant={'h2'}>{recordData.data.ownerName}</Typography>
                            <Typography variant={'body1'}>
                                {recordData.data.tenementNo} -{' '}
                                {recordData.data.propertyAddress?.length > 150
                                    ? `${recordData.data.propertyAddress.slice(0, 150)}...}`
                                    : recordData.data.propertyAddress}
                            </Typography>
                        </Grid>
                        {/* <Grid item xs={3}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                                <Button variant={'contained'} color={'secondary'} onClick={() => {}}>
                                    <QrCodeIcon />
                                </Button>
                            </Box>
                        </Grid> */}
                    </Grid>

                    <MainCard sx={{ mt: 3, backgroundColor: theme.palette.grey[100] }}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Tabs
                                    value={tabSelected}
                                    variant="scrollable"
                                    onChange={handleTabChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    scrollButtons="auto"
                                    allowScrollButtonsMobile
                                    TabIndicatorProps={{
                                        sx: {
                                            height: '4px',
                                            borderRadius: '10px'
                                        }
                                    }}
                                    sx={{
                                        '& .MuiTabs-flexContainer': {
                                            border: 'none'
                                        },
                                        '& a': {
                                            minHeight: 'auto',
                                            minWidth: 10,
                                            py: 1.5,
                                            px: 1,
                                            mr: 2.25,
                                            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start'
                                        },
                                        '& a.Mui-selected': {
                                            color: 'primary.main'
                                        },
                                        '& a > svg': {
                                            marginBottom: '4px !important',
                                            mr: 1.25
                                        }
                                    }}
                                >
                                    {tabOptionsFiltered.map((option, index) => {
                                        if (option.displayOnLandingPage) {
                                            return <Tab key={index} label={option.label} {...a11yProps(index)} />;
                                        }
                                    })}
                                </Tabs>
                            </Grid>
                            <Grid container>
                                {tabOptionsFiltered.find((tabOption) => tabOption.tabLabel == 'owner-info')?.displayOnLandingPage && (
                                    <TabPanel
                                        value={tabSelected}
                                        index={tabOptionsFiltered.findIndex((tabOption) => tabOption.tabLabel == 'owner-info')}
                                    >
                                        <Grid item xs={12} sx={{ paddingBlock: 2 }}>
                                            <OwnerInfo recordData={recordData} />
                                        </Grid>
                                    </TabPanel>
                                )}
                                {tabOptionsFiltered.find((tabOption) => tabOption.tabLabel == 'property-info')?.displayOnLandingPage && (
                                    <TabPanel
                                        value={tabSelected}
                                        index={tabOptionsFiltered.findIndex((tabOption) => tabOption.tabLabel == 'property-info')}
                                    >
                                        <Grid item xs={12} sx={{ paddingBlock: 2 }}>
                                            <PropertyInfoView propertyInfoData={propertyInfoData} />
                                        </Grid>
                                    </TabPanel>
                                )}
                                {tabOptionsFiltered.find((tabOption) => tabOption.tabLabel == 'business-info')?.displayOnLandingPage && (
                                    <TabPanel
                                        value={tabSelected}
                                        index={tabOptionsFiltered.findIndex((tabOption) => tabOption.tabLabel == 'business-info')}
                                    >
                                        <Grid item xs={12} sx={{ paddingBlock: 2 }}>
                                            <BusinessInfo recordData={recordData} />
                                        </Grid>
                                    </TabPanel>
                                )}
                                {tabOptionsFiltered.find((tabOption) => tabOption.tabLabel == 'property-data')?.displayOnLandingPage && (
                                    <TabPanel
                                        value={tabSelected}
                                        index={tabOptionsFiltered.findIndex((tabOption) => tabOption.tabLabel == 'property-data')}
                                    >
                                        <Grid item xs={12} sx={{ paddingBlock: 2 }}>
                                            <PropertyData recordData={recordData} />
                                        </Grid>
                                    </TabPanel>
                                )}
                                {tabOptionsFiltered.find((tabOption) => tabOption.tabLabel == 'document-and-signature')
                                    ?.displayOnLandingPage && (
                                    <TabPanel
                                        value={tabSelected}
                                        index={tabOptionsFiltered.findIndex((tabOption) => tabOption.tabLabel == 'document-and-signature')}
                                    >
                                        <Grid item xs={12} sx={{ paddingBlock: 2 }}>
                                            <DocumentAndSignature recordData={recordData} />
                                        </Grid>
                                    </TabPanel>
                                )}
                            </Grid>
                        </Grid>
                    </MainCard>
                </>
            )}
        </Box>
    );
};

export default SurveyViewPage;
