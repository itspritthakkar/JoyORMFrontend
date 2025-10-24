import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { businessInfoSchema, recordSchema } from 'types';
import { useCallback, useEffect, useState } from 'react';
import { formatDate, showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';

const BusinessInfo = ({ recordData }) => {
    const recordDataValidated = recordSchema.cast(recordData.data);

    const [recordDataServer, setRecordDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        data: businessInfoSchema.getDefault()
    });

    const fetchBusinessInfo = useCallback(async () => {
        try {
            const config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/BusinessInfo/Records/${recordDataValidated.recordId}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const businessInfoResponse = await axiosExtended.request(config);
            const businessInfoResponseData = await businessInfoSchema.validate(businessInfoResponse.data);

            setRecordDataServer({
                isLoaded: true,
                infoExists: true,
                data: businessInfoResponseData
            });
        } catch (error) {
            if (error.response?.status === 404) {
                setRecordDataServer({
                    isLoaded: true,
                    infoExists: false
                });
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [recordDataValidated.recordId]);

    useEffect(() => {
        fetchBusinessInfo();
    }, [fetchBusinessInfo]);

    return (
        <>
            {recordDataServer.isLoaded && (
                <>
                    {!recordDataServer.infoExists && (
                        <Grid container mt={3} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Grid item>
                                <Typography>Business Info does not exist</Typography>
                            </Grid>
                        </Grid>
                    )}
                    {recordDataServer.infoExists && (
                        <Grid container spacing={3}>
                            {/* Organization Name */}
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Organization Name
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.organizationName || 'N/A'}</Typography>
                            </Grid>

                            {/* Owner Name According to Record */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Owner Name according to record
                                </Typography>
                                <Typography variant="body1">{recordDataValidated.ownerName || 'N/A'}</Typography>
                            </Grid>

                            {/* Owner Name */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Owner Name according to survey
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.ownerName || 'N/A'}</Typography>
                            </Grid>

                            {/* Organization Address According to Record */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Organization Address according to record
                                </Typography>
                                <Typography variant="body1">{recordDataValidated.propertyAddress || 'N/A'}</Typography>
                            </Grid>

                            {/* Organization Address */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Organization Address according to survey
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.organizationAddress || 'N/A'}</Typography>
                            </Grid>

                            {/* Shop Act License No. */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Shop Act License No.
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.shopActLicenseNumber || 'N/A'}</Typography>
                            </Grid>

                            {/* Type of Business */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Type of Business
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.businessType || 'N/A'}</Typography>
                            </Grid>

                            {/* Business Start Date */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Business Start Date
                                </Typography>
                                <Typography variant="body1">{formatDate(recordDataServer.data.businessStartDate) || 'N/A'}</Typography>
                            </Grid>

                            {/* Pan Card No. */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Pan Card No.
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.panCardNumber || 'N/A'}</Typography>
                            </Grid>

                            {/* Organization Total Turnover */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Organization Total Turnover
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.organizationTurnover || 'N/A'}</Typography>
                            </Grid>

                            {/* Balance Sheet Total */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Balance Sheet Total
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.balanceSheetTotal || 'N/A'}</Typography>
                            </Grid>

                            {/* Total Employees */}
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Total Employees
                                </Typography>
                                <Typography variant="body1">{recordDataServer.data.totalEmployees || 'N/A'}</Typography>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </>
    );
};

BusinessInfo.propTypes = {
    recordData: PropTypes.object.isRequired
};

export default BusinessInfo;
