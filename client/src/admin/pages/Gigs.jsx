import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Gigs.scss";

export default function Gigs() {
  const [q, setQ] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminGigs"],
    queryFn: async () => (await newRequest.get("/admin/gigs")).data,
  });

  const delMut = useMutation({
    mutationFn: async (id) => (await newRequest.delete(`/admin/gigs/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminGigs"] }),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((g) =>
      [g.title, g.cat].filter(Boolean).some((x) => x.toLowerCase().includes(s))
    );
  }, [data, q]);

  return (
    <div className="gigsPage">
      <div className="pageHeader">
        <h3>Gigs</h3>
        <input
          placeholder="Search by title/category..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="tableWrap">
        {isLoading ? (
          <div className="empty">Loading gigs...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Seller</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((g) => (
                <tr key={g._id}>
                  <td className="title">{g.title}</td>
                  <td>{g.cat || "-"}</td>
                  <td>{g.price ?? "-"}</td>
                  {/* seller info from backend */}
                  <td>{g.userIdUser?.username || g.userId || "-"}</td>
                  <td>{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <button
                      className="btn danger"
                      onClick={() => delMut.mutate(g._id)}
                      disabled={delMut.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="emptyRow">No gigs found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}