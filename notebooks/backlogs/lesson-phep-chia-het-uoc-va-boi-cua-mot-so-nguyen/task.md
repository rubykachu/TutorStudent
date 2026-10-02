# Bàn giao: Bài 17 `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` (Phép chia hết. Ước và bội của một số nguyên)

## Trạng thái
- Cập nhật cuối: 02/10/2026. Bài đã duyệt và xuất bản (`published`): review vòng 1, 2 (Opus), 3, 4 (Sonnet) hết Nghiêm trọng; Haiku đọc hiểu 4 lượt; `content:hash --approve`, `content:lock` (103 id), `content:emit` đã chạy. `content:check` của bài 0 lỗi, `visual:shot` 100/100, `lesson:walk` 0 failures 0 cảnh báo, `typecheck` và `biome check` đạt.
- Việc còn lại:
  1. [Xong 02/10/2026, review vòng 6; còn Nên sửa: câu cùng dấu mới bị Haiku gắn "Hiểu mơ hồ" ở cụm "chia hai phần số tự nhiên", xem `review.md`] Khớp Bài 16 `phep-nhan-so-nguyen` khi Bài 16 xuất bản (Bài 16 còn `draft` lúc duyệt Bài 17). Câu khác dấu của hai bài đã cùng mẫu, màu số dương lime và số âm pink khớp. Còn lệch ở câu cùng dấu của Bài 17 ("số nguyên" thừa, đuôi "cho nhau" thừa so với Bài 16): đổi thành "Hai số khác 0 cùng dấu thì thương là số dương: chia hai phần số tự nhiên." ở note quy tắc, recap, card của section `chia-cung-dau`. Chữ đổi thì chạy `content:diff`, Haiku đọc hiểu mục đổi, một vòng review chỉ phần đổi, `content:hash --approve`.
  2. Nên sửa chưa xử lý (review.md, vòng 4): 2 (số trùng ở mẹo "Kiểm tra phép chia" và `ex.tinh-khac-dau-48`, `ex.tinh-48-chia-8`), 3 (`ex.chon-boi-cua-4` trùng hình), 7 (nấc 1 của các câu điền chỉ tô dòng hướng dẫn), 8 (section `suy-ra-thuong` thiếu ví dụ đời sống), 9 (`chon-tong-6-chips` cùng khuôn hình quy tắc), 10 (chip nhiễu "5 · 5", "7 · 7"), 11 (chiều ngược của quy tắc `tim-x`), cùng các Góp ý.
  3. Lời đọc và video: đã dựng (02/10/2026), giọng `hai-dang` (xen kẽ với Bài 16 dùng `my-duyen`). Ba video `dau-cua-thuong` (đầu phần `chia-cung-dau`, clip hai card cùng và khác dấu), `chia-het-so-nguyen` (đầu phần `phep-chia-het`), `uoc-cua-6` (đầu phần `tim-uoc`). Lời đọc giới thiệu bị Gemini hết hạn mức nên đọc cả bài bằng VieNeu Hải Đăng (`overview.narration.voice`); chạy lại `pnpm narration:build` khi hạn mức hồi để về giọng Gemini. Review vòng 5 (Sonnet, chỉ video và lời đọc): 0 Nghiêm trọng, Góp ý trong `review.md`. Nếu đổi câu quy tắc của phần `chia-cung-dau` theo Bài 16 (mục 1) thì sửa luôn câu `rule` trong `dau-cua-thuong/script.json` cho khớp.
- Đọc hiểu: lượt 1 quá nhiễu bị bỏ; Haiku không phủ `options` và `hints`.

## Nguồn (sách bài tập, `sources/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/`, không commit)
- Đề: tr.58–59 in (PDF 59–60), tệp `sbt-p58.png`, `sbt-p59.png`. Tr.60 là "Ôn tập chương III", không thuộc bài này.
- Lời giải: tr.113 in (PDF 114), tệp `sbt-p113.png`, mục "Bài 17" (3.36 đến 3.40). Sách không in đáp án câu 3.35; đáp án câu này do người soạn tự tính.
- Nhập bằng `pnpm sources:import /Users/minhtang/Documents/MyLe/NhaKy/Toan6-tap1.pdf --pages 58-59 (rồi 113-113) --subject math --series kntt --slug phep-chia-het-uoc-va-boi-cua-mot-so-nguyen --book sbt --offset 1`.
- Chương III "Số nguyên"; `number: 17`, `order: 17`.
- Nội dung nguồn: kiến thức cần nhớ 1 (phép chia hết, dấu của thương), 2 (ước và bội, ước chung), 3 (cách tìm ước và bội); ví dụ 1 (bốn phép chia từ một phép), ví dụ 2 (phân tích 6 thành tích); bài 3.35 đến 3.40.

