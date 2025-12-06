// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSquareRoundedCheck, IconListDetails, IconSitemap, IconPercentage } from '@tabler/icons';

// constant
const icons = { IconSquareRoundedCheck, IconListDetails, IconSitemap, IconPercentage };

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
        },
        {
            id: 'assigned-tasks',
            title: <FormattedMessage id="assigned-tasks" />,
            icon: icons.IconPercentage,
            type: 'item',
            url: '/dashboard/assigned-tasks'
        }
    ]
};

export default coreManagement;
