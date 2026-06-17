"use client";

import { useEffect } from "react";
import { addSearchHistory } from "@/lib/storage";

export default function PlayerHistoryRecorder({
  playerId,
  username,
  avatar,
}: {
  playerId: string;
  username: string;
  avatar: string | null;
}) {
  useEffect(() => {
    addSearchHistory({ playerId, username, avatar });
  }, [playerId, username, avatar]);

  return null;
}
