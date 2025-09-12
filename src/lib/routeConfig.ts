// utils/dashboardConfig.ts
import Cart from "@/components/customer/Cart";
import Orders from "@/components/shared/Orders";
import Favourites from "@/components/customer/Favourites";
import Products from "@/components/seller/Products";
import Payments from "@/components/seller/Payments";
import ManageCustomers from "@/components/admin/ManageCustomers";
import ManageSellers from "@/components/admin/ManageSellers";

export const routeConfig:any = {
  customer: {
    tabs: [
      { key: "cart", label: "Cart", component: Cart },
      { key: "orders", label: "Orders", component: Orders },
      { key: "favourites", label: "Favourites", component: Favourites },
    ],
  },
  seller: {
    tabs: [
      { key: "products", label: "Products", component: Products },
      { key: "orders", label: "Orders", component: Orders },
      { key: "payments", label: "Payments", component: Payments },
    ],
  },
  admin: {
    tabs: [
      { key: "customers", label: "Manage Customers", component: ManageCustomers },
      { key: "sellers", label: "Manage Sellers", component: ManageSellers },
    ],
  },
};
