import React, { useEffect, useState } from "react";
import { getRewardPointsApi } from "../Api Service/AllApi";

const RewardPopup = ({ userId, onClose }) => {
  const [points, setPoints] = useState(0);

  const fetchPoints = async () => {
    try {
      const res = await getRewardPointsApi(userId);
      const pts = res.data?.total_points ?? res.data?.total_reward_points ?? 0;
      setPoints(pts);
    } catch (err) {
      console.error("Reward API error:", err);
      setPoints(0);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-[300px] relative">
        <button
          className="absolute top-2 right-2 text-gray-500 font-bold"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">Your Reward Points</h2>
        <p className="text-gray-700 text-lg">{points} points</p>
        <p className="text-sm text-gray-500 mt-2">
          10 points = $1 discount
        </p>
      </div>
    </div>
  );
};

export default RewardPopup;
