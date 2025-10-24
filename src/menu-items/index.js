import pages from './pages';
import projectManagement from './project-management';
import mainBreadcrumb from './breadcrumb/MainBreadcrumb';
import userSurvey from './user-survey';
import viewerManagement from './viewer-management';

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
    items: [pages, viewerManagement, projectManagement, userSurvey]
};

export const breadcrumbItems = {
    items: [mainBreadcrumb]
};
