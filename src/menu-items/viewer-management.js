// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconAward, IconBuildingCommunity, IconCheckupList, IconDatabase, IconUser } from '@tabler/icons';

// constant
const icons = { IconBuildingCommunity, IconAward, IconDatabase, IconUser, IconCheckupList };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const viewerManagement = {
    id: 'viewer-management',
    role: ['ManagerView'],
    // title: <FormattedMessage id="viewer-management" />,
    type: 'group',
    children: [
        {
            id: 'survey',
            title: <FormattedMessage id="survey" />,
            icon: icons.IconDatabase,
            type: 'item',
            url: '/dashboard/survey'
        }
    ]
};

export default viewerManagement;
