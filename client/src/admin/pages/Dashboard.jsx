import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Dashboard.scss";

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => (await newRequest.get("/admin/stats")).data,
  });

  if (isLoading) return <div className="adminBox">Loading stats...</div>;
  if (error) return <div className="adminBox">Failed to load stats</div>;

  const cards = [
    { label: "Total Users", value: data.totalUsers },
    { label: "Total Sellers", value: data.totalSellers },
    { label: "Total Gigs", value: data.totalGigs },
    { label: "Total Services", value: data.totalOrders },
    { label: "Completed Services", value: data.completedOrders },
    { label: "Revenue (Completed)", value: data.totalRevenue },
  ];

  return (
    <div className="dashboard">
      <div className="grid">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <div className="label">{c.label}</div>
            <div className="value">{c.value ?? 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
}