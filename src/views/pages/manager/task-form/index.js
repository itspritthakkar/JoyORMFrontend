// ...existing code...
import MainCard from 'ui-component/cards/MainCard';
import { Divider } from '@mui/material';
import StaticFieldsForm from './StaticFieldsForm';
import DyanamicFieldsForm from './DyanamicFieldsForm';

const TaskForm = () => {
    return (
        <MainCard sx={{ minHeight: '83vh' }}>
            <StaticFieldsForm />

            <Divider sx={{ my: 2 }} />

            <DyanamicFieldsForm />
        </MainCard>
    );
};

export default TaskForm;
