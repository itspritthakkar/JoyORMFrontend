import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { FormattedMessage } from 'react-intl';
import useAuth from 'hooks/useAuth';
import Lottie from 'lottie-react';
import TwoFactorLoaderAnimation from 'assets/animations/two-factor-loader.json';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const { isTwoFactorPending } = useAuth();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item>
                                        <Link to="#" aria-label="theme-logo">
                                            <Logo />
                                        </Link>
                                    </Grid>
                                    {isTwoFactorPending ? (
                                        <Grid item xs={12}>
                                            <Grid container direction="column" alignItems="center" justifyContent="center" spacing={2}>
                                                <Grid item>
                                                    <Box sx={{ width: '90%' }}>
                                                        <Lottie animationData={TwoFactorLoaderAnimation} loop={true} />
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ px: 2 }}>
                                                        <Typography
                                                            color={theme.palette.primary.dark}
                                                            gutterBottom
                                                            variant={'h4'}
                                                            textAlign="center"
                                                        >
                                                            Two-Factor Approval Pending
                                                        </Typography>
                                                        <Typography variant="caption" fontSize="16px" textAlign="center">
                                                            Your 2FA request is being reviewed. You will be signed in automatically once it
                                                            is approved.
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid item xs={12}>
                                                <Grid
                                                    container
                                                    direction={matchDownSM ? 'column-reverse' : 'row'}
                                                    alignItems="center"
                                                    justifyContent="center"
                                                >
                                                    <Grid item>
                                                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                            <Typography
                                                                color={theme.palette.primary.dark}
                                                                gutterBottom
                                                                variant={matchDownSM ? 'h3' : 'h2'}
                                                            >
                                                                <FormattedMessage id={'hi'} />, <FormattedMessage id={'Welcome-Back'} />
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                fontSize="16px"
                                                                textAlign={matchDownSM ? 'center' : 'inherit'}
                                                            >
                                                                <FormattedMessage id={'Enter-your-credentials-to-continue'} />
                                                            </Typography>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <AuthLogin />
                                            </Grid>
                                        </>
                                    )}
                                    {/* <Grid item xs={12}>
                                        <Divider />
                                    </Grid> */}
                                    {/* <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                component={Link}
                                                to={'/register'}
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                Don&apos;t have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid> */}
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
