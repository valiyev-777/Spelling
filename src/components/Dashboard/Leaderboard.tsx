// src/components/dashboard/Leaderboard.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type User = {
  nickname: string;
  correct_count: number;
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("nickname, correct_count")
        .order("correct_count", { ascending: false })
        .limit(10);

      if (error) console.error("Leaderboard error:", error);
      else setLeaders(data || []);
    })();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-3">🏆 Leaderboard</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">#</th>
            <th className="py-2">Nickname</th>
            <th className="py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((u, i) => (
            <tr key={i} className="border-b">
              <td className="py-2">{i + 1}</td>
              <td className="py-2">{u.nickname}</td>
              <td className="py-2 font-bold text-blue-600">
                {u.correct_count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
