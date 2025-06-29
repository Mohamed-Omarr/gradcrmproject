"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Mail, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import axiosAdmin from "@/lib/axios/axiosAdmin";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import Loader from "@/app/Loader";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CRMGetAllCustomer[] | []>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CRMGetAllCustomer | null>(null);
  const [customerDetailsOpen, setCustomerDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalOrdersOfCustomer = customers.reduce(
    (a, c) => a + c.Order.reduce((sum, x) => sum + x.total, 0),
    0
  );

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosAdmin.get("customer/customerMethods");
      setCustomers(res.data.customers);
      toastingSuccess(res.data.message);
    } catch (error) {
      toastingError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    const term = searchTerm.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.id.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  const viewCustomerDetails = (customer: CRMGetAllCustomer) => {
    setSelectedCustomer(customer);
    setCustomerDetailsOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="h-full space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Customers
                </p>
                <p className="text-2xl font-bold">
                  {(customers && customers.length) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Badge className="bg-blue-100 text-blue-800">New</Badge>
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  New Customers
                </p>
                <p className="text-2xl font-bold">
                  {(customers && customers.slice(-2).length) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Avg. Orders
                </p>
                <p className="text-2xl font-bold">
                  {(customers &&
                    totalOrdersOfCustomer &&
                    Math.round(totalOrdersOfCustomer / customers.length)) ||
                    0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Loader />
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && filteredCustomers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="text-center py-8">
                        <User className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                          No customers found
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {searchTerm
                            ? "Try adjusting your search terms."
                            : "Get started by adding your first customer."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  filteredCustomers.length > 0 &&
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`/placeholder.svg`}
                              alt={customer.name}
                            />
                            <AvatarFallback>
                              {getInitials(customer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {customer.id}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        {new Date(customer.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{customer.Order.length}</TableCell>
                      <TableCell>
                        ${customer.Order.reduce((sum, o) => sum + o.total, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewCustomerDetails(customer)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={customerDetailsOpen} onOpenChange={setCustomerDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/placeholder.svg`}
                    alt={selectedCustomer.name}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCustomer.email}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    Customer since{" "}
                    {new Date(selectedCustomer.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    CUSTOMER ID
                  </h4>
                  <p className="font-mono">{selectedCustomer.id}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    TOTAL ORDERS
                  </h4>
                  <p className="text-lg font-semibold">
                    {selectedCustomer.Order.length}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    TOTAL SPENT
                  </h4>
                  <p className="text-lg font-semibold">
                    $
                    {selectedCustomer.Order.reduce(
                      (sum, order) => sum + order.total,
                      0
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    AVG ORDER VALUE
                  </h4>
                  <p className="text-lg font-semibold">
                    $
                    {(
                      selectedCustomer.Order.reduce(
                        (sum, order) => sum + order.total,
                        0
                      ) / selectedCustomer.Order.length
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      {selectedCustomer.email}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  {selectedCustomer.address.map((a) => (
                    <div key={a.id} className="text-sm">
                      <p>Type of Address: {a.addressType}</p>
                      <p>County: {a.country}</p>
                      <p>City: {a.city}</p>
                      <p>Street: {a.street}</p>
                      <p>ZipCode: {a.zipCode}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recent Orders</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCustomer.Order.slice(0, 5).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          {new Date(order.updatedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
