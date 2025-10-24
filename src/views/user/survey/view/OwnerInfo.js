import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { ownerInfoSchema, recordSchema } from 'types';
import { useCallback, useEffect, useState } from 'react';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { FormattedMessage } from 'react-intl';

const OwnerInfo = ({ recordData }) => {
    const recordDataValidated = recordSchema.cast(recordData.data);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        data: ownerInfoSchema.getDefault()
    });

    const fetchOwnerInfo = useCallback(async () => {
        try {
            const config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/OwnerInfo/Records/${recordDataValidated.recordId}`,
                headers: { 'Content-Type': 'application/json' }
            };
            const ownerInfoResponse = await axiosExtended.request(config);
            const ownerInfoResponseData = await ownerInfoSchema.validate(ownerInfoResponse.data);

            setRecordDataServer((prevState) => ({
                ...prevState,
                isLoaded: true,
                infoExists: true,
                data: ownerInfoResponseData
            }));
        } catch (error) {
            if (error.response?.status === 404) {
                setRecordDataServer((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    infoExists: false
                }));
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [recordDataValidated.recordId]);

    useEffect(() => {
        fetchOwnerInfo();
    }, [fetchOwnerInfo]);

    return (
        <>
            {recordDataServer.isLoaded && (
                <>
                    {!recordDataServer.infoExists && (
                        <Grid container mt={3} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Grid item>
                                <Typography>Owner Info does not exist</Typography>
                            </Grid>
                        </Grid>
                    )}
                    {recordDataServer.infoExists && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Owner-name" /> <FormattedMessage id="according-to-record" />
                                </Typography>
                                <Typography>{recordDataValidated.ownerName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Owner-name" /> <FormattedMessage id="according-to-survey" />
                                </Typography>
                                <Typography>{recordDataServer.data.ownerSurveyName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Occupier-name" /> <FormattedMessage id="according-to-record" />
                                </Typography>
                                <Typography>{recordDataValidated.occupierName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Occupier-name" /> <FormattedMessage id="according-to-survey" />
                                </Typography>
                                <Typography>{recordDataServer.data.occupierSurveyName || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Address" /> <FormattedMessage id="according-to-record" />
                                </Typography>
                                <Typography>{recordDataValidated.propertyAddress || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Address" /> <FormattedMessage id="according-to-survey" />
                                </Typography>
                                <Typography>{recordDataServer.data.addressSurvey || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Property-Situation" />
                                </Typography>
                                <Typography>{recordDataValidated.status || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Type-of-Occupancy" />
                                </Typography>
                                <Typography>{recordDataServer.data.occupancyType || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="City-Survey-No" />
                                </Typography>
                                <Typography>{recordDataServer.data.citySurveyNumber || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="T-P-No" />
                                </Typography>
                                <Typography>{recordDataServer.data.tpNumber || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Revenue-No" />
                                </Typography>
                                <Typography>{recordDataServer.data.revenueSurveyNumber || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    <FormattedMessage id="Mobile-No" />
                                </Typography>
                                <Typography>{recordDataServer.data.mobileNumber || 'N/A'}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </>
    );
};

OwnerInfo.propTypes = {
    recordData: PropTypes.object.isRequired
};

export default OwnerInfo;
