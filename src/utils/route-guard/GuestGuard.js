import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'config';
import { VIEWER_DASHBOARD_PATH } from 'config';
import { USER_DASHBOARD_PATH } from 'config';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            if (user.role === 'Manager') {
                navigate(DASHBOARD_PATH, { replace: true });
            } else if (user.role === 'ManagerView') {
                navigate(VIEWER_DASHBOARD_PATH, { replace: true });
            } else {
                navigate(USER_DASHBOARD_PATH, { replace: true });
            }
        }
    }, [isLoggedIn, navigate, user?.isMobileVerified, user?.role]);

    return children;
};

GuestGuard.propTypes = {
    children: PropTypes.node
};

export default GuestGuard;
