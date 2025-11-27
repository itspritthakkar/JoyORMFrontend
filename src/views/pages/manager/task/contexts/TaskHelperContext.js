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

    const [users, setUsers] = useState({
        isLoaded: false,
        isError: false,
        data: []
    });

    const [selectedUser, setSelectedUser] = useState(null);

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setUsers({ isLoaded: false, isError: false, data: [] });
                const { data } = await axiosExtended.get('/User?role=User&enablePagination=false');
                const { users } = data;
                if (Array.isArray(users) && users.length > 0) {
                    setSelectedUser(users[0]);
                }
                setUsers({ isLoaded: true, isError: false, data: Array.isArray(users) ? users : [] });
            } catch (err) {
                setUsers({ isLoaded: true, isError: true, data: [] });
            } finally {
                setUsers((prev) => ({ ...prev, isLoaded: true }));
            }
        };

        fetchUsers();
    }, []);

    const value = useMemo(
        () => ({ applicationTypes, setApplicationTypes, users, setUsers, selectedUser, setSelectedUser }),
        [applicationTypes, users, selectedUser]
    );

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
