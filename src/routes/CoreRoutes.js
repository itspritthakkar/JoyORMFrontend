import { lazy } from 'react';

// project imports
import AuthGuard from 'utils/route-guard/AuthGuard';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import RoleGuard from 'utils/route-guard/RoleGuard';

// main routing import
const ApprovalsPage = Loadable(lazy(() => import('views/pages/manager/approvals/index')));
const TaskFormPage = Loadable(lazy(() => import('views/pages/manager/task-form/index')));
const TasksPage = Loadable(lazy(() => import('views/pages/manager/task/index')));

// ==============================|| MAIN ROUTING ||============================== //

const CoreRoutes = {
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
            element: <ApprovalsPage />
        },
        {
            path: '/dashboard/approvals',
            element: <ApprovalsPage />
        },
        {
            path: '/dashboard/task-form',
            element: <TaskFormPage />
        },
        {
            path: '/dashboard/tasks/:id?',
            element: <TasksPage />
        }
    ]
};

export default CoreRoutes;
