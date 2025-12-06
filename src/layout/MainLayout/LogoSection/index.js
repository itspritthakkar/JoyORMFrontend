import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Typography } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="company logo" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Logo width={50} />
        <Typography variant="h4">Joydesk</Typography>
    </Link>
);

export default LogoSection;
