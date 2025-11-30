import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosExtended from 'utils/axios';

export const TaskHelperContext = createContext();

export const TaskHelperProvider = ({ children }) => {
    const [applicationTypes, setApplicationTypes] = useState({
        isLoaded: false,
        isError: false,
        data: []
    });

    useEffect(() => {
        const fetchApplicationTypes = async () => {
            try {
                setApplicationTypes({ isLoaded: false, isError: false, data: [] });
                const { data } = await axiosExtended.get('/ApplicationType');
                setApplicationTypes({ isLoaded: true, isError: false, data: Array.isArray(data) ? data : [] });
            } catch (err) {
                setApplicationTypes({ isLoaded: true, isError: true, data: [] });
            } finally {
                setApplicationTypes((prev) => ({ ...prev, isLoaded: true }));
            }
        };

        fetchApplicationTypes();
    }, []);

    const value = useMemo(() => ({ applicationTypes, setApplicationTypes }), [applicationTypes]);

    return <TaskHelperContext.Provider value={value}>{children}</TaskHelperContext.Provider>;
};

TaskHelperProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useTaskHelperContext = () => {
    const context = useContext(TaskHelperContext);
    if (!context) {
        throw new Error('useTaskHelperContext must be used within TaskHelperProvider');
    }
    return context;
};
