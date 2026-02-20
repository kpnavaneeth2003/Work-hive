import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Orders.scss";

export default function Orders() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => (await newRequest.get("/admin/orders")).data,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((o) =>
      [o.isCompleted ? "completed" : "pending", o.title]
        .filter(Boolean)
        .some((x) => x.toLowerCase().includes(s))
    );
  }, [data, q]);

  return (
    <div className="ordersPage">
      <div className="pageHeader">
        <h3>Services</h3>
        <input
          placeholder="Search by title/completed/pending..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="tableWrap">
        {isLoading ? (
          <div className="empty">Loading Services...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Title</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((o) => (
                <tr key={o._id}>
                  <td>{o._id.slice(-6)}</td>
                  <td>{o.title}</td>

                  {/* ✅ from backend */}
                  <td>{o.buyerIdUser?.username || o.buyerId}</td>
                  <td>{o.sellerIdUser?.username || o.sellerId}</td>

                  <td>{o.price ?? "-"}</td>
                  <td>
                    <span className={`pill ${o.isCompleted ? "ok" : "pending"}`}>
                      {o.isCompleted ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="emptyRow">No services found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}