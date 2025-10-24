import PropTypes from 'prop-types';

// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

// =========================|| SATISFACTION CHART CARD ||========================= //

const SatisfactionChartCard = ({ chartData }) => {
    const { rtlLayout } = useConfig();

    return (
        <MainCard sx={{ height: '100%' }}>
            <Grid container direction="column" spacing={1}>
                <Grid item>
                    <Typography variant="h5" fontSize={'18px'}>
                        Total Survey Completed
                    </Typography>
                </Grid>
                <Grid
                    item
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                        '& .apexcharts-legend-text': { marginLeft: rtlLayout ? '8px' : 'initial' }
                    }}
                >
                    <Chart {...chartData} />
                </Grid>
            </Grid>
        </MainCard>
    );
};

SatisfactionChartCard.propTypes = {
    chartData: PropTypes.object
};

export default SatisfactionChartCard;
