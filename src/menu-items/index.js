import pages from './pages';
import projectManagement from './project-management';
import mainBreadcrumb from './breadcrumb/MainBreadcrumb';
import userSurvey from './user-survey';
import viewerManagement from './viewer-management';
import coreManagement from './core-management';

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
    items: [pages, viewerManagement, projectManagement, coreManagement, userSurvey]
};

export const breadcrumbItems = {
    items: [mainBreadcrumb]
};
