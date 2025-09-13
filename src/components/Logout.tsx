"use client";
import { useCustNotification } from "@/context/NotificationProvider";
import { logoutUser } from "@/lib/api";
import { removeUserFromLocalStorage } from "@/lib/clientAuth";
import { Button } from "antd";


export default function Logout() {
    const custNotification = useCustNotification();
    const handleLogout = async () => {
      try {
         const response = await logoutUser()
        custNotification.success(response?.message || "Logged out successfully");
        removeUserFromLocalStorage();
        window.location.href = "/login";
      } catch (error:any) {
        custNotification.error(error?.message || "Logout failed");
      }
    }

  return <Button type="primary" block danger ghost onClick={handleLogout}>Logout</Button> 
}