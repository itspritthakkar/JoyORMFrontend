import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { useEditTaskContext } from './EditTaskContext';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import { useTaskLogContext } from './TaskLogContext';

export const ClientDataContext = createContext();

export const ClientDataProvider = ({ children }) => {
    const { currentTask } = useEditTaskContext();
    const taskItemId = currentTask?.data?.id;

    const { fetchTaskLog, prependTaskLog } = useTaskLogContext();

    const [clientDataFields, setClientDataFields] = useState([]);
    const [values, setValues] = useState({});
    const [isMissing, setIsMissing] = useState({});
    const [isAvailable, setIsAvailable] = useState({});
    const [valuesResponse, setValuesResponse] = useState({});

    const [isSaving, setIsSaving] = useState(false);
    const [isCreatingSocialLog, setIsCreatingSocialLog] = useState(null);

    // ------------------ LOAD ------------------
    useEffect(() => {
        if (!taskItemId) return;

        const load = async () => {
            try {
                // Get ClientData
                const { data } = await axiosExtended.get('/ClientData');
                const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
                setClientDataFields(sorted);

                // Get ClientDataValue for task
                const res = await axiosExtended.get(`/ClientDataValue/${taskItemId}`);

                setValuesResponse(res.data);

                if (res.data?.fields) {
                    const missingObj = {};
                    const availObj = {};
                    const valObj = {};

                    res.data.fields.forEach((f) => {
                        missingObj[f.clientDataId] = f.isMissing ?? null;
                        availObj[f.clientDataId] = f.isAvailable ?? null;
                        valObj[f.clientDataId] = f.value ?? '';
                    });

                    setIsMissing(missingObj);
                    setIsAvailable(availObj);
                    setValues(valObj);
                }
            } catch (err) {
                console.error(err);
                showAxiosErrorEnquebar(err);
            }
        };

        load();
    }, [taskItemId]);

    // ------------------ BUILD PAYLOAD ------------------
    const buildPayload = useCallback(() => {
        return {
            taskItemId: currentTask.data.id,
            fields: clientDataFields.map((f) => ({
                clientDataId: f.id,
                isMissing: isMissing[f.id] ?? null,
                isAvailable: isAvailable[f.id] ?? null,
                value: values[f.id] ?? null
            }))
        };
    }, [clientDataFields, currentTask.data.id, isAvailable, isMissing, values]);

    // ------------------ SAVE ------------------
    const handleSave = useCallback(async () => {
        setIsSaving(true);
        try {
            const res = await axiosExtended.post('/ClientDataValue', buildPayload());
            setValuesResponse(res.data);
            showAxiosSuccessEnquebar('Saved successfully!');
            fetchTaskLog();
        } catch (err) {
            console.error(err);
            showAxiosErrorEnquebar(err);
        } finally {
            setIsSaving(false);
        }
    }, [buildPayload, fetchTaskLog]);

    const createSocialFollowupLog = useCallback(
        async (channel) => {
            setIsCreatingSocialLog(channel);
            try {
                const { data } = await axiosExtended.post(`/TaskLog`, {
                    taskItemId: taskItemId,
                    clientDataId: null,
                    clientDataValueId: null,
                    type: channel
                });

                data.createdAt =
                    data.createdAt && data.createdAt.endsWith('Z')
                        ? data.createdAt.substring(0, data.createdAt.length - 1)
                        : data.createdAt;

                data.updatedAt =
                    data.updatedAt && data.updatedAt.endsWith('Z')
                        ? data.updatedAt.substring(0, data.updatedAt.length - 1)
                        : data.updatedAt;

                prependTaskLog(data);

                showAxiosSuccessEnquebar('Social follow-up log created successfully!');
            } catch (err) {
                console.error(err);
                showAxiosErrorEnquebar(err);
            } finally {
                setIsCreatingSocialLog(null);
            }
        },
        [taskItemId, prependTaskLog]
    );

    const value = useMemo(
        () => ({
            clientDataFields,
            setClientDataFields,
            values,
            setValues,
            isMissing,
            setIsMissing,
            isAvailable,
            setIsAvailable,
            valuesResponse,
            handleSave,
            isSaving,
            setIsSaving,
            createSocialFollowupLog,
            isCreatingSocialLog
        }),
        [
            clientDataFields,
            createSocialFollowupLog,
            handleSave,
            isAvailable,
            isMissing,
            isSaving,
            values,
            valuesResponse,
            isCreatingSocialLog
        ]
    );

    return <ClientDataContext.Provider value={value}>{children}</ClientDataContext.Provider>;
};

ClientDataProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useClientDataContext = () => {
    const context = useContext(ClientDataContext);
    if (!context) {
        throw new Error('useClientDataContext must be used within ClientDataProvider');
    }
    return context;
};
