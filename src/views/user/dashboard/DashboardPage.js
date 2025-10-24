import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import SurveyCard from 'ui-component/cards/SurveyCard';
import MainCard from 'ui-component/cards/MainCard';
import ApexColumnChart from './ApexColumnChart';
import SatisfactionChartCard from './SatisfactionChartCard';
import { getWeekdayAbbreviation, showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { statusColors } from 'utils/commons/values';

const statusChartData = {
    height: 500,
    type: 'pie',
    options: {
        chart: {
            id: 'status-chart'
        },
        labels: ['extremely Satisfied', 'Satisfied', 'Poor', 'Very Poor'],
        legend: {
            show: true,
            position: 'bottom',
            fontFamily: 'inherit',
            labels: {
                colors: 'inherit'
            }
        },
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: false
            }
        },
        theme: {
            monochrome: {
                enabled: false // Disable monochrome to use custom colors
            }
        }
    },
    series: [66, 50, 40, 30]
};

// chart options
const totalSurveyChartOptions = {
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter(val) {
                return val;
            }
        }
    },
    legend: {
        show: true,
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 10,
        offsetY: 10,
        labels: {
            useSeriesColors: false
        },
        markers: {
            width: 16,
            height: 16,
            radius: 5
        },
        itemMargin: {
            horizontal: 15,
            vertical: 8
        }
    },
    responsive: [
        {
            breakpoint: 600,
            options: {
                yaxis: {
                    show: false
                }
            }
        }
    ]
};

const DashboardPage = () => {
    const theme = useTheme();

    const colors = statusColors(theme);

    const [dashboardData, setDashboardData] = useState({
        isLoaded: false,
        data: {
            totalCompletedToday: 0,
            totalCompletedThisWeek: 0,
            totalCompletedThisMonth: 0,
            totalCompleted: 0,
            totalPending: 0,
            totalActiveUsers: 0,
            recordSummary: [],
            pastSevenDaysCompletedRecords: []
        }
    });

    const [surveyOptionsData, setSurveyOptionsData] = useState({ options: totalSurveyChartOptions, data: [] });

    const [statusData, setStatusData] = useState(statusChartData);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/Records/Dashboard`;

                const config = {
                    method: 'get',
                    url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axiosExtended.request(config);

                const dashboardResponseData = response.data;

                setDashboardData((previousState) => {
                    return {
                        ...previousState,
                        isLoaded: true,
                        data: dashboardResponseData
                    };
                });

                const totalSurveyChartOptionsLocal = { ...totalSurveyChartOptions };
                totalSurveyChartOptionsLocal.xaxis.categories = dashboardResponseData.pastSevenDaysCompletedRecords
                    .map((item) => getWeekdayAbbreviation(item.date))
                    .reverse();

                setSurveyOptionsData((previousState) => {
                    return {
                        ...previousState,
                        options: totalSurveyChartOptionsLocal,
                        data: [
                            {
                                name: 'Surveys',
                                data: dashboardResponseData.pastSevenDaysCompletedRecords.map((item) => item.value).reverse()
                            }
                        ]
                    };
                });

                const statusChartDataLocal = { ...statusChartData };

                statusChartDataLocal.options.labels = dashboardResponseData.recordSummary.map((item) => item.label);
                statusChartDataLocal.options.colors = [
                    colors.Pending.color,
                    colors.Active.color,
                    colors.Completed.color,
                    colors.UnderConstruction.color,
                    colors.TemporaryLocked.color,
                    colors.PermanentLocked.color
                ];
                statusChartDataLocal.series = dashboardResponseData.recordSummary.map((item) => item.value);

                setStatusData(statusChartDataLocal);
            } catch (error) {
                showAxiosErrorEnquebar(error);
                setDashboardData((previousState) => {
                    return { ...previousState, isLoaded: true };
                });
            }
        };

        fetchDashboardData();
    }, [
        colors.Active.color,
        colors.Completed.color,
        colors.Pending.color,
        colors.PermanentLocked.color,
        colors.TemporaryLocked.color,
        colors.UnderConstruction.color
    ]);

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4} md={2}>
                    <SurveyCard
                        caption="Today"
                        primary={dashboardData.data.totalCompletedToday.toString()}
                        secondary="Completed Survey"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <SurveyCard
                        caption="This Week"
                        primary={dashboardData.data.totalCompletedThisWeek.toString()}
                        secondary="Completed Survey"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <SurveyCard
                        caption="This Month"
                        primary={dashboardData.data.totalCompletedThisMonth.toString()}
                        secondary="Completed Survey"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <SurveyCard
                        caption="Overall"
                        primary={dashboardData.data.totalCompleted.toString()}
                        secondary="Total Completed Survey"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <SurveyCard
                        caption="Surveyor"
                        primary={dashboardData.data.totalActiveUsers.toString()}
                        secondary="Total Surveyor Working"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={2}>
                    <SurveyCard
                        caption="Not completed"
                        primary={dashboardData.data.totalPending.toString()}
                        secondary="Attempted not completed"
                        color={theme.palette.secondary.main}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} mt={1}>
                {dashboardData.isLoaded && (
                    <Grid item xs={12} md={6} lg={6}>
                        <MainCard title="Total Survey Completed">
                            <ApexColumnChart columnChartOptions={surveyOptionsData.options} columnChartData={surveyOptionsData.data} />
                        </MainCard>
                    </Grid>
                )}
                {dashboardData.isLoaded && (
                    <Grid item xs={12} md={6} lg={6}>
                        <SatisfactionChartCard chartData={statusData} />
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default DashboardPage;
