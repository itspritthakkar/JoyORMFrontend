// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc,
    IconBrandChrome
} from '@tabler/icons';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import StreamOutlinedIcon from '@mui/icons-material/StreamOutlined';
// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc,
    IconBrandChrome,
    ListAltOutlinedIcon,
    StreamOutlinedIcon
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'dashboard',
    role: 'user',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconApps,
    type: 'group',
    url: '/dashboard',
    children: [
        {
            id: 'analytics',
            title: <FormattedMessage id="analytics" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard'
        },
        {
            id: 'projects',
            title: <FormattedMessage id="projects" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/projects'
        },
        {
            id: 'wards',
            title: <FormattedMessage id="wards" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/wards'
        },
        {
            id: 'survey',
            title: <FormattedMessage id="survey" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: ['/dashboard/survey', '/dashboard/survey/map-view']
        },
        {
            id: 'users',
            title: <FormattedMessage id="users" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/users'
        },
        {
            id: 'reports',
            title: <FormattedMessage id="reports" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/reports'
        },
        {
            id: 'account',
            title: <FormattedMessage id="account" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/manager/account'
        }
    ]
};

export default pages;
