import {
  type Announcements,
  PointerSensor,
  type ScreenReaderInstructions,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

// A press that moves less than this is a tap, so every draggable element
// keeps working with the tap-to-select-then-tap-to-place alternative.
const TAP_TOLERANCE_PX = 8;
// Touch drags start after a short hold, leaving quick swipes to scroll.
const TOUCH_HOLD_MS = 150;

// Sensors shared by every drag-and-drop answer area. There is no keyboard
// sensor: keyboard users take the tap-to-place path, where Enter is a tap.
export function useDragSensors() {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: TAP_TOLERANCE_PX },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: TOUCH_HOLD_MS,
        tolerance: TAP_TOLERANCE_PX,
      },
    }),
  );
}

const ANNOUNCEMENTS: Announcements = {
  onDragStart: () => "Đã nhấc lên.",
  onDragOver: ({ over }) => (over ? "Đang ở trên một chỗ đặt." : undefined),
  onDragEnd: ({ over }) => (over ? "Đã đặt vào chỗ mới." : "Đã thả ra."),
  onDragCancel: () => "Đã huỷ kéo.",
};

const INSTRUCTIONS: ScreenReaderInstructions = {
  draggable: "Chạm để chọn, rồi chạm vào chỗ muốn đặt.",
};

// dnd-kit announces drags in English unless told otherwise.
export const DRAG_ACCESSIBILITY = {
  announcements: ANNOUNCEMENTS,
  screenReaderInstructions: INSTRUCTIONS,
};
