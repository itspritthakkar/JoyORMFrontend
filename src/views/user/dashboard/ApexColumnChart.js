import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';

// ==============================|| COLUMN CHART ||============================== //

const ApexColumnChart = ({ columnChartOptions, columnChartData }) => {
    const theme = useTheme();
    const { navType } = useConfig();

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];

    const secondary = theme.palette.secondary.main;
    const primaryMain = theme.palette.primary.main;
    const successDark = theme.palette.success.dark;

    const [series] = useState(columnChartData);
    // const [series] = useState([
    //     {
    //         name: 'Free Cash Flow',
    //         data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    //     }
    // ]);

    const [options, setOptions] = useState(columnChartOptions);

    React.useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [secondary, primaryMain, successDark],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            tooltip: {
                theme: navType === 'dark' ? 'dark' : 'light'
            },
            legend: {
                labels: {
                    colors: 'grey.500'
                }
            }
        }));
    }, [navType, primary, darkLight, grey200, secondary, primaryMain, successDark]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
    );
};

ApexColumnChart.propTypes = {
    columnChartOptions: PropTypes.object.isRequired,
    columnChartData: PropTypes.array.isRequired
};

export default ApexColumnChart;
