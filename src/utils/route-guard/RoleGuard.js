import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const RoleGuard = ({ allowedRoles, children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role && !allowedRoles.includes(user.role)) {
            return navigate('login', { replace: true });
        }
    }, [allowedRoles, children, navigate, user?.role]);

    return allowedRoles.includes(user?.role) ? children : null;
};

RoleGuard.propTypes = {
    allowedRoles: PropTypes.array,
    children: PropTypes.node
};

export default RoleGuard;
