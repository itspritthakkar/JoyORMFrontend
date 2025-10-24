// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconAward, IconBuildingCommunity, IconCheckupList, IconDatabase, IconUser } from '@tabler/icons';

// constant
const icons = { IconBuildingCommunity, IconAward, IconDatabase, IconUser, IconCheckupList };

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const userSurvey = {
    id: 'user-survey',
    role: ['User'],
    title: <FormattedMessage id="user-survey" />,
    type: 'group',
    children: [
        {
            id: 'survey',
            title: <FormattedMessage id="survey" />,
            icon: icons.IconDatabase,
            type: 'item',
            url: '/app/survey'
        }
    ]
};

export default userSurvey;
