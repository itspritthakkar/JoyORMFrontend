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

const userBreadcrumb = {
    id: 'app',
    role: 'user',
    title: <FormattedMessage id="app" />,
    icon: icons.IconApps,
    type: 'group',
    url: '#',
    children: [
        {
            id: 'tasks',
            title: <FormattedMessage id="tasks" />,
            icon: icons.ListAltOutlinedIcon,
            type: 'item',
            url: '/app/tasks'
        }
    ]
};

export default userBreadcrumb;
