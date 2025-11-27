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
            id: 'two-factor-requests',
            title: <FormattedMessage id="two-factor-requests" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/two-factor-requests'
        },
        {
            id: 'approvals',
            title: <FormattedMessage id="approvals" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/approvals'
        },
        {
            id: 'task-form',
            title: <FormattedMessage id="task-form" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/task-form'
        },
        {
            id: 'tasks',
            title: <FormattedMessage id="tasks" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/tasks'
        },
        {
            id: 'users',
            title: <FormattedMessage id="users" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/dashboard/users'
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
