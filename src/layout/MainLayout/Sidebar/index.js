import { memo, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, IconButton, Typography, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
// import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';
// import Chip from 'ui-component/extended/Chip';

import LAYOUT_CONST from 'constant';
import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';
import { IconLogout, IconUser } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
    const theme = useTheme();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const dispatch = useDispatch();
    const { drawerOpen } = useSelector((state) => state.menu);

    const { drawerType } = useConfig();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    const logo = useMemo(
        () => (
            <Box sx={{ display: 'flex', p: 2, justifyContent: 'space-between', alignItems: 'center' }}>
                <LogoSection />
                <Box sx={{ backgroundColor: theme.palette.secondary.light, borderRadius: '12px' }}>
                    <IconButton onClick={() => navigate('/manager/account')}>
                        <IconUser color={theme.palette.secondary.dark} />
                    </IconButton>
                </Box>
            </Box>
        ),
        [navigate, theme.palette.secondary.dark, theme.palette.secondary.light]
    );

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <MenuList />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    justifyContent: 'flex-start',
                    position: 'sticky',
                    bottom: 0,
                    background: theme.palette.background.default,
                    cursor: 'pointer',
                    borderTop: `1px solid ${theme.palette.divider}`
                }}
                onClick={handleLogout}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        width: '100%',
                        height: '40px',
                        p: 2,
                        borderRadius: '8px',
                        color: theme.palette.text.primary,
                        '&:hover': { background: theme.palette.secondary.light, color: theme.palette.secondary.dark }
                    }}
                >
                    <IconLogout size={20} style={{ color: 'inherit' }} />
                    <Typography variant="body2" sx={{ color: 'inherit' }}>
                        Logout
                    </Typography>
                </Box>
            </Box>
            {/* {layout === LAYOUT_CONST.VERTICAL_LAYOUT && drawerOpen && <MenuCard />} */}
            {/* {layout === LAYOUT_CONST.VERTICAL_LAYOUT && drawerOpen && (
                <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
                    <Chip label={process.env.REACT_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
                </Stack>
            )} */}
        </Box>
    );

    const drawerSX = {
        paddingLeft: drawerOpen ? '16px' : 0,
        paddingRight: drawerOpen ? '16px' : 0,
        marginTop: drawerOpen ? 0 : '20px'
    };

    const drawer = useMemo(
        () => (
            <>
                {matchDownMd ? (
                    <Box sx={{ height: '100%', ...drawerSX }}>{drawerContent}</Box>
                ) : (
                    <PerfectScrollbar
                        component="div"
                        style={{
                            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
                            ...drawerSX
                        }}
                    >
                        {drawerContent}
                    </PerfectScrollbar>
                )}
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [matchUpMd, drawerOpen, drawerType]
    );

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
            {matchDownMd || (drawerType === LAYOUT_CONST.MINI_DRAWER && drawerOpen) ? (
                <Drawer
                    variant={matchUpMd ? 'persistent' : 'temporary'}
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => dispatch(openDrawer(!drawerOpen))}
                    sx={{
                        '& .MuiDrawer-paper': {
                            mt: matchDownMd ? 0 : 11,
                            zIndex: 1099,
                            width: drawerWidth,
                            background: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            borderRight: 'none'
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    color="inherit"
                >
                    {matchDownMd && logo}
                    {drawer}
                </Drawer>
            ) : (
                <MiniDrawerStyled variant="permanent" open={drawerOpen}>
                    {logo}
                    {drawer}
                </MiniDrawerStyled>
            )}
        </Box>
    );
};

export default memo(Sidebar);
