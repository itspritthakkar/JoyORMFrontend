import PropTypes from 'prop-types';
import React, { createContext, useState, useCallback, useContext, useMemo } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // pagination / query state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('CreatedAt');
    const [sortOrder, setSortOrder] = useState('descending');

    const [shouldRefetch, setShouldRefetch] = useState(true);

    const addTask = useCallback((task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    }, []);

    const removeTask = useCallback((taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }, []);

    const updateTask = useCallback((taskId, updatedTask) => {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? updatedTask : task)));
    }, []);

    const value = useMemo(
        () => ({
            tasks,
            setTasks,
            loading,
            setLoading,
            error,
            setError,
            addTask,
            removeTask,
            updateTask,
            // pagination / query
            page,
            setPage,
            pageSize,
            setPageSize,
            total,
            setTotal,
            search,
            setSearch,
            sortBy,
            setSortBy,
            sortOrder,
            setSortOrder,
            shouldRefetch,
            setShouldRefetch
        }),
        [tasks, loading, error, addTask, removeTask, updateTask, page, pageSize, total, search, sortBy, sortOrder, shouldRefetch]
    );

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

TaskProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useTaskContext = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within TaskProvider');
    }
    return context;
};
