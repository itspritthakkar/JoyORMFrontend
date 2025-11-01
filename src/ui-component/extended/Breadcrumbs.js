import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Card, Divider, Grid, Typography } from '@mui/material';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';

// project imports
import { BASE_PATH } from '../../config';
import { gridSpacing } from 'store/constant';

// assets
import { IconTallymark1 } from '@tabler/icons';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import HomeIcon from '@mui/icons-material/Home';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import _ from 'lodash';
import { motion } from 'framer-motion';

const linkSX = {
    display: 'flex',
    color: 'grey.900',
    textDecoration: 'none',
    alignContent: 'center',
    alignItems: 'center'
};

const matchURLs = (collapseURL, browserURL) => {
    // Escape special regex characters in collapseURL, except for ':'
    const escapedCollapseURL = collapseURL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace placeholders (:param) with a regex pattern to match any sequence of non-slash characters
    const pattern = escapedCollapseURL.replace(/:[^/]+/g, '[^/]+');

    // Create a new RegExp object with the pattern and anchor it to match the entire URL
    const regex = new RegExp(`^${pattern}$`);

    // Test the browserURL against the generated regex
    return regex.test(browserURL);
};

const extractURLParams = (collapseURL, browserURL) => {
    const result = {};

    // Split the URLs into segments
    const collapseSegments = collapseURL.split('/');
    const browserSegments = browserURL.split('/');

    // Iterate over the segments and extract parameters
    for (let i = 0; i < collapseSegments.length; i++) {
        if (collapseSegments[i].startsWith(':')) {
            const paramName = collapseSegments[i].slice(1);
            result[paramName] = browserSegments[i];
        }
    }

    return result;
};

const replaceFoundParams = (params, templateURL) => {
    // Iterate over the keys in the params object
    for (const [key, value] of Object.entries(params)) {
        // Create a regex pattern to find the placeholders in the template
        const pattern = new RegExp(`:${key}`, 'g');
        // Replace the placeholders with the corresponding values
        templateURL = templateURL.replace(pattern, value);
    }
    return templateURL;
};

