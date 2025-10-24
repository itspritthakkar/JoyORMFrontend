import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import RoleGuard from 'utils/route-guard/RoleGuard';

// shared page routing
const SurveyDetailsPage = Loadable(lazy(() => import('views/user/survey/details')));

// ==============================|| MAIN ROUTING ||============================== //

const SharedRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <RoleGuard allowedRoles={['Manager', 'ManagerView', 'User']}>
                <MainLayout />
            </RoleGuard>
        </AuthGuard>
    ),
    children: [
        {
            path: '/app/survey/details/:recordId/:stepId',
            element: <SurveyDetailsPage />
        }
    ]
};

export default SharedRoutes;
