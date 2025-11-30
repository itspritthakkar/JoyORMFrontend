import React from 'react';
import { TaskProvider } from './contexts/TaskContext';
import TaskView from './TaskView';
import { CreateTaskProvider } from './contexts/CreateTaskContext';
import { TaskHelperProvider } from './contexts/TaskHelperContext';
import { EditTaskProvider } from './contexts/EditTaskContext';
import { ClientDataProvider } from './contexts/ClientDataContext';
import { TaskLogProvider } from './contexts/TaskLogContext';
import { OtherAttachmentValuesProvider } from './contexts/OtherAttachmentValuesContext';

const TaskManager = () => {
    return (
        <TaskProvider>
            <EditTaskProvider>
                <OtherAttachmentValuesProvider>
                    <TaskLogProvider>
                        <ClientDataProvider>
                            <TaskHelperProvider>
                                <CreateTaskProvider>
                                    <TaskView />
                                </CreateTaskProvider>
                            </TaskHelperProvider>
                        </ClientDataProvider>
                    </TaskLogProvider>
                </OtherAttachmentValuesProvider>
            </EditTaskProvider>
        </TaskProvider>
    );
};

export default TaskManager;
