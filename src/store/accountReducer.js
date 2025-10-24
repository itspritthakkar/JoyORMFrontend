// action - state management
import { LOGIN, LOGOUT, REGISTER, TWO_FACTOR_PENDING } from './actions';

// ==============================|| ACCOUNT REDUCER ||============================== //

const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    isTwoFactorPending: false,
    twoFactorDetails: {}
};

// eslint-disable-next-line
const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER: {
            const { user } = action.payload;
            return {
                ...state,
                user
            };
        }
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                isInitialized: true,
                user,
                isTwoFactorPending: false,
                twoFactorDetails: {}
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isInitialized: true,
                isLoggedIn: false,
                user: null,
                isTwoFactorPending: false,
                twoFactorDetails: {}
            };
        }
        case TWO_FACTOR_PENDING: {
            const { twoFactorDetails } = action.payload;
            return {
                ...state,
                isTwoFactorPending: true,
                twoFactorDetails
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
