// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSitemap } from '@tabler/icons';

// constant
const icons = { IconSitemap };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const userCore = {
    id: 'user-core',
    role: ['User'],
    title: <FormattedMessage id="core" />,
    type: 'group',
    children: [
        {
            id: 'tasks',
            title: <FormattedMessage id="tasks" />,
            icon: icons.IconSitemap,
            type: 'item',
            url: '/dashboard/tasks'
        }
    ]
};

export default userCore;
