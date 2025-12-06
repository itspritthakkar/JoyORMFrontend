import MainCard from 'ui-component/cards/MainCard';
import DataTable from 'utils/commons/datatable/DataTable';
import { useDataTable } from 'utils/commons/datatable/useDataTable';
import TaskItemColumn from './TaskItemColumn';
import OtherAttachmentsColumn from './OtherAttachmentsColumn';
import { useTheme } from '@mui/material';
import ClientDataColumn from './ClientDataColumn';
import NotesColumn from './NotesColumn';
import FollowupHistoryColumn from './FollowupHistoryColumn';

const AssignedTasks = () => {
    const theme = useTheme();
    const table = useDataTable({ url: '/TaskProgress/Paged' });

    const columns = [
        {
            id: 'task',
            label: 'Task',
            render: (row) => {
                const { taskItem } = row;
                return <TaskItemColumn taskItem={taskItem} />;
            },
            cellSx: {
                backgroundColor: '#daffb7'
            }
        },
        {
            id: 'otherAttachments',
            label: 'Other Attachments',
            render: (row) => {
                const { otherAttachmentValueIds } = row;
                return <OtherAttachmentsColumn otherAttachmentValueIds={otherAttachmentValueIds} />;
            },
            cellSx: {
                backgroundColor: '#F0F8C9'
            }
        },
        {
            id: 'clientData',
            label: 'Client Data',
            render: (row) => {
                const { clientDataFields } = row;
                return <ClientDataColumn clientDataValues={clientDataFields} />;
            },
            cellSx: {
                backgroundColor: '#D7EEFF'
            }
        },
        {
            id: 'followupHistory',
            label: 'Followup History',
            render: (row) => {
                const { taskLogs } = row;
                return <FollowupHistoryColumn taskLogs={taskLogs} />;
            },
            cellSx: {
                backgroundColor: '#FDE3D8'
            }
        },
        {
            id: 'notes',
            label: 'Notes',
            render: () => {
                return <NotesColumn />;
            },
            cellSx: {
                backgroundColor: '#D8FFD8'
            }
        }
    ];

    return (
        <MainCard>
            <DataTable
                columns={columns}
                {...table}
                onSort={table.handleRequestSort}
                onPageChange={table.handleChangePage}
                onRowsChange={table.handleChangeRowsPerPage}
                showSearch
                searchPlaceholder="Search Entries"
                rowSx={{
                    '& td, & th': {
                        borderBottom: `1px solid ${theme.palette.grey[400]}`
                    }
                }}
            />
        </MainCard>
    );
};

export default AssignedTasks;
