"use client";

import { Music } from "lucide-react";
import { BigButton } from "@/components/big-button";
import {
  setBackgroundMusicEnabled,
  useBackgroundMusicEnabled,
} from "@/progress/hooks";
import { Panel } from "./panel";

const TITLE = "Nhạc nền";

// The parent page's switch for the background music of the child's outer
// screens (home, lessons list, profile picker) on this device. The same
// device setting as the music switch on the home screen; never synced.
export function BackgroundMusicSetting() {
  const enabled = useBackgroundMusicEnabled();
  if (enabled === undefined) return null;
  return (
    <Panel
      title={TITLE}
      note="Nhạc nhẹ ở trang chủ và danh sách bài trên máy này; tự im khi con học, xem video hay nghe đọc."
      label={TITLE}
    >
      <p
        className="font-semibold"
        data-background-music={enabled ? "on" : "off"}
      >
        {enabled ? "Đang bật" : "Đang tắt"}
      </p>
      <BigButton
        variant="secondary"
        aria-pressed={enabled}
        onClick={() => void setBackgroundMusicEnabled(!enabled)}
        className="md:w-auto md:self-start"
      >
        <Music aria-hidden className="size-6" />
        {enabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
      </BigButton>
    </Panel>
  );
}
