import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import RoleGuard from 'utils/route-guard/RoleGuard';
// import GuestGuard from 'utils/route-guard/GuestGuard';

// sample page routing
const TasksPage = Loadable(lazy(() => import('views/user/task/index')));

// ==============================|| MAIN ROUTING ||============================== //

const UserRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            {/* <GuestGuard> */}
            <RoleGuard allowedRoles={['User']}>
                <MainLayout />
            </RoleGuard>
            {/* </GuestGuard> */}
        </AuthGuard>
    ),
    children: [
        {
            path: '/app/tasks/:id?',
            element: <TasksPage />
        }
    ]
};

export default UserRoutes;
