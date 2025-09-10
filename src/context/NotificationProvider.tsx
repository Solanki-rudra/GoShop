"use client";
import React, { createContext, useContext } from "react";
import { notification } from "antd";
import {
    CheckOutlined,
    CloseCircleOutlined,
    ExclamationCircleFilled,
    WarningFilled,
} from "@ant-design/icons";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [api, contextHolder] = notification.useNotification();

    const custNotification = {
        error: (message: string) =>
            api.error({
                icon: <ExclamationCircleFilled />,
                duration: 5,
                message,
                closeIcon: <CloseCircleOutlined />,
                style: { color: 'red' }
            }),
        warning: (message: string) =>
            api.warning({
                icon: <WarningFilled />,
                duration: 5,
                message,
                closeIcon: <CloseCircleOutlined />,
            }),
        success: (message: string) =>
            api.success({
                icon: <CheckOutlined />,
                duration: 5,
                message,
                closeIcon: <CloseCircleOutlined />,
                style: { color: 'green' }
            }),
        destroy: () => api.destroy(),
    };

    return (
        <NotificationContext.Provider value={custNotification}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useCustNotification = () => useContext(NotificationContext);
