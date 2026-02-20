import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Users.scss";

export default function Users() {
  const [q, setQ] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => (await newRequest.get("/admin/users")).data,
  });

  const banMut = useMutation({
    mutationFn: async (id) => (await newRequest.patch(`/admin/users/${id}/ban`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adminUsers"] }),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter((u) =>
      [u.username, u.email, u.role].filter(Boolean).some((x) => x.toLowerCase().includes(s))
    );
  }, [data, q]);

  return (
    <div className="usersPage">
      <div className="pageHeader">
        <h3>Users</h3>
        <input
          placeholder="Search by username/email/role..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="tableWrap">
        {isLoading ? (
          <div className="empty">Loading users...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>{u.username}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.role || (u.isSeller ? "seller" : "buyer")}</td>
                  <td>
                    <span className={u.isBanned ? "pill danger" : "pill ok"}>
                      {u.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => banMut.mutate(u._id)}
                      disabled={banMut.isPending || u.role === "admin"}
                      title={u.role === "admin" ? "Cannot ban admin" : ""}
                    >
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="emptyRow">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}