# Bàn giao: Bài 8 `quan-he-chia-het-va-tinh-chat` (Quan hệ chia hết và tính chất)

## Trạng thái
- Đang soạn (`status: draft`). Chưa review, chưa duyệt: một reviewer mới làm bước đó.
- Soạn đêm 01/10/2026 thay cho buổi hỏi đáp đầu vào vì chủ dự án đang ngủ; các giả định ở mục "Giả định".

## Nguồn (sách bài tập, `sources/math/quan-he-chia-het-va-tinh-chat/`, không commit)
- Đề: tr.30–32 in (PDF 31–33), tệp `sbt-p30.png` tới `sbt-p32.png`. Bài 9 "Dấu hiệu chia hết" bắt đầu ở tr.33.
- Lời giải: tr.104 (phần dưới, câu 2.1–2.6) và tr.105 (câu 2.7–2.11), tệp `sbt-p104.png`, `sbt-p105.png`. Nhập bằng `pnpm sources:import <pdf> --pages 30-32 (rồi 104-105) --subject math --series kntt --slug quan-he-chia-het-va-tinh-chat --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 8. Quan hệ chia hết và tính chất".
- Nội dung nguồn: kiến thức (a = k · b; ước, bội; tính chất của tổng), 2 ví dụ, câu 2.1–2.11.
- Đáp án câu 2.5 trong sách chỉ ghi ý a); ý b) tự tính: 1 930 + 100 + 2 021 không chia hết cho 5 vì 2 021 không chia hết cho 5.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia và chưa viết được kí hiệu tập hợp: bài bắc thang từ "chia đều không thừa" (kẹo, túi), kiểm bằng bảng nhân hay phép chia có dư, chưa dùng kí hiệu ∈ ∉ hay tập hợp.
- Kí hiệu chia hết viết trong công thức bằng `\chiahet` và `\khongchiahet` (hai macro TeX trong `src/lib/tex.ts`), lint tính được mệnh đề chia hết.
- Tính chất của hiệu (sách có ở "Kĩ năng" và câu 2.7) dạy cùng cách với tổng.
- Quy ước "a · b là a được lấy b lần" của Bài 5 giữ nguyên.
- Lời đọc và video để sau khi bài được duyệt (đúng quy trình), chưa làm.

## Kế hoạch
Xem danh sách section ở `lesson.json`; làm theo thứ tự: nội dung, visual (`src/visuals/math/quan-he-chia-het-va-tinh-chat/`), kiểm tự động, walk, commit.

## Việc đã làm
- Nạp nguồn, đọc trang, chốt cấu trúc.

## Việc tiếp theo
1. Viết `lesson.json` (khung, section, bài tập) và hình.
2. `pnpm content:check --stats` sạch, `pnpm visual:shot`, `pnpm lesson:walk` (`WALK_BASE_URL=http://localhost:3001`).
3. Gate rồi commit. Sau đó reviewer mới (Opus) review vòng 1.