## Giả định (chủ dự án vắng, không hỏi được)
- Nguồn là sách bài tập, trang đáp án tr.113. Số trong bài tự chọn nhỏ hơn số của sách (bé học chậm, số nhỏ tính nhẩm được).
- Bài 3.38 (tập hợp P viết bằng dấu `{x ∈ ℤ | …}`) dạy bằng lời ("các số nguyên chia hết cho 3, lớn hơn −18 và không lớn hơn 18"), vì bé chưa viết được kí hiệu tập hợp (`docs/learner.md`).
- Số 0: dạy "0 chia cho số khác 0 bằng 0" và "không chia cho 0" (suy ra từ b ≠ 0 và a = b·q của sách); không đề cập ước của 0.
- Mẹo chỉ viết khi đúng với mọi số thuộc dạng bài (đã thử bằng chương trình tạm, không commit): xem mục "Mẹo".
- Quy tắc dấu của thương viết bằng lời của bài này, cùng màu với Bài 14 (số dương lime, số âm pink); chờ khớp với Bài 16.

## Cấu trúc bài
12 phần, mỗi phần một ý, mỗi phần có một thẻ cùng tên:
1. `phep-chia-het` Phép chia hết của số nguyên (a = b · q; số 0 trong phép chia).
2. `chia-cung-dau` Chia hai số cùng dấu (nhiệt độ giảm đều; thương dương).
3. `chia-khac-dau` Chia hai số khác dấu (chia đều khoản nợ; thương âm).
4. `suy-ra-thuong` Bốn phép chia từ một phép chia (ví dụ 1; mẹo "Dấu của thương", mẹo "Kiểm tra phép chia").
5. `uoc-va-boi` Ước và bội của số nguyên (cùng câu với Bài 8; mẹo "Chia hết cho số âm").
6. `tim-uoc` Tìm các ước (ước dương rồi số đối; mẹo "Kiểm tra số ước").
7. `tim-boi` Tìm các bội.
8. `boi-trong-khoang` Bội trong một khoảng (bài 3.37, 3.38 dạy bằng lời; thang máy dừng ở các tầng).
9. `uoc-chung` Ước chung của hai số nguyên (cùng câu với Bài 11).
10. `phan-tich-thanh-tich` Phân tích một số thành tích (ví dụ 2, bài 3.39).
11. `tong-hieu-chia-het` Tổng và hiệu cùng chia hết (tính chất ở bài 3.40).
12. `tim-x` Tìm x để x + a chia hết cho x (bài 3.40).
- Màu khái niệm: số nguyên dương lime, số nguyên âm pink, số bị chia blue, số chia violet, thương amber, ước violet, bội blue, ước chung teal (cùng glossary, Bài 8, 11, 14). Nhãn tên bước làm trong hình dùng teal (hình năm cạnh), không đứng chung hình với ước chung.
- Hình: `src/visuals/math/phep-chia-het-uoc-va-boi-cua-mot-so-nguyen/` (`catalog.ts`: mỗi hình một dòng dữ liệu `rows`, `lines`, `line`, `chips`; `chips` dùng validator `chon-dung` của Bài 15; màn "Cùng làm" có `wants` nên chấm ngay, câu luyện không có `wants` nên chấm khi bấm "Kiểm tra").
- Mẹo (đã thử bằng chương trình tạm, không commit): `dem-dau-tru` (1044 phép chia hết, a, b khác 0), `kiem-tra-bang-nhan` (1164 phép chia hết, kể cả số bị chia 0; một thương sai luôn lệch), `bo-dau-xet-chia-het` (14520 cặp, kể cả a = 0), `so-uoc-chan` (1000 số nguyên khác 0 từ −500 đến 500). Quy tắc phần 12 thử trên 19360 cặp (x, a); quy tắc phần 11 trên 46328 bộ (a, b, c).

## Việc khớp với Bài 16
- Khi Bài 16 `phep-nhan-so-nguyen` xuất bản: đọc câu quy tắc dấu của phép nhân và màu khái niệm của nó, so với câu quy tắc dấu của thương ở các phần 2, 3, 4 của bài này; sửa bài này theo Bài 16 (chữ đổi thì chạy `content:diff`, Haiku đọc hiểu mục đổi, một vòng review chỉ phần đổi, `content:hash --approve`).
