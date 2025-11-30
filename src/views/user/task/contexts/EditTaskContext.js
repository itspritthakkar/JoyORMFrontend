import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

export const EditTaskContext = createContext();

const initialCurrentTaskState = { isLoaded: false, isError: false, data: {} };
export const EditTaskProvider = ({ children }) => {
    const [currentTask, setCurrentTask] = useState(initialCurrentTaskState);

    const handleResetCurrentTask = useCallback(() => setCurrentTask(initialCurrentTaskState), []);

    const value = useMemo(
        () => ({
            currentTask,
            setCurrentTask,
            handleResetCurrentTask
        }),
        [currentTask, handleResetCurrentTask]
    );

    return <EditTaskContext.Provider value={value}>{children}</EditTaskContext.Provider>;
};

EditTaskProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useEditTaskContext = () => {
    const context = useContext(EditTaskContext);
    if (!context) {
        throw new Error('useEditTaskContext must be used within EditTaskProvider');
    }
    return context;
};
