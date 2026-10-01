# Bàn giao: Bài 9 `dau-hieu-chia-het` (Dấu hiệu chia hết)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Bài đã `published`: review 4 vòng (vòng 1: 5 Nghiêm trọng; vòng 2: 2; vòng 3: 1; vòng 4: 0, 1 Nên sửa đã sửa, 4 Góp ý để lại trong `review.md`), `content:hash --approve`, `content:lock` (115 id đã khoá), `content:check` 0 lỗi, `lesson:walk` 0 failure, gate đạt, `content:emit` bản có nháp đã chạy. Từ giờ id không đổi.
- Id đã đổi trong lúc review (trước khi khoá) và mục không làm của các vòng: xem mục "Sửa sau review vòng 3" và lịch sử git của tệp này.
- Đã làm (01/10/2026): lời đọc tổng quan và 3 video (mục "Lời đọc và video"). Chưa review phần đổi, chưa khoá 3 id video.

## Việc tiếp theo
- Vòng review chỉ phần đổi (subagent mới, `model: "sonnet"`, skill `lesson-review`): diff của `lesson.json` chỉ có `overview.narration`, 3 khối video đầu phần và `videos[]`; soát lời dẫn, chuyển cảnh, số, clip theo card. Rồi `pnpm content:hash --approve`, `pnpm content:lock` (khoá 3 id video; hiện từ chối vì `[review-hash]`), `pnpm lesson:walk dau-hieu-chia-het` (chạy trên `git worktree` cổng 3100, liên kết `public/media/` vào đó), sau đó lưu trữ thư mục này theo luật `.claude/rules/agents.md`.

