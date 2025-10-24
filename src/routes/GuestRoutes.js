import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';

// shared page routing
const SurveyViewPage = Loadable(lazy(() => import('views/user/survey/view/index')));

// ==============================|| MAIN ROUTING ||============================== //

const GuestRoutes = {
    path: '/',
    children: [
        {
            path: '/app/survey/view/:recordId',
            element: <SurveyViewPage />
        }
    ]
};

export default GuestRoutes;
