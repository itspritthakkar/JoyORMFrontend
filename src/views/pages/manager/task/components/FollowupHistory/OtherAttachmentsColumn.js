import { Box, Typography } from '@mui/material';
import { useOtherAttachmentsContext } from '../../contexts/OtherAttachmentsContext';
import { useMemo } from 'react';

const OtherAttachmentsColumn = () => {
    const { items, selectedItems } = useOtherAttachmentsContext();

    const selectedItemDetails = useMemo(() => {
        const labels = [];
        for (const selectedItem of selectedItems) {
            labels.push(items.find((item) => item.id == selectedItem));
        }

        return labels;
    }, [items, selectedItems]);

    return (
        <Box
            sx={{
                width: '23%',
                backgroundColor: '#F0F8C9',
                borderRadius: 1,
                p: 1
            }}
        >
            <Typography fontWeight="bold" fontSize={14} mb={1}>
                Other form attachments
            </Typography>

            <Box sx={{ overflowY: 'auto', maxHeight: '110px' }}>
                {selectedItemDetails.map((selectedItemDetail) => (
                    <Typography key={selectedItemDetail.id} fontSize={12}>
                        {selectedItemDetail.label}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default OtherAttachmentsColumn;