## Nguồn (sách bài tập, `sources/math/dau-hieu-chia-het/`, không commit)
- Đề: tr.33–34 in (PDF 34–35), tệp `sbt-p33.png`, `sbt-p34.png`. Bài 10 "Số nguyên tố" bắt đầu ở tr.35.
- Lời giải: tr.105 (nửa dưới, câu 2.12–2.20) và tr.106 (đầu trang, câu 2.21–2.22), tệp `sbt-p105.png`, `sbt-p106.png`.
- Nhập bằng `pnpm sources:import <pdf> --pages 33-34 (rồi 105-106) --subject math --series kntt --slug dau-hieu-chia-het --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 9. Dấu hiệu chia hết".
- Nội dung nguồn: dấu hiệu chia hết cho 2, 5, 9, 3; kĩ năng (tích có một thừa số chia hết cho m, tổng và hiệu); ví dụ 1 (thay chữ bằng chữ số, phép nhân với 9), ví dụ 2 (điểm trắc nghiệm chia hết cho 3); câu 2.12–2.22.

## Giả định (không hỏi được chủ dự án)
- Trẻ yếu nhân chia: mỗi dấu hiệu dạy từ dễ tới khó (chữ số tận cùng, cộng lần lượt các chữ số, rồi mới xét chia hết), ví dụ đời sống (bi, tờ tiền, hộp bánh, nhóm bạn, điểm bài thi).
- Dùng lại kí hiệu `\chiahet`, `\khongchiahet` và quy ước "a · b là a được lấy b lần" của Bài 8 và Bài 5.
- Số trong bài tự chọn, không dùng số của sách (câu 2.12–2.22 và hai ví dụ chỉ giữ dạng bài). Câu 2.21–2.22 (luỹ thừa của 10 cộng một số) làm với 10 mũ nhỏ (10⁴, 10⁵) để khỏi số 13 chữ số.
- Không nêu "số chẵn, số lẻ" (sách không dùng từ này).
- Lời đọc tổng quan và video: đã làm sau (mục "Lời đọc và video").

## Cấu trúc bài (14 section, 14 card, 79 bài tập, 75 hình)
1 `chia-het-2` (chữ số tận cùng, túi bi, bảng chữ số cuối, thử chữ số ô trống); 2 `chia-het-5` (tờ 5 nghìn đồng); 3 `chia-het-2-5` (chữ số tận cùng 0); 4 `tong-chu-so` (cộng lần lượt các chữ số, bước đệm cho 3 và 9); 5 `chia-het-9` (bảng chín); 6 `chia-het-3` (3 khác 9); 7 `cho-hai-so` (câu 2.12–2.14); 8 `tich-chia-het` (kĩ năng "tích có một thừa số chia hết"); 9 `tong-hieu` (câu 2.15–2.16, chỉ dùng cặp số mà ít nhất một số chia hết, vì tính chất của tổng, hiệu ở Bài 8 không nói về hai số đều không chia hết); 10 `luy-thua-10` (câu 2.21–2.22); 11 `tim-chu-so` (câu 2.19 và ví dụ 1); 12 `diem-thi` (ví dụ 2); 13 `but-vo` (câu 2.20); 14 `lap-so` (câu 2.18). Câu 2.17 là câu "nhóm ít nhất" ở `chia-het-2-5`.
Hình: `src/visuals/math/dau-hieu-chia-het/` (danh mục `catalog.ts`: mỗi hình một dòng dữ liệu; loại hình dùng chung `bags`, `rows`, `lines`, `chips` nay ở `src/visuals/shared/`).
Khái niệm mới trong `content/glossary/math.json`: "chữ số tận cùng" (teal), "tổng các chữ số" (amber), "dấu hiệu chia hết".

## Kiểm tra đã chạy (01/10/2026)
- `pnpm content:check --stats`: 0 lỗi, không cảnh báo `[guides]` của bài (còn cảnh báo "id chưa khoá", đúng vì bài draft); mọi dòng tiêu chí PASS (14 section, 14 card, 81 bài tập, 6 dạng, 20 hình tương tác).
- `pnpm visual:shot`: 150/150 đạt; đã xem ảnh điện thoại (mọi hình) và iPad (mẫu).
- `pnpm lesson:walk`: 0 lỗi, 0 cảnh báo; đã xem ảnh điện thoại và mẫu iPad dọc, ngang. Máy chủ của chủ dự án (cổng 3001) không nạp bài mới nên walk chạy trên bản sao `git worktree` ở cổng 3100 (đã xoá).
- Gate: format, lint, typecheck, test (1 812) đạt.

## Thay đổi ngoài nội dung bài
- Chuyển từ Bài 8 sang `src/visuals/shared/`: `formula-rows.tsx` (Row, FormulaRow, Rows, Lines), `bag-groups.tsx` (Bags, BagBox, DotBlock, packBags), `pick-chips.tsx` (Chips); Bài 8 import từ đó.
- Hình mới của bài: `digits`, `endDigits`, `digitSum`, `digitBox` (có validator `chia-het`), sticker huy chương.

## Để reviewer soi kĩ
- Mọi đáp án và nhiễu của câu chọn số (đã tính bằng chương trình khi dựng, nên tập trung vào lời đề): LL-01, LL-10.
- Section `tong-hieu` chỉ dùng cặp số mà ít nhất một số chia hết, vì Bài 8 không dạy trường hợp hai số đều không chia hết; kiểm không có câu nào rơi vào trường hợp đó.
- `luy-thua-10` không có tình huống đời sống tự nhiên (câu 2.21–2.22 thuần số); `nhan-9-ab`, `mua-vo-65`, `hop-banh-tui` có 3 phép tính nhẩm (độ khó 3, có hình lời giải): LL-18.
- Câu quy tắc của `chia-het-2/5/9/3`, `cho-hai-so`, `tich-chia-het` nêu hai chiều của dấu hiệu bằng hai câu; `cho-hai-so`, `tich-chia-het`, `diem-thi`, `but-vo`, `lap-so` là suy ra trực tiếp từ các dấu hiệu và tính chất của sách (LL-09).
- Chữ trong chip và công thức dùng U+202F cho số từ 4 chữ số; ở chip nhìn như liền nhau.

## Sửa sau review vòng 3 (01/10/2026)
- Nghiêm trọng 1: note `ba-khac-chin` trả về câu "3 khác 9" (Số 2 415 có tổng 12); dòng lý do "Làm vậy giúp bạn biết..." chuyển sang note màn chạm `chon-3-1410`. Chữ cũ bị bỏ ("Chạm vào ... Làm vậy giúp bạn...") không còn ở màn tĩnh, đã đọc `pnpm content:diff`.
- Nên sửa 1: id đổi `tong-7036` -> `tong-9031` (đáp án 13), hình `giai-cong-7036` -> `giai-cong-9031`.
- Nên sửa 2: id đổi `tong-27-chia-het-9` -> `tong-25-chia-het-9` (số 5 884, tổng 25); `checkIds` của `chia-het-9` cập nhật.
- Nên sửa 3: id đổi `lap-so-037` -> `lap-so-014` (chữ số 0, 1, 4; đáp án 3: 140, 410, 104). Đề xuất của review (0, 2, 4, đáp án 5) đếm sai, thực tế chỉ có 4 số (204, 240, 402, 420) và mọi số đều chẵn nên luật chia hết không thử; bộ 0, 1, 4 thử cả hai luật (014 bị loại vì 0 đứng đầu, 041 và 401 lẻ).
- Góp ý đã sửa: 1 (nhãn `giai-banh-56` sang slate), 2 (`10⁶ + 2`, `10³ + 4`), 3 (`goi-y-107-9` thành hình `lines`), 4 (`hop-banh-tui` 7 hộp, mỗi hộp 8, túi 4, đáp án 14; hình `giai-banh-60` -> `giai-banh-56`), 5, 6. Bỏ Góp ý 7 (đổi màu `concept.thua-so`: review ghi "nếu muốn chặt hơn", hai nghĩa nằm ở hai section khác nhau).
- Ids chưa khoá (`content:lock` chưa chạy) nên đổi id không cần retire.

## Lời đọc và video (01/10/2026)
- Giọng của bài: Hải Đăng (`video/projects/dau-hieu-chia-het/media.json`). Lý do: Bài 8 là Mỹ Duyên nên xen kẽ sang giọng kia; bài này nhiều bước thủ tục (chữ số tận cùng, cộng chữ số, tìm chữ số) nên hợp giọng nam đều, không có lý do riêng để giữ Mỹ Duyên.
- Lời đọc tổng quan: `pnpm narration:build dau-hieu-chia-het`, 47,7 giây, mọi câu Whisper khớp ≥ 98,3%.
- 3 video (`video/projects/dau-hieu-chia-het/<tên>/`), mỗi video đặt làm khối đầu của một phần:
  - `tan-cung` (63,4 giây) ở `chia-het-2`: chữ số tận cùng, dấu hiệu chia hết cho 2 rồi cho 5 (clip `chia-het-2`, `chia-het-5`).
  - `tong-chu-so` (66,6 giây) ở `chia-het-9`: tổng các chữ số, dấu hiệu chia hết cho 9 rồi cho 3, "3 khác 9" qua số 2 415 (clip `chia-het-9`, `chia-het-3`).
  - `tim-chu-so` (55,5 giây) ở `tim-chu-so`: tìm chữ số a của số 38a chia hết cho 9 (clip `tim-chu-so`).
- Câu quy tắc chép nguyên văn câu của `note` của bài (đánh `rule`); chữ trên màn không chứa câu quy tắc nên không có `data-rule-text`. Mỗi câu mở đầu gọi "bạn"; sau "Bạn cú ..." không có câu nào mở bằng "Bạn ..." mà làm chủ ngữ mơ hồ, trừ "Bạn nhớ nhé." ở cảnh cuối (không đứng ngay sau câu "Bạn cú ...").
- Whisper dưới 97% (đều là cách Whisper viết số, không phải đọc sai): "4 376" nghe thành "4376", "5 976" thành "5.976", "2 415" thành "2415" hay "2.415" (86–93%); câu mở đầu của `tong-chu-so` 96,1% (Whisper nghe "xét" thành "sẽ", nên nghe lại câu này khi duyệt).
- Hình: chỉ dùng lại kí hiệu "chia hết" ba chấm của Bài 8 và màu của bài (tận cùng teal ■, tổng các chữ số lime ✚), chữ số trong ô; đã xem khung hình từng 2 giây của cả ba video (không chồng chữ, chữ số hiện đúng lúc đọc, dải dưới trống).
- Chưa chạy `lesson:walk` (đợi review phần đổi rồi chạy một lần).
