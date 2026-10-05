import type {
  DeviceClass,
  FeedbackReason,
  FeedbackScreen,
  FeedbackSource,
} from "./schema";

// The words shown for each value, in the sheet the child taps and in the
// GitHub issue: one map each, so the chip and the issue never disagree.

export const REASON_LABELS: Record<FeedbackReason, string> = {
  "kho-hieu": "Khó hiểu",
  "sai-noi-dung": "Sai nội dung hoặc đáp án",
  "loi-hinh-video": "Hình hoặc video bị lỗi",
  "dai-chan": "Dài quá, chán",
  thich: "Hay, mình thích",
};

export const SOURCE_LABELS: Record<FeedbackSource, string> = {
  be: "Bé",
  "phu-huynh": "Phụ huynh",
};

export const SCREEN_LABELS: Record<FeedbackScreen, string> = {
  lesson: "Trang bài",
  overview: "Giới thiệu bài",
  tips: "Mẹo hay",
  block: "Thẻ / video",
  exercise: "Câu hỏi",
  recap: "Tóm tắt",
  done: "Màn kết thúc phần",
  review: "Ôn tập",
};

const DEVICE_KIND_LABELS: Record<DeviceClass["kind"], string> = {
  ipad: "iPad",
  phone: "Điện thoại",
  desktop: "Máy tính",
};
const DEVICE_OS_LABELS: Record<DeviceClass["os"], string> = {
  ios: "iOS",
  android: "Android",
  macos: "macOS",
  windows: "Windows",
  other: "khác",
};

export function deviceLabel(device: DeviceClass): string {
  return `${DEVICE_KIND_LABELS[device.kind]} (${DEVICE_OS_LABELS[device.os]})`;
}
