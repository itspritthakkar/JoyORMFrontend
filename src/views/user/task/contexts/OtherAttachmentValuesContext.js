import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { useEditTaskContext } from './EditTaskContext';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';

export const OtherAttachmentValuesContext = createContext();

export const OtherAttachmentValuesProvider = ({ children }) => {
    const { currentTask } = useEditTaskContext();
    const taskItemId = currentTask?.data?.id;

    const [loadingValues, setLoadingValues] = useState(true);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectedItemsLocal, setSelectedItemsLocal] = useState(new Set());

    // -------------------------------------
    //   FETCH SELECTED ATTACHMENTS FOR TASK
    // -------------------------------------
    useEffect(() => {
        if (!taskItemId) return;

        const fetchValues = async () => {
            try {
                setLoadingValues(true);
                const { data } = await axiosExtended.get(`/OtherAttachmentValue/${taskItemId}`);

                // data.attachmentIds is an array → convert to Set
                if (Array.isArray(data?.attachmentIds)) {
                    setSelectedItems(new Set(data.attachmentIds));
                    setSelectedItemsLocal(new Set(data.attachmentIds));
                }
            } catch (err) {
                showAxiosErrorEnquebar(err);
            } finally {
                setLoadingValues(false);
            }
        };

        fetchValues();
    }, [taskItemId]);

    // ----------------------------
    //   SAVE (UPSERT)
    // ----------------------------
    const handleSave = useCallback(async () => {
        if (!taskItemId) return;

        const payload = {
            taskItemId: taskItemId,
            attachmentIds: Array.from(selectedItemsLocal)
        };

        try {
            const { data } = await axiosExtended.post('/OtherAttachmentValue', payload);

            setSelectedItems(data.attachmentIds);
            showAxiosSuccessEnquebar('Saved successfully!');
        } catch (err) {
            showAxiosErrorEnquebar(err);
        }
    }, [selectedItemsLocal, taskItemId]);

    const value = useMemo(
        () => ({
            loadingValues,
            setLoadingValues,
            selectedItems,
            setSelectedItems,
            selectedItemsLocal,
            setSelectedItemsLocal,
            handleSave
        }),
        [handleSave, loadingValues, selectedItems, selectedItemsLocal]
    );

    return <OtherAttachmentValuesContext.Provider value={value}>{children}</OtherAttachmentValuesContext.Provider>;
};

OtherAttachmentValuesProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useOtherAttachmentValuesContext = () => {
    const context = useContext(OtherAttachmentValuesContext);
    if (!context) {
        throw new Error('useOtherAttachmentValuesContext must be used within OtherAttachmentValuesProvider');
    }
    return context;
};
