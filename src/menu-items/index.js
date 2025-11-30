import pages from './pages';
import projectManagement from './project-management';
import mainBreadcrumb from './breadcrumb/MainBreadcrumb';
import userCore from './user-core';
import viewerManagement from './viewer-management';
import coreManagement from './core-management';
import userBreadcrumb from './breadcrumb/UserBreadcrumb';

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
    items: [pages, viewerManagement, projectManagement, coreManagement, userCore]
};

export const breadcrumbItems = {
    items: [mainBreadcrumb, userBreadcrumb]
};
