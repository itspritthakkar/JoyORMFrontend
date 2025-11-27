import React from 'react';
import { TaskProvider } from './contexts/TaskContext';
import TaskView from './TaskView';
import { CreateTaskProvider } from './contexts/CreateTaskContext';
import { TaskHelperProvider } from './contexts/TaskHelperContext';
import { EditTaskProvider } from './contexts/EditTaskContext';
import { OtherAttachmentsProvider } from './contexts/OtherAttachmentsContext';

const TaskManager = () => {
    return (
        <TaskProvider>
            <EditTaskProvider>
                <OtherAttachmentsProvider>
                    <TaskHelperProvider>
                        <CreateTaskProvider>
                            <TaskView />
                        </CreateTaskProvider>
                    </TaskHelperProvider>
                </OtherAttachmentsProvider>
            </EditTaskProvider>
        </TaskProvider>
    );
};

export default TaskManager;
