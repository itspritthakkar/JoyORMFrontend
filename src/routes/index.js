import { useRoutes } from 'react-router-dom';

// routes
import AuthenticationRotes from './AuthenticationRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import UserRoutes from './UserRoutes';
import GuestRoutes from './GuestRoutes';
// import SharedRoutes from './SharedRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([
        LoginRoutes,
        AuthenticationRotes,
        MainRoutes,
        UserRoutes,
        // SharedRoutes
        GuestRoutes
    ]);
}
