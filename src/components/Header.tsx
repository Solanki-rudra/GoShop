"use client";

import { Input, Badge, Dropdown, Avatar, Button } from "antd";
import { ShoppingCartOutlined, UserOutlined, ProfileOutlined, LogoutOutlined, UnorderedListOutlined } from "@ant-design/icons";
import Link from "next/link";
import { BRAND_NAME } from "@/constants/constant";
import { MenuProps } from "antd";
import { logoutUser } from "@/lib/api";
import { useCustNotification } from "@/context/NotificationProvider";

export default function Header() {
    const custNotification = useCustNotification();
  

  const handleLogout = async () => {
    try {
       const response = await logoutUser()
      custNotification.success(response?.message || "Logged out successfully");
      window.location.href = "/login";
    } catch (error:any) {
      custNotification.error(error?.message || "Logout failed");
    }
  }

// Define menu items with correct type
const menuItems: MenuProps["items"] = [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: <Link href="/profile">My Profile</Link>,
  },
  {
    key: "orders",
    icon: <UnorderedListOutlined />,
    label: <Link href="/orders">My Orders</Link>,
  },
  {
    type: "divider" as const, // 👈 cast as const
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    danger: true,
    label: <Button type="text" onClick={handleLogout}>Logout</Button>,
  },
];


  return (
    <header className="sticky top-0 z-50 bg-[#9CAFAA] shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-brand">
          {BRAND_NAME}
        </Link>

        {/* Search */}
        <div className="flex-1 px-6">
          <Input.Search
            placeholder="Search for products, brands and more..."
            allowClear
            enterButton
            size="large"
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link href="/cart" className="flex items-center gap-1 text-gray-700 hover:text-brand">
            <Badge count={3} size="small" offset={[0, 4]}>
              <ShoppingCartOutlined style={{ fontSize: 24 }} />
            </Badge>
            <span className="hidden sm:inline font-medium">Cart</span>
          </Link>

          {/* Orders */}
          <Link href="/orders" className="flex items-center gap-1 text-gray-700 hover:text-brand">
            <ProfileOutlined style={{ fontSize: 22 }} />
            <span className="hidden sm:inline font-medium">Orders</span>
          </Link>

          {/* Profile dropdown */}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button type="text" icon={<Avatar size="large" icon={<UserOutlined />} />} />
          </Dropdown>

        </div>
      </div>
    </header>
  );
}