const MotionMuiBreadcrumbs = styled(motion(MuiBreadcrumbs))(() => ({
    '& button': {
        backgroundColor: 'transparent'
    }
}));

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({ card, divider, icon, icons, maxItems, navigation, rightAlign, separator, title, titleBottom, ...others }) => {
    const { pathname } = useLocation();
    const theme = useTheme();

    const iconStyle = {
        marginRight: theme.spacing(0.75),
        // marginTop: `-${theme.spacing(0.25)}`,
        width: '16px',
        height: '16px',
        color: theme.palette.secondary.main
    };

    const [main, setMain] = useState();
    const [item, setItem] = useState();
    const [group, setGroup] = useState();

    useEffect(() => {
        // set active item state
        const getCollapse = (menu, group) => {
            if (menu.children) {
                menu.children.filter((collapse) => {
                    if (collapse.type && collapse.type === 'collapse') {
                        getCollapse(collapse, group);
                    } else if (collapse.type && collapse.type === 'item') {
                        const collapseURL = collapse.url;
                        const browserURL = document.location.pathname;

                        if (typeof collapse.url === 'string') {
                            const urlsMatched = matchURLs(BASE_PATH + collapseURL, browserURL);

                            if (urlsMatched) {
                                setGroup(group);
                                setMain(menu);
                                setItem(collapse);
                            }
                        } else if (Array.isArray(collapseURL)) {
                            const matchCollapseURLs = collapseURL.filter((collapseURLItem) =>
                                matchURLs(BASE_PATH + collapseURLItem, browserURL)
                            );

                            const extractedURLParams =
                                matchCollapseURLs.length > 0 ? extractURLParams(BASE_PATH + matchCollapseURLs[0], browserURL) : {};

                            if (menu.url.includes(':')) {
                                menu.url = replaceFoundParams(extractedURLParams, menu.url);
                            }

                            if (matchCollapseURLs.length > 0) {
                                setGroup(group);
                                setMain(menu);
                                setItem(collapse);
                            }
                        }
                    }
                    return false;
                });
            }
        };

        const navItems = _.cloneDeep(navigation.items);
        navItems?.map((menu) => {
            if (menu.type && menu.type === 'group') {
                getCollapse(menu, menu);
            }
            return false;
        });
    }, [pathname, navigation]);

    // item separator
    const SeparatorIcon = separator;
    const separatorIcon = separator ? <SeparatorIcon stroke={1.5} size="16px" /> : <IconTallymark1 stroke={1.5} size="16px" />;

    let mainContent;
    let itemContent;
    let breadcrumbContent = <Typography />;
    let itemTitle = '';
    let CollapseIcon;
    let ItemIcon;

    // collapse item
    if (main && main.type === 'collapse') {
        CollapseIcon = main.icon ? main.icon : AccountTreeTwoToneIcon;
        mainContent = (
            <Typography component={Link} to={main.url ?? '#'} variant="subtitle1" sx={linkSX} id={`BREADCRUMB_${main.title.props.id}`}>
                {icons && <CollapseIcon style={iconStyle} />}
                {main.title}
            </Typography>
        );
    }

    // items
    if ((item && item.type === 'item') || (item?.type === 'group' && item?.url)) {
        itemTitle = item.title;

        ItemIcon = item.icon ? item.icon : AccountTreeTwoToneIcon;
        itemContent = (
            <Typography
                variant="subtitle1"
                sx={{
                    display: 'flex',
                    textDecoration: 'none',
                    alignContent: 'center',
                    alignItems: 'center',
                    color: 'grey.500'
                }}
            >
                {icons && <ItemIcon style={iconStyle} />}
                {itemTitle}
            </Typography>
        );

        // main
        if (item.breadcrumbs !== false) {
            breadcrumbContent = (
                <Card
                    sx={{
                        width: '100%',
                        // border: card === false ? 'none' : '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75
                        // background: card === false ? 'transparent' : theme.palette.background.default
                    }}
                    {...others}
                >
                    <Box sx={{ p: 2, pl: card === false ? 0 : 2 }}>
                        <Grid
                            container
                            direction={rightAlign ? 'row' : 'column'}
                            justifyContent={rightAlign ? 'space-between' : 'flex-start'}
                            alignItems={rightAlign ? 'center' : 'flex-start'}
                            spacing={1}
                        >
                            {title && !titleBottom && (
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item>
                                <MotionMuiBreadcrumbs
                                    layout="position"
                                    sx={{ '& .MuiBreadcrumbs-separator': { width: 16, ml: 1.25, mr: 1.25 } }}
                                    aria-label="breadcrumb"
                                    maxItems={maxItems || 8}
                                    separator={separatorIcon}
                                >
                                    <Typography
                                        component={Link}
                                        to={group.url ?? '/'}
                                        color="inherit"
                                        variant="subtitle1"
                                        sx={linkSX}
                                        aria-label="home"
                                    >
                                        {icons && <HomeTwoToneIcon sx={iconStyle} />}
                                        {icon && <HomeIcon sx={{ ...iconStyle, mr: 0 }} />}
                                        <Typography id={group.id} sx={{ ml: 1 }}>
                                            {group.title || ''}
                                        </Typography>
                                        {!icon && 'Dashboard'}
                                    </Typography>
                                    {mainContent}
                                    {itemContent}
                                </MotionMuiBreadcrumbs>
                            </Grid>
                            {title && titleBottom && (
                                <Grid item>
                                    <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                        {item.title}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                    {card === false && divider !== false && <Divider sx={{ borderColor: theme.palette.primary.main, mb: gridSpacing }} />}
                </Card>
            );
        }
    }

    return breadcrumbContent;
};

Breadcrumbs.propTypes = {
    card: PropTypes.bool,
    divider: PropTypes.bool,
    icon: PropTypes.bool,
    icons: PropTypes.bool,
    maxItems: PropTypes.number,
    navigation: PropTypes.object,
    rightAlign: PropTypes.bool,
    separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    title: PropTypes.bool,
    titleBottom: PropTypes.bool
};

export default Breadcrumbs;
