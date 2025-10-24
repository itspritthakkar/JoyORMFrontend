import PropTypes from 'prop-types';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import { recordSchema } from 'types';

const PropertyData = ({ recordData }) => {
    const recordDataValidated = recordSchema.cast(recordData.data);

    const theme = useTheme();
    const [propertyDataServer, setPropertyDataServer] = useState({
        isLoaded: false,
        infoExists: false,
        floors: [] // Set floors data here for view-only display
    });

    const fetchPropertyData = useCallback(async () => {
        try {
            let config = {
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/FloorInfo/Records/${recordDataValidated.recordId}`,
                headers: { 'Content-Type': 'application/json' }
            };
            const floorInfoResponse = await axiosExtended.request(config);
            setPropertyDataServer((previousState) => {
                return {
                    ...previousState,
                    isLoaded: true,
                    infoExists: floorInfoResponse.data.length > 0,
                    floors: floorInfoResponse.data
                };
            });
        } catch (error) {
            if (error.response?.status === 404) {
                setPropertyDataServer((previousState) => {
                    return { ...previousState, isLoaded: true, infoExists: false };
                });
            } else {
                showAxiosErrorEnquebar(error);
            }
        }
    }, [recordDataValidated.recordId]);

    useEffect(() => {
        fetchPropertyData();
    }, [fetchPropertyData]);

    return (
        <>
            {!propertyDataServer.infoExists && (
                <Grid container mt={3} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Grid item>
                        <Typography>Property Data does not exist</Typography>
                    </Grid>
                </Grid>
            )}
            {propertyDataServer.infoExists && (
                <Grid container>
                    {propertyDataServer.floors.map((floor, floorIndex) => (
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
                                                            label="Plan Name"
                                                            value={plan.planName || 'N/A'}
                                                            variant="outlined"
                                                            InputProps={{ readOnly: true }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                                    <TextField
                                                        variant="outlined"
                                                        label="Length"
                                                        value={plan.length || 'N/A'}
                                                        InputProps={{ readOnly: true }}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        label="Width"
                                                        value={plan.width || 'N/A'}
                                                        InputProps={{ readOnly: true }}
                                                    />
                                                    <TextField
                                                        variant="outlined"
                                                        label="Area"
                                                        value={plan.area || 'N/A'}
                                                        InputProps={{ readOnly: true }}
                                                    />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};

PropertyData.propTypes = {
    recordData: PropTypes.object.isRequired
};

export default PropertyData;
