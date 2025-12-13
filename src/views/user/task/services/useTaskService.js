import { showAxiosErrorEnquebar } from 'utils/commons/functions';
import useTaskRepository from '../repositories/useTaskRepository';
import { useCallback } from 'react';
import { useTaskContext } from '../contexts/TaskContext';

const useTaskService = () => {
    const { setShouldRefetch } = useTaskContext();
    const { getTasks, getTaskById, createTask, updateTask, deleteTask } = useTaskRepository();

    const fetchTasks = useCallback(
        async (params) => {
            try {
                const data = await getTasks(params);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar('Failed to fetch tasks: ', error);
            }
        },
        [getTasks]
    );

    const fetchTaskById = useCallback(
        async (taskId) => {
            try {
                const data = await getTaskById(taskId);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar('Failed to fetch tasks: ', error);
            }
        },
        [getTaskById]
    );

    const createNewTask = useCallback(
        async (taskData) => {
            try {
                const data = await createTask(taskData);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar('Failed to create task: ', error);
            }
        },
        [createTask]
    );

    const updateExistingTask = useCallback(
        async (taskData) => {
            try {
                const data = await updateTask(taskData);
                setShouldRefetch(true);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar('Failed to update task: ', error);
            }
        },
        [updateTask, setShouldRefetch]
    );

    const deleteExistingTask = useCallback(
        async (taskId) => {
            try {
                const data = await deleteTask(taskId);
                setShouldRefetch(true);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar('Failed to delete task: ', error);
            }
        },
        [deleteTask, setShouldRefetch]
    );

    return { fetchTasks, fetchTaskById, createNewTask, updateExistingTask, deleteExistingTask };
};

export default useTaskService;
