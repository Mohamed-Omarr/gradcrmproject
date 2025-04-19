'use client'
export default function Home() {
  return (
    <div className="h-full rounded-lg border p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-medium">Total Sales</h2>
          <p className="text-2xl font-bold mt-2">$12,345</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-medium">New Users</h2>
          <p className="text-2xl font-bold mt-2">243</p>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-medium">Active Products</h2>
          <p className="text-2xl font-bold mt-2">56</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
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
              <tr className="border-t">
                <td className="p-3">Added new product</td>
                <td className="p-3">John Doe</td>
                <td className="p-3">2 hours ago</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Updated inventory</td>
                <td className="p-3">Jane Smith</td>
                <td className="p-3">5 hours ago</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Completed order #1234</td>
                <td className="p-3">Admin</td>
                <td className="p-3">Yesterday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

