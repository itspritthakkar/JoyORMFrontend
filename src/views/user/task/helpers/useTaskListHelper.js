import useTaskNavigation from '../navigations/useTaskNavigation';

const useTaskListHelper = () => {
    const { navigateToTaskEdit } = useTaskNavigation();

    const selectTaskToEdit = (task) => {
        navigateToTaskEdit(task.id);
    };

    return { selectTaskToEdit };
};

export default useTaskListHelper;
