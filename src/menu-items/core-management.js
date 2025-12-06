// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSquareRoundedCheck, IconListDetails, IconSitemap } from '@tabler/icons';

// constant
const icons = { IconSquareRoundedCheck, IconListDetails, IconSitemap };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const coreManagement = {
    id: 'core',
    role: ['Manager'],
    title: <FormattedMessage id="core" />,
    type: 'group',
    children: [
        {
            id: 'tasks',
            title: <FormattedMessage id="tasks" />,
            icon: icons.IconSitemap,
            type: 'item',
            url: '/dashboard/tasks'
        },
        {
            id: 'approvals',
            title: <FormattedMessage id="approvals" />,
            icon: icons.IconSquareRoundedCheck,
            type: 'item',
            url: '/dashboard/approvals'
        },
        {
            id: 'form-builder',
            title: <FormattedMessage id="form-builder" />,
            icon: icons.IconListDetails,
            type: 'item',
            url: '/dashboard/form-builder'
        }
    ]
};

export default coreManagement;
