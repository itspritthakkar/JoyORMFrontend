import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT, TWO_FACTOR_PENDING } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios, { setTokenHeader } from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import axiosExtended from 'utils/axios';
import { detect } from 'detect-browser';

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

export const verifyToken = (serviceToken) => {
    try {
        const decoded = jwtDecode(serviceToken);
        if (decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return decoded.exp > currentTime;
        }
        return false; // Token has no expiration
    } catch (error) {
        console.error(error);
        // Error decoding token or token is not in JWT format
        return false;
    }
};

// function to simulate session storage
const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
    } else {
        localStorage.removeItem('serviceToken');
    }
    setTokenHeader();
};

// function to decode to JWT token
const decodeToken = (token) => {
    const decodedData = jwtDecode(token);

    const { sub, userId, role } = decodedData;

    const user = { userId, email: sub, role };

    if (!userId || !sub || !role) {
        throw new Error('User token invalid');
    }

    return { decodedData, user };
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

const browser = detect();

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    let pollingTimer = null;

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    const response = await axiosExtended.get(`/User/me`);
                    const { id, email, mobile, roleName, roleIdentifier, firstName, lastName } = response.data;
                    const user = {
                        id,
                        email,
                        mobile,
                        role: roleIdentifier,
                        roleName,
                        firstName,
                        lastName
                    };
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const startTwoFactorPolling = (twoFactorId, intervalMs = 10000) => {
        // clear any existing
        if (pollingTimer) {
            clearInterval(pollingTimer);
            pollingTimer = null;
        }

        const checkStatus = async () => {
            try {
                // adjust endpoint as per backend implementation
                const res = await axiosExtended.get(`/TwoFactorRequest/Status/${twoFactorId}`);
                const data = res.data;
                // expected shape: { Status, User, Token }
                if (data && data.status.toLowerCase() === 'approved') {
                    // stop polling
                    if (pollingTimer) {
                        clearInterval(pollingTimer);
                        pollingTimer = null;
                    }
                    // attempt to login with provided user and token
                    attemptTokenLogin(data.user, data.token);
                }

                console.log(data.status);

                if (data && data.status && (data.status.toLowerCase() === 'declined' || data.status.toLowerCase() === 'expired')) {
                    // stop polling
                    if (pollingTimer) {
                        clearInterval(pollingTimer);
                        pollingTimer = null;
                    }

                    showAxiosErrorEnquebar(new Error(`Two-factor request ${data.status.toLowerCase()}.`));

                    // dispatch logout or other handling as needed
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                // ignore transient errors; optionally log
                console.error('Two-factor status check failed', err);
            }
        };

        // immediate check then interval
        checkStatus();
        pollingTimer = setInterval(checkStatus, intervalMs);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/Auth/login', {
                email,
                password,
                deviceName: navigator.userAgentData?.platform || navigator.platform,
                operatingSystem: browser.os || 'Unknown OS',
                browser: browser.name || 'Unknown Browser'
            });
            const { user, token } = response.data;

            if (!token) {
                const { twoFactor } = response.data;

                dispatch({
                    type: TWO_FACTOR_PENDING,
                    payload: {
                        twoFactorDetails: twoFactor
                    }
                });
                // start polling for two-factor approval
                if (twoFactor && twoFactor.id) {
                    startTwoFactorPolling(twoFactor.id);
                }
                return;
            }

            attemptTokenLogin(user, token);
        } catch (error) {
            showAxiosErrorEnquebar(error);
        }
    };

    const attemptTokenLogin = (user, token) => {
        decodeToken(token);
        setSession(token);

        const userToStore = {
            id: user.id,
            email: user.email,
            mobile: user.mobile,
            role: user.roleIdentifier,
            roleName: user.roleName,
            firstName: user.firstName,
            lastName: user.lastName
        };

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user: userToStore
            }
        });
    };

    const register = async ({ user, token }) => {
        decodeToken(token);
        setSession(token);

        const userToStore = {
            id: user.id,
            email: user.email,
            mobile: user.mobile,
            role: user.roleIdentifier,
            roleName: user.roleName,
            firstName: user.firstName,
            lastName: user.lastName
        };

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user: userToStore
            }
        });
    };

    const logout = async () => {
        setSession(null);
        dispatch({ type: LOGOUT });
        location.reload();
    };

    const resetPassword = async (email) => {
        console.log(email);
    };

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
