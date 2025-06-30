"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Calendar, CreditCard, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

// Sample analytics data
const analyticsData = {
  revenue: {
    total: 12495.89,
    change: 12.5,
    periods: {
      daily: [1200, 980, 1400, 1250, 1800, 1600, 1700],
      weekly: [5800, 6200, 7100, 6800],
      monthly: [18500, 21000, 19800, 22500, 24000, 23000],
    },
  },
  orders: {
    total: 356,
    change: 8.2,
    periods: {
      daily: [32, 28, 42, 35, 40, 38, 45],
      weekly: [145, 160, 175, 168],
      monthly: [520, 580, 610, 590, 640, 620],
    },
  },
  customers: {
    total: 2420,
    change: 5.8,
    periods: {
      daily: [15, 12, 18, 14, 20, 16, 22],
      weekly: [75, 82, 90, 88],
      monthly: [280, 310, 290, 320, 350, 330],
    },
  },
  averageOrder: {
    total: 35.1,
    change: 3.2,
    periods: {
      daily: [32.5, 35.0, 33.4, 36.2, 35.8, 34.9, 37.1],
      weekly: [34.2, 35.1, 35.8, 36.4],
      monthly: [33.8, 34.5, 35.2, 35.9, 36.4, 37.1],
    },
  },
  paymentMethods: {
    "Credit Card": 65,
    PayPal: 20,
    "Apple Pay": 10,
    "Google Pay": 5,
  },
  topProducts: [
    { name: "Premium Headphones", sales: 124, revenue: 24798.76 },
    { name: "Smartphone Stand", sales: 98, revenue: 2939.02 },
    { name: "Wireless Charger", sales: 87, revenue: 4349.13 },
    { name: "Cotton T-Shirt", sales: 76, revenue: 1899.24 },
    { name: "Smart Watch", sales: 65, revenue: 22749.35 },
  ],
  recentTransactions: [
    { id: "TRX-001", customer: "John Doe", amount: 249.99, date: "May 20, 2023", status: "Completed" },
    { id: "TRX-002", customer: "Jane Smith", amount: 74.98, date: "May 19, 2023", status: "Completed" },
    { id: "TRX-003", customer: "Robert Johnson", amount: 149.97, date: "May 19, 2023", status: "Completed" },
    { id: "TRX-004", customer: "Emily Davis", amount: 349.99, date: "May 18, 2023", status: "Completed" },
    { id: "TRX-005", customer: "Michael Wilson", amount: 124.95, date: "May 18, 2023", status: "Refunded" },
  ],
  recentActivity: [
    { activity: "Added new product", user: "John Doe", time: "2 hours ago" },
    { activity: "Updated inventory", user: "Jane Smith", time: "5 hours ago" },
    { activity: "Completed order #1234", user: "Admin", time: "Yesterday" },
    { activity: "New customer registration", user: "System", time: "Yesterday" },
    { activity: "Product review submitted", user: "Customer", time: "2 days ago" },
  ],
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("30")

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your store overview</p>
        </div>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Time Period</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${analyticsData.revenue.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {analyticsData.revenue.change >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(analyticsData.revenue.change)}%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.total}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${analyticsData.orders.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {analyticsData.orders.change >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(analyticsData.orders.change)}%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${analyticsData.customers.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {analyticsData.customers.change >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(analyticsData.customers.change)}%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.averageOrder.total.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={`inline-flex items-center ${analyticsData.averageOrder.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {analyticsData.averageOrder.change >= 0 ? (
                  <ArrowUp className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3" />
                )}
                {Math.abs(analyticsData.averageOrder.change)}%
              </span>{" "}
              from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart - Spans 4 columns */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue trends for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {/* Placeholder for chart - in a real app, you'd use a charting library */}
              <div className="flex h-full items-end gap-2 rounded-md border p-4">
                {analyticsData.revenue.periods.daily.map((value, i) => (
                  <div
                    key={i}
                    className="bg-primary/90 hover:bg-primary w-full transition-all"
                    style={{
                      height: `${(value / Math.max(...analyticsData.revenue.periods.daily)) * 100}%`,
                    }}
                    title={`$${value}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products - Spans 4 columns */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with the highest sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${product.revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      ${(product.revenue / product.sales).toFixed(2)} per unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions - Spans 3 columns */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{transaction.customer}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{transaction.id}</p>
                      <span className="text-xs">•</span>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${transaction.amount.toFixed(2)}</p>
                    <p
                      className={`text-xs ${
                        transaction.status === "Completed"
                          ? "text-green-600"
                          : transaction.status === "Refunded"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest activities in your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left">Activity</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentActivity.map((activity, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{activity.activity}</td>
                    <td className="p-3">{activity.user}</td>
                    <td className="p-3">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
