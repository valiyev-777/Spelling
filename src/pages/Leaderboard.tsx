import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import dayjs from "dayjs";

type User = {
  id: string;
  nickname: string;
  correct_count: number;
  last_practice_at: string;
  created_at: string;
};

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, nickname, correct_count, last_practice_at, created_at");

    if (error) {
      console.error("❌ Supabase error:", error);
      return;
    }

    const filtered = filterByTime(data || []);
    const sorted = filtered.sort((a, b) => b.correct_count - a.correct_count);
    setUsers(sorted);
  };

  const filterByTime = (list: User[]) => {
    if (timeFilter === "all") return list;

    const now = dayjs();
    return list.filter((u) => {
      const activityDate = dayjs(u.last_practice_at);
      if (timeFilter === "day") return now.diff(activityDate, "day") < 1;
      if (timeFilter === "week") return now.diff(activityDate, "day") < 7;
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Faollar jadvali</h1>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">
          So‘nggi yangilanish: {dayjs().format("DD.MM.YYYY HH:mm")}
        </span>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded"
        >
          <option value="day">Bugun</option>
          <option value="week">Bu hafta</option>
          <option value="all">Butun davr</option>
        </select>
      </div>

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-slate-700 text-left text-sm">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">O‘quvchilar</th>
              <th className="px-4 py-2">Ball</th>
              <th className="px-4 py-2">Boshlash Sanasi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className={`${i % 2 === 0 ? "bg-slate-900" : "bg-slate-800"}`}
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2 font-medium">{user.nickname}</td>
                <td className="px-4 py-2 text-yellow-400">
                  ⭐ {user.correct_count.toLocaleString()}K
                </td>
                <td className="px-4 py-2">
                  {dayjs(user.created_at).format("DD.MM.YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
