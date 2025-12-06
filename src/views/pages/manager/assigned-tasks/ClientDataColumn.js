import { Box, Typography } from '@mui/material';
import { useClientDataContext } from 'contexts/ClientDataContext';
import PropTypes from 'prop-types';

const ClientDataColumn = ({ clientDataValues }) => {
    const { itemsMap } = useClientDataContext();

    if (!clientDataValues || clientDataValues.length === 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 0.5,
                minWidth: '150px',
                height: '100%',
                p: 1
            }}
        >
            {clientDataValues.map((valueItem) => (
                <Typography key={valueItem.clientDataId} fontSize={12} sx={{ mb: 0.5 }}>
                    {valueItem.isMissing && !valueItem.isAvailable ? (
                        <span style={{ color: 'red' }}>{itemsMap.get(valueItem.clientDataId)?.label}</span>
                    ) : (
                        itemsMap.get(valueItem.clientDataId)?.label
                    )}
                    : <span style={{ color: 'green' }}>{valueItem.value}</span>
                </Typography>
            ))}
        </Box>
    );
};

ClientDataColumn.propTypes = {
    clientDataValues: PropTypes.array.isRequired
};
export default ClientDataColumn;
