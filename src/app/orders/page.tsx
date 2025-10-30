"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Card, Typography, Spin, Empty } from "antd";
import { getOrders } from "@/lib/api";
import Spinner from "@/components/Spinner";

const { Title } = Typography;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        if (res?.orders) setOrders(res.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => <span className="text-blue-500 font-medium">{id.slice(-6)}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amt: number) => `₹${amt.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color =
          status === "completed"
            ? "green"
            : status === "pending"
            ? "orange"
            : status === "failed"
            ? "red"
            : "blue";
        return <Tag color={color} className="capitalize">{status}</Tag>;
      },
    },
  ];

  return (
    <div className=" bg-gray-50 px-4 flex justify-center h-[75vh] overflow-auto">

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16">
            <Empty description="No orders found" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={false}
          />
        )}
    </div>
  );
}
