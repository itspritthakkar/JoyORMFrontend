import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { useEditTaskContext } from './EditTaskContext';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';

export const OtherAttachmentsContext = createContext();

export const OtherAttachmentsProvider = ({ children }) => {
    const { currentTask } = useEditTaskContext();
    const taskItemId = currentTask?.data?.id;

    const [loadingItems, setLoadingItems] = useState(true);
    const [loadingValues, setLoadingValues] = useState(true);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [selectedItemsLocal, setSelectedItemsLocal] = useState(new Set());

    // ----------------------------
    //   FETCH ALL OTHER ATTACHMENTS
    // ----------------------------
    useEffect(() => {
        const fetchAttachments = async () => {
            try {
                setLoadingItems(true);
                const { data } = await axiosExtended.get('/OtherAttachment');
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                showAxiosErrorEnquebar(err);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchAttachments();
    }, []);

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
            loadingItems,
            setLoadingItems,
            loadingValues,
            setLoadingValues,
            items,
            setItems,
            selectedItems,
            setSelectedItems,
            selectedItemsLocal,
            setSelectedItemsLocal,
            handleSave
        }),
        [handleSave, items, loadingItems, loadingValues, selectedItems, selectedItemsLocal]
    );

    return <OtherAttachmentsContext.Provider value={value}>{children}</OtherAttachmentsContext.Provider>;
};

OtherAttachmentsProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useOtherAttachmentsContext = () => {
    const context = useContext(OtherAttachmentsContext);
    if (!context) {
        throw new Error('useOtherAttachmentsContext must be used within OtherAttachmentsProvider');
    }
    return context;
};
