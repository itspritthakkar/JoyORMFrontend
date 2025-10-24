import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { propertyInfoDataSchema } from 'types';

const PropertyInfoView = ({ propertyInfoData }) => {
    const propertyInfoDataValidated = propertyInfoDataSchema.cast(propertyInfoData);

    return (
        <>
            {!propertyInfoDataValidated.infoExists && (
                <Grid container mt={3} sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Grid item>
                        <Typography>Property Info does not exist</Typography>
                    </Grid>
                </Grid>
            )}
            {propertyInfoDataValidated.infoExists && (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Property Type
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.propertyType}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Property Description
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.propertyDescription}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Is Government Property
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.isGovernmentProperty ? 'Yes' : 'No'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Year of Construction
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.yearOfConstruction}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Number of Water Connections
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.numberOfWaterConnections}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Number of Gutter Connections
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.numberOfGutterConnections}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ paddingRight: { sm: 2 } }}>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Is Borewell Available
                        </Typography>
                        <Typography variant="body1">{propertyInfoDataValidated.data.isBorewellAvailable ? 'Yes' : 'No'}</Typography>
                    </Grid>
                </Grid>
            )}
        </>
    );
};

PropertyInfoView.propTypes = {
    propertyInfoData: PropTypes.object.isRequired
};

export default PropertyInfoView;
