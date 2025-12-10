import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { useEditTaskContext } from './EditTaskContext';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';

export const TaskLogContext = createContext();

export const TaskLogProvider = ({ children }) => {
    const { currentTask } = useEditTaskContext();
    const taskItemId = currentTask?.data?.id;

    // const [isLoaded, setIsLoaded] = useState(false);
    const [taskLog, setTaskLog] = useState([]);

    const fetchTaskLog = useCallback(async () => {
        if (!taskItemId) return;
        try {
            // Get ClientData
            const { data } = await axiosExtended.get(`/TaskLog/Task/${taskItemId}`);

            // setIsLoaded(true);
            setTaskLog(data);
        } catch (err) {
            console.error(err);
            showAxiosErrorEnquebar(err);
        }
    }, [taskItemId]);

    // ------------------ LOAD ------------------
    useEffect(() => {
        if (taskItemId) {
            fetchTaskLog();
        }
    }, [fetchTaskLog, taskItemId]);

    // Prepend to task log
    const prependTaskLog = useCallback(
        (entry) => {
            setTaskLog((prevLogs) => [entry, ...prevLogs]);
        },
        [setTaskLog]
    );

    const value = useMemo(() => ({ taskLog, setTaskLog, fetchTaskLog, prependTaskLog }), [fetchTaskLog, prependTaskLog, taskLog]);

    return <TaskLogContext.Provider value={value}>{children}</TaskLogContext.Provider>;
};

TaskLogProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useTaskLogContext = () => {
    const context = useContext(TaskLogContext);
    if (!context) {
        throw new Error('useTaskLogContext must be used within TaskLogProvider');
    }
    return context;
};
