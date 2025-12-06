import useAuth from 'hooks/useAuth';
import PropTypes from 'prop-types';
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import axiosExtended from 'utils/axios';
import { showAxiosErrorEnquebar } from 'utils/commons/functions';

export const ClientDataContext = createContext();

export const ClientDataProvider = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const [loadingItems, setLoadingItems] = useState(true);
    const [items, setItems] = useState([]);

    // ----------------------------
    //   FETCH ALL CLIENT DATA
    // ----------------------------
    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchClientData = async () => {
            try {
                setLoadingItems(true);
                const { data } = await axiosExtended.get('/ClientData');
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                showAxiosErrorEnquebar(err);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchClientData();
    }, [isLoggedIn]);

    const itemsMap = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

    const value = useMemo(() => ({ loadingItems, setLoadingItems, items, setItems, itemsMap }), [items, loadingItems, itemsMap]);

    return <ClientDataContext.Provider value={value}>{children}</ClientDataContext.Provider>;
};

ClientDataProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useClientDataContext = () => {
    const context = useContext(ClientDataContext);
    if (!context) {
        throw new Error('useClientDataContext must be used within ClientDataProvider');
    }
    return context;
};
