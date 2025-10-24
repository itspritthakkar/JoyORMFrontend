// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconHome } from '@tabler/icons';

// constant
const icons = { IconHome };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'management',
    role: ['Manager'],
    // title: <FormattedMessage id="management" />,
    // caption: <FormattedMessage id="pages-caption" />,
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: <FormattedMessage id="dashboard" />,
            icon: icons.IconHome,
            type: 'item',
            url: '/dashboard'
        }
    ]
};

export default pages;
