// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconAward, Icon2fa, IconCheckupList, IconDatabase, IconUser } from '@tabler/icons';

// constant
const icons = { Icon2fa, IconAward, IconDatabase, IconUser, IconCheckupList };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const projectManagement = {
    id: 'two-factor-requests',
    role: ['Manager'],
    title: <FormattedMessage id="two-factor-requests" />,
    type: 'group',
    children: [
        {
            id: 'two-factor-requests',
            title: <FormattedMessage id="two-factor-requests" />,
            icon: icons.Icon2fa,
            type: 'item',
            url: '/dashboard/two-factor-requests'
        },
        {
            id: 'users',
            title: <FormattedMessage id="user-management" />,
            icon: icons.IconUser,
            type: 'item',
            url: '/dashboard/users'
        }
    ]
};

export default projectManagement;
