import { showAxiosErrorEnquebar, showAxiosSuccessEnquebar } from 'utils/commons/functions';
import useTaskRepository from '../repositories/useTaskRepository';
import { useCallback } from 'react';
import { useTaskContext } from '../contexts/TaskContext';

const useTaskService = () => {
    const { setShouldRefetch } = useTaskContext();
    const { getTasks, getTaskById, createTask, updateTask, updateTaskStatusComplete, deleteTask } = useTaskRepository();

    const fetchTasks = useCallback(
        async (params) => {
            try {
                const data = await getTasks(params);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar(error);
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
                showAxiosErrorEnquebar(error);
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
                showAxiosErrorEnquebar(error);
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
                showAxiosErrorEnquebar(error);
            }
        },
        [updateTask, setShouldRefetch]
    );

    const markTaskAsCompleted = useCallback(
        async (taskId) => {
            try {
                const data = await updateTaskStatusComplete(taskId);
                setShouldRefetch(true);
                showAxiosSuccessEnquebar('Task Marked as Completed!');
                return data;
            } catch (error) {
                showAxiosErrorEnquebar(error);
            }
        },
        [updateTaskStatusComplete, setShouldRefetch]
    );

    const deleteExistingTask = useCallback(
        async (taskId) => {
            try {
                const data = await deleteTask(taskId);
                setShouldRefetch(true);
                return data;
            } catch (error) {
                showAxiosErrorEnquebar(error);
            }
        },
        [deleteTask, setShouldRefetch]
    );

    return { fetchTasks, fetchTaskById, createNewTask, updateExistingTask, markTaskAsCompleted, deleteExistingTask };
};

export default useTaskService;
