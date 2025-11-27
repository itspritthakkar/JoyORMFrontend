import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { CustomTabPanel } from 'utils/commons/components';
import { a11yProps } from 'utils/commons/functions';
import EditTaskHeader from '../EditTaskHeader';
import Page1 from './page1/index';
import Page2 from './page2';
import ClientDataPanel from './Page3';

const PAGES_TAB = 'pages-tab';

const EditTaskForm = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box>
            <EditTaskHeader />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label={PAGES_TAB}>
                    <Tab label="Page 1" {...a11yProps(0, PAGES_TAB)} />
                    <Tab label="Page 2" {...a11yProps(1, PAGES_TAB)} />
                    <Tab label="Page 3" {...a11yProps(2, PAGES_TAB)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Page1 />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Page2 />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <ClientDataPanel />
            </CustomTabPanel>
        </Box>
    );
};

export default EditTaskForm;
