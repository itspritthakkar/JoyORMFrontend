import { useNavigate } from 'react-router-dom';

const useTaskNavigation = () => {
    const navigate = useNavigate();

    const navigateToTaskEdit = (taskId) => {
        navigate(`/dashboard/tasks/${taskId}`);
    };
    return { navigateToTaskEdit };
};

export default useTaskNavigation;
