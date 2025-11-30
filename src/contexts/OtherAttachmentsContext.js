import useAuth from 'hooks/useAuth';
import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';

export const OtherAttachmentsContext = createContext();

export const OtherAttachmentsProvider = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [loadingItems, setLoadingItems] = useState(true);
    const [items, setItems] = useState([]);

    // ----------------------------
    //   FETCH ALL OTHER ATTACHMENTS
    // ----------------------------
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchAttachments = async () => {
            try {
                setLoadingItems(true);
                const { data } = await axiosExtended.get('/OtherAttachment');
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                showAxiosErrorEnquebar(err);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchAttachments();
    }, [isLoggedIn]);

    const value = useMemo(() => ({ loadingItems, setLoadingItems, items, setItems }), [items, loadingItems]);

    return <OtherAttachmentsContext.Provider value={value}>{children}</OtherAttachmentsContext.Provider>;
};

OtherAttachmentsProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useOtherAttachmentsContext = () => {
    const context = useContext(OtherAttachmentsContext);
    if (!context) {
        throw new Error('useOtherAttachmentsContext must be used within OtherAttachmentsProvider');
    }
    return context;
};
