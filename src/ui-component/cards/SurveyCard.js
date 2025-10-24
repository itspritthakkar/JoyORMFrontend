import PropTypes from 'prop-types';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project imports
import MainCard from './MainCard';

// ==============================|| REPORT CARD ||============================== //

const SurveyCard = ({ caption, primary, secondary, iconPrimary, color }) => {
    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

    return (
        <MainCard sx={{ height: '100%' }}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Stack spacing={1}>
                        <Typography variant="h3">{caption}</Typography>
                        <Typography variant="h4">{primary}</Typography>
                        <Typography variant="caption">{secondary}</Typography>
                    </Stack>
                </Grid>
                <Grid item>
                    <Typography variant="h2" style={{ color }}>
                        {primaryIcon}
                    </Typography>
                </Grid>
            </Grid>
        </MainCard>
    );
};

SurveyCard.propTypes = {
    caption: PropTypes.string,
    primary: PropTypes.string,
    secondary: PropTypes.string,
    iconPrimary: PropTypes.object,
    color: PropTypes.string
};

export default SurveyCard;
