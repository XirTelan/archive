import Log from "../models/Log";
import Rating from "../models/Rating";
import { DataEntry } from "../types";
import { addLogEntry } from "./logs";

export const updateRating = async (data: DataEntry[], contestId: string) => {
  console.log("updateRating: entries count:", data.length);
  if (data.length === 0) {
    await addLogEntry(
      "Recive 0 entries from leaderboard update.Check  Session_Id",
      "warning"
    );
    console.error("Recive 0 entries from leaderboard update.Check  Session_Id");
  }
  const queue = [];
  for (const user of data) {
    const filter = { userId: user.id, contestId: contestId };
    const update = {
      tasks: user.tasks || 0,
      fine: user.fine || 0,
      tries: user.tries || 0,
    };
    queue.push(
      Rating.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      })
    );
  }
  const res = await Promise.all(queue);
};
