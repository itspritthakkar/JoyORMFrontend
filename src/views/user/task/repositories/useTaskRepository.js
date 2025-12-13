import { useCallback } from 'react';
import axiosExtended from 'utils/axios';
import { appendSearchParams } from 'utils/commons/functions';

const useTaskRepository = () => {
    const getTasks = useCallback(async ({ page = 1, pageSize = 10, search = '', sortBy = 'CreatedAt', sortOrder = 'descending' }) => {
        let url = '/TaskItem/Paged';
        url = appendSearchParams(url, {
            page,
            pageSize,
            search,
            sortBy,
            sortOrder
        });
        const { data } = await axiosExtended.get(url);
        return data;
    }, []);

    const getTaskById = useCallback(async (taskId) => {
        const { data } = await axiosExtended.get(`/TaskItem/${taskId}`);
        return data;
    }, []);

    const createTask = useCallback(async ({ nameOfApplicant, passportNo, applicationTypeId, contactNo, emailId, assignedByUserId }) => {
        const config = {
            url: '/TaskItem',
            method: 'post',
            data: {
                nameOfApplicant,
                passportNo,
                applicationTypeId,
                contactNo,
                emailId,
                assignedByUserId
            }
        };
        const { data } = await axiosExtended.request(config);
        return data;
    }, []);

    const updateTask = useCallback(async ({ id, nameOfApplicant, passportNo, applicationTypeId, contactNo, emailId, assignedByUserId }) => {
        const config = {
            url: `/TaskItem/${id}`,
            method: 'put',
            data: {
                nameOfApplicant,
                passportNo,
                applicationTypeId,
                contactNo,
                emailId,
                assignedByUserId
            }
        };
        const { data } = await axiosExtended.request(config);
        return data;
    }, []);

    const deleteTask = useCallback(async (taskId) => {
        const { data } = await axiosExtended.delete(`/TaskItem/${taskId}`);
        return data;
    }, []);

    return { getTasks, getTaskById, createTask, updateTask, deleteTask };
};

export default useTaskRepository;
