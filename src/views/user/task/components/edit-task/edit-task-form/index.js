import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { CustomTabPanel } from 'utils/commons/components';
import { a11yProps } from 'utils/commons/functions';
import Page1 from './page1/index';
import Page2 from './page2/index';
import Page3 from './Page3/index';
import PropTypes from 'prop-types';
import EditTaskHeader from './EditTaskHeader';

const withNextHandler = (Component) => {
    const EnhancedComponent = ({ handleNext, ...props }) => {
        return <Component {...props} handleNext={handleNext} />;
    };

    EnhancedComponent.propTypes = {
        handleNext: PropTypes.func.isRequired
    };

    return EnhancedComponent;
};

const PAGES_TAB = 'pages-tab';

const EditTaskForm = () => {
    const [value, setValue] = useState(0);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    const handleNext = () => {
        setValue((prev) => {
            if (prev >= TABS.length - 1) return prev; // Stop at last tab
            return prev + 1;
        });
    };

    const TABS = [
        { label: 'Page 1', component: withNextHandler(Page1) },
        { label: 'Page 2', component: withNextHandler(Page2) },
        { label: 'Page 3', component: withNextHandler(Page3) }
    ];

    return (
        <Box>
            <EditTaskHeader />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label={PAGES_TAB}>
                    {TABS.map((tab, index) => (
                        <Tab key={index} label={tab.label} {...a11yProps(index, PAGES_TAB)} />
                    ))}
                </Tabs>
            </Box>

            {TABS.map((tab, index) => {
                const Component = tab.component;
                return (
                    <CustomTabPanel key={index} value={value} index={index}>
                        <Component handleNext={handleNext} />
                    </CustomTabPanel>
                );
            })}
        </Box>
    );
};

export default EditTaskForm;
