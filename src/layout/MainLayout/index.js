import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Container, CssBaseline, useMediaQuery } from '@mui/material';

// project imports
// import Header from './Header';
import Sidebar from './Sidebar';
import HorizontalBar from './HorizontalBar';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import { breadcrumbItems } from 'menu-items';
import LAYOUT_CONST from 'constant';
import useConfig from 'hooks/useConfig';
import { drawerWidth, gridSpacing } from 'store/constant';
import { openDrawer } from 'store/slices/menu';
import { useDispatch, useSelector } from 'store';
import { IconMenu2 } from '@tabler/icons';

// assets
import { IconChevronRight } from '@tabler/icons';

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open, layout }) => ({
    ...theme.typography.mainContent,
    marginTop: 1,
    minHeight: '100vh',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...(!open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter + 200
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: layout === LAYOUT_CONST.VERTICAL_LAYOUT ? -(drawerWidth - 72) : '20px',
            width: `calc(100% - ${drawerWidth}px)`
            // marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter + 200
        }),
        marginLeft: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? '20px' : 0,
        // marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88,
        width: `calc(100% - ${drawerWidth}px)`
        // [theme.breakpoints.up('md')]: {
        //     marginTop: layout === LAYOUT_CONST.HORIZONTAL_LAYOUT ? 135 : 88
        // }
    }),
    [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        padding: '16px',
        // marginTop: 88,
        ...(!open && {
            width: `calc(100% - ${drawerWidth}px)`
        })
    },
    [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        marginRight: '10px',
        padding: '16px',
        // marginTop: 88,
        ...(!open && {
            width: `calc(100% - ${drawerWidth}px)`
        })
    }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();

    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);
    const { drawerType, container, layout } = useConfig();

    useEffect(() => {
        if (drawerType === LAYOUT_CONST.DEFAULT_DRAWER) {
            dispatch(openDrawer(true));
        } else {
            dispatch(openDrawer(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerType]);

    useEffect(() => {
        if (drawerType === LAYOUT_CONST.DEFAULT_DRAWER) {
            dispatch(openDrawer(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (matchDownMd) {
            dispatch(openDrawer(true));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd]);

    // const condition = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd;

    // const header = useMemo(
    //     () => (
    //         <Toolbar sx={{ p: condition ? '10px' : '16px' }}>
    //             <Header />
    //         </Toolbar>
    //     ),
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     [layout, matchDownMd]
    // );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            {/* header */}
            {/* <AppBar
                enableColorOnDark
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{ bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.background.dark }}
            >
                {header}
            </AppBar> */}

            {/* horizontal menu-list bar */}
            {layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd && <HorizontalBar />}

            {/* drawer */}
            {(layout === LAYOUT_CONST.VERTICAL_LAYOUT || matchDownMd) && <Sidebar />}

            {/* main content */}
            <Main theme={theme} open={drawerOpen} layout={layout}>
                <Container maxWidth={container ? 'lg' : false} {...(!container && { sx: { px: { xs: 0 } } })}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            gap: 1,
                            marginBottom: theme.spacing(gridSpacing),
                            backgroundColor: theme.palette.background.default,
                            borderRadius: '10px',
                            pl: 2
                        }}
                    >
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                overflow: 'hidden',
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                                color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                                '&:hover': {
                                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                                    color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
                                }
                            }}
                            onClick={() => dispatch(openDrawer(!drawerOpen))}
                            color="inherit"
                        >
                            <IconMenu2 stroke={1.5} size="20px" />
                        </Avatar>

                        {/* breadcrumb */}
                        <Breadcrumbs
                            maxItems={matchDownMd ? 2 : undefined}
                            separator={IconChevronRight}
                            navigation={breadcrumbItems}
                            icon
                            title
                            rightAlign
                        />
                    </Box>
                    <Outlet />
                </Container>
            </Main>
        </Box>
    );
};

export default MainLayout;
