// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconSquareRoundedCheck, IconListDetails } from '@tabler/icons';

// constant
const icons = { IconSquareRoundedCheck, IconListDetails };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const coreManagement = {
    id: 'core',
    role: ['Manager'],
    title: <FormattedMessage id="core" />,
    type: 'group',
    children: [
        {
            id: 'approvals',
            title: <FormattedMessage id="approvals" />,
            icon: icons.IconSquareRoundedCheck,
            type: 'item',
            url: '/dashboard/approvals'
        },
        {
            id: 'task-form',
            title: <FormattedMessage id="task-form" />,
            icon: icons.IconListDetails,
            type: 'item',
            url: '/dashboard/task-form'
        }
    ]
};

export default coreManagement;
