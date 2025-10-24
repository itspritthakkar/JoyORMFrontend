import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import RoleGuard from 'utils/route-guard/RoleGuard';

// main routing import
const TwoFactorRequestPage = Loadable(lazy(() => import('views/pages/manager/two-factor-request/index')));
const ManagerAccountPage = Loadable(lazy(() => import('views/pages/manager/ManagerAccount')));
const UsersPage = Loadable(lazy(() => import('views/pages/manager/user')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <RoleGuard allowedRoles={['Manager']}>
                <MainLayout />
            </RoleGuard>
        </AuthGuard>
    ),
    children: [
        {
            path: '/',
            element: <TwoFactorRequestPage />
        },
        {
            path: '/dashboard/two-factor-requests',
            element: <TwoFactorRequestPage />
        },
        {
            path: '/manager/account',
            element: <ManagerAccountPage />
        },
        {
            path: '/dashboard/users',
            element: <UsersPage />
        }
    ]
};

export default MainRoutes;
