import { Box, Typography } from '@mui/material';
import { useClientDataContext } from '../../contexts/ClientDataContext';
import { useMemo } from 'react';

const ClientDataColumn = () => {
    const { clientDataFields, valuesResponse } = useClientDataContext();

    const clientDataFieldsMap = useMemo(() => {
        const map = {};

        clientDataFields.forEach((clientDataField) => {
            map[clientDataField.id] = clientDataField.label;
        });

        return map;
    }, [clientDataFields]);

    return (
        <Box
            sx={{
                width: '27%',
                backgroundColor: '#D7EEFF',
                borderRadius: 1,
                p: 1
            }}
        >
            <Typography fontWeight="bold" fontSize={14} mb={1}>
                Client Data
            </Typography>

            <Box sx={{ overflowY: 'auto', maxHeight: '110px' }}>
                {valuesResponse.fields &&
                    valuesResponse.fields.length > 0 &&
                    valuesResponse.fields.map((valueItem) => (
                        <Typography key={valueItem.clientDataId} fontSize={12} sx={{ mb: 0.5 }}>
                            {valueItem.isMissing && !valueItem.isAvailable ? (
                                <span style={{ color: 'red' }}>{clientDataFieldsMap[valueItem.clientDataId]}</span>
                            ) : (
                                clientDataFieldsMap[valueItem.clientDataId]
                            )}
                            : <span style={{ color: 'green' }}>{valueItem.value}</span>
                        </Typography>
                    ))}
            </Box>
        </Box>
    );
};

export default ClientDataColumn;
