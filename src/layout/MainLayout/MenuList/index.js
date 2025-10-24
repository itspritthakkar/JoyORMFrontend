import { memo, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, List, Typography, useMediaQuery } from '@mui/material';

// project imports
import NavItem from './NavItem';
import { menuItems } from 'menu-items';
import NavGroup from './NavGroup';
import useConfig from 'hooks/useConfig';
import { useSelector } from 'store';
import LAYOUT_CONST from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';
import useAuth from 'hooks/useAuth';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const { layout } = useConfig();
    const { drawerOpen } = useSelector((state) => state.menu);
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    const [menu, setMenu] = useState(_.cloneDeep(menuItems.items));

    useEffect(() => {
        let roleBasedMenu = _.cloneDeep(menuItems.items).filter(
            (item) => (Array.isArray(item.role) && item.role.includes(user.role)) || !Array.isArray(item.role)
        );
        setMenu(roleBasedMenu);
    }, [user.role]);

    // last menu-item to show in horizontal menu bar
    const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;

    let lastItemIndex = menu.length - 1;
    let remItems = [];
    let lastItemId;

    if (lastItem && lastItem < menu.length) {
        lastItemId = menu[lastItem - 1].id;

        lastItemIndex = lastItem - 1;

        remItems = menu.slice(lastItem - 1, menu.length).map((item) => ({
            title: item.title,

            elements: item.children,

            icon: item.icon,

            ...(item.url && {
                url: item.url
            })
        }));
    }

    const navItems = menu.slice(0, lastItemIndex + 1).map((item) => {
        switch (item.type) {
            case 'group':
                if (item.url && item.id !== lastItemId) {
                    return (
                        <List
                            key={item.id}
                            {...(drawerOpen && layout !== LAYOUT_CONST.HORIZONTAL_LAYOUT && { sx: { mt: 1.5 } })}
                            disablePadding={!drawerOpen || layout === LAYOUT_CONST.HORIZONTAL_LAYOUT}
                        >
                            <NavItem item={item.id} level={1} isParents />
                            {layout !== LAYOUT_CONST.HORIZONTAL_LAYOUT && <Divider sx={{ py: 0.5 }} />}
                        </List>
                    );
                }
                return <NavGroup key={item.id} item={item} lastItem={lastItem} remItems={remItems} lastItemId={lastItemId} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
        <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>
    ) : (
        <>{navItems}</>
    );
};

export default memo(MenuList);
