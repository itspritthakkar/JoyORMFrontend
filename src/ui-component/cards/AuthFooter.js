// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="end">
        {/* <Typography variant="subtitle2" component={Link} href="https://berrydashboard.io" target="_blank" underline="hover">
            berrydashboard.io
        </Typography> */}
        <Typography variant="subtitle2" component={Link} href="https://joycreations.in/" target="_blank" underline="hover">
            &copy; joycreations.in
        </Typography>
    </Stack>
);

export default AuthFooter;
