import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { CustomTabPanel } from 'utils/commons/components';
import { a11yProps } from 'utils/commons/functions';
import ApplicationType from './ApplicationType';
import OtherAttachment from './OtherAttachment';

const APPROVALS_TAB = 'approvals-tab';

const Approvals = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <MainCard>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label={APPROVALS_TAB}>
                    <Tab label="Application Type" {...a11yProps(0, APPROVALS_TAB)} />
                    <Tab label="Other Attachments" {...a11yProps(1, APPROVALS_TAB)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <ApplicationType />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <OtherAttachment />
            </CustomTabPanel>
        </MainCard>
    );
};

export default Approvals;
