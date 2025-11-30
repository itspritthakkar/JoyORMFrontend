import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

export const CreateTaskContext = createContext();

export const CreateTaskProvider = ({ children }) => {
    const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpenCreateTaskDialog = useCallback(() => {
        setIsCreateTaskDialogOpen(true);
    }, []);

    const handleCloseCreateTaskDialog = useCallback(() => {
        setIsCreateTaskDialogOpen(false);
    }, []);

    const value = useMemo(
        () => ({
            isCreateTaskDialogOpen,
            setIsCreateTaskDialogOpen,
            isSaving,
            setIsSaving,
            handleOpenCreateTaskDialog,
            handleCloseCreateTaskDialog
        }),
        [isCreateTaskDialogOpen, isSaving, handleOpenCreateTaskDialog, handleCloseCreateTaskDialog]
    );

    return <CreateTaskContext.Provider value={value}>{children}</CreateTaskContext.Provider>;
};

CreateTaskProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useCreateTaskContext = () => {
    const context = useContext(CreateTaskContext);
    if (!context) {
        throw new Error('useCreateTaskContext must be used within CreateTaskProvider');
    }
    return context;
};
