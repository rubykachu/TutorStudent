# Bàn giao: Bài 9 `dau-hieu-chia-het` (Dấu hiệu chia hết)

## Trạng thái
- Cập nhật cuối: 01/10/2026, tác giả đã sửa xong review vòng 2 (2 Nghiêm trọng, 22 Nên sửa, phần lớn Góp ý). Chờ vòng 3 (chỉ phần đổi, `pnpm content:diff dau-hieu-chia-het`, 1 Reviewer `sonnet`). `status: draft`; chưa duyệt, chưa khoá id, chưa có lời đọc hay video.
- Vòng 2 đã sửa: Nghiêm trọng 1 (câu quy tắc `luy-thua-10` chỉ nói cộng số có một chữ số; recap hình `tom-tat-10-3` thêm hàng 10³ + 1), Nghiêm trọng 2 (số điểm báo sai ghi rõ "Báo 29 / 31 điểm: chắc chắn tính sai", điểm cả bài ghi kết quả 36 và 9). Nên sửa 1–22 đều làm trừ phần ghi ở "Mục không làm". Góp ý đã làm: 1 (một phần), 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21.
- Mã chung đã sửa: `NumberStepper` nhận `value` trống ("?" tới lần bấm đầu, dấu trạng thái đọc là `min - 1`) cho ô chữ số của câu `manipulate`; `Bags` có `plainBagCount` và chỉ hiện "Còn thừa" khi còn thừa; `Row` có `muted` và `tex` rỗng (chỉ còn nhãn); ô chữ số `so-cuoi-*` canh giữa.
- Màu: glossary "tổng các chữ số" đổi amber thành lime (term riêng của bài này) để không trùng "tích" (amber, dùng chung Bài 8) và số túi (nay không tô màu).
- Id đổi ở vòng 2 (bài còn draft): câu `tong-7316`→`tong-7036`, `chon-3-5-2715`→`chon-3-5-345`, `tong-18-chia-het-9`→`tong-27-chia-het-9`, `dien-9-7308`→`dien-9-3105`, `mua-but-45`→`mua-vo-45`, `lap-so-045`→`lap-so-037`, `diem-mai-83`→`diem-nam-83`, `diem-nhieu-9`→`diem-nhieu-12`; hình `giai-cong-7316`→`giai-cong-7036`, `giai-banh-48`→`giai-banh-60`, `tong-1746-9`→`tong-5976-9`, `tong-10-4-8`→`tong-10-2-4`. Thêm hình `goi-y-nhom-it-nhat`, `goi-y-107-9`.
- Đã chạy: `content:check` 0 lỗi, `visual:shot` 162/162 và đã xem ảnh các hình đổi (điện thoại, iPad cho `so-cuoi-2`), `lesson:walk` 0 lỗi (trên bản sao `git worktree` ở cổng 3100 vì cổng 3001 của chủ dự án giữ máy chủ), gate đạt.
- Mục không làm (vòng 2):
  - Nên sửa 2, đổi màu `concept.tich`: glossary buộc "Tích" màu amber (chung Bài 8); đổi màu "tổng các chữ số" sang lime và bỏ tô số túi thay vào đó.
  - Nên sửa 3, hình `goi-y-9816-2`: hình là hàng ô chữ số của chính số 9 816 nên đã cho thấy số đang xét; chỉ sửa `goi-y-cong-4152` (thêm dòng "4 152").
  - Góp ý 1, `tom-tat-2439-9` vẫn có tổng 18: đổi các câu và hình `tong-5976-9` sang tổng 27 và 9 đã phá thói quen "tổng 18"; recap giữ một số quen.
  - Góp ý 10, chữ số mũ nhỏ ở chip và `fillBlank`: cần chip và câu điền nhận TeX (giao diện chung), ngoài phạm vi bài này.
  - Góp ý 17, nấc 1 tô cả hai khối đề ở câu bút và vở: đề là câu chữ, tô một khối hay hai khối đều là cả đề; muốn tô trúng chỗ phải thêm khối `formula` có `\htmlId`, làm đề hiện đại số không có trong sách.
- Mục không làm (vòng 1, giữ nguyên):
  - Nên sửa 9, phần lựa chọn chữ và caption `xet-2136`: khoảng cách U+202F ở chữ thường do bộ vẽ văn bản chung của app, ngoài phạm vi chip; chip đã sửa.
  - Góp ý 9: đưa `chia-3-5-45`, `gop-tien-25-32` vào `practiceIds` làm vỡ luật mỗi card đúng một câu luyện; thay vào đó `gop-tien-25-32` đã viết rõ.
  - Nên sửa 10: không thêm câu "không có thừa số thì tính tích" vào câu quy tắc (dạy ngoài sách, ép trẻ yếu nhân); chỉ thêm vào note màn chạm, nhiễu đổi sang tích nhỏ, `chon-tich-4` đổi số chia thành 2.
  - Nên sửa 21: thêm ví dụ 0, 3, 5 ở màn mới (`lap-035`) thay vì hạ độ khó câu `lap-so-045`.
- Lịch sử vòng 1: cả 5 Nghiêm trọng đã sửa (khoảng "9 đến 45" và nhãn `bang-chin`; lý do 18 ở `tim-38a`, ví dụ `tom-tat-tim-58c`; câu quy tắc `tim-chu-so` theo dấu hiệu đề cho; `xep-1530` và `xep-tong-3410` thành chuỗi phụ thuộc). Id đổi ở vòng 1: `tong-2431`→`tong-574`, `tong-12-chia-het-3`→`tong-15-chia-het-3`, `chon-tich-4`→`chon-tich-2`, `dien-10-7`→`dien-10-5`, `diem-mai-75`→`diem-mai-83`, `xep-lap-235`→`xep-lap-375`; hình `chon-3-1524`→`chon-3-1410`, `tom-tat-3204-3`→`tom-tat-3207-3`, `tom-tat-tim-26c`→`tom-tat-tim-58c`; thêm câu `hop-bi-102`, hình `tien-135-5`, `lap-035`, `goi-y-hieu-3460-1213`, `goi-y-7062-9`.
- Lý do ưu tiên: lớp của bé đang học bài này.

## Việc tiếp theo (làm đúng thứ tự)
- Đang ở: vòng 2 xong (review.md ghi 2 Nghiêm trọng, 22 Nên sửa, 21 Góp ý) và tác giả đã sửa; `lesson.json` đổi sau bản đã review. Chưa có vòng 3.
- Vòng kế: vòng 3 chỉ soát phần đổi (`pnpm content:diff`, 1 Reviewer `sonnet`); cách walk như dưới. (Mô tả vòng 2, đã xong: soát TOÀN BÀI (theo skill lesson-review): `pnpm content:check`; walk bằng `git worktree add --detach /private/tmp/tutor-wt HEAD` + `pnpm install` + `pnpm lesson:walk dau-hieu-chia-het` (tự dựng máy chủ cổng 3100 có bản nháp), chép `.shots/walk/dau-hieu-chia-het` về cây chính, gỡ worktree; mở 3 Reviewer `model: "opus"` song song (section 1-5, 6-10, 11-14; ghi `.shots/review/dau-hieu-chia-het/nhom-<n>.md`) rồi 1 Tổng hợp `opus`; mục trọng tâm: id/hình mới (`hop-bi-102`, `tien-135-5`, `lap-035`, `goi-y-*`), chuỗi phụ thuộc của `xep-1530`, `xep-tong-3410`, câu quy tắc `tim-chu-so` khớp recap, nhẩm tối đa 2 phép.)
- Commit `lesson.json` + `review.md` + lessons-learned trước khi sửa. Từ vòng 3 chỉ phần đổi (`pnpm content:diff`, 1 Reviewer `sonnet`).
- Khi 0 Nghiêm trọng: `pnpm content:hash dau-hieu-chia-het --approve`, `pnpm content:lock`, `content:check` 0 lỗi, walk 0 failure, gate, `CONTENT_INCLUDE_DRAFT=1 pnpm content:emit` ở cây chính, commit đường dẫn của mình, cập nhật `notebooks/backlogs/index.md` (Bài 9 đã xuất bản; kế tiếp lời đọc và video).

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
- Lời đọc tổng quan và video để sau, theo yêu cầu của chủ dự án.

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
- Chưa làm: lời đọc tổng quan, video, review, khoá id.

## Sửa sau review vòng 3 (01/10/2026)
- Nghiêm trọng 1: note `ba-khac-chin` trả về câu "3 khác 9" (Số 2 415 có tổng 12); dòng lý do "Làm vậy giúp bạn biết..." chuyển sang note màn chạm `chon-3-1410`. Chữ cũ bị bỏ ("Chạm vào ... Làm vậy giúp bạn...") không còn ở màn tĩnh, đã đọc `pnpm content:diff`.
- Nên sửa 1: id đổi `tong-7036` -> `tong-9031` (đáp án 13), hình `giai-cong-7036` -> `giai-cong-9031`.
- Nên sửa 2: id đổi `tong-27-chia-het-9` -> `tong-25-chia-het-9` (số 5 884, tổng 25); `checkIds` của `chia-het-9` cập nhật.
- Nên sửa 3: id đổi `lap-so-037` -> `lap-so-014` (chữ số 0, 1, 4; đáp án 3: 140, 410, 104). Đề xuất của review (0, 2, 4, đáp án 5) đếm sai, thực tế chỉ có 4 số (204, 240, 402, 420) và mọi số đều chẵn nên luật chia hết không thử; bộ 0, 1, 4 thử cả hai luật (014 bị loại vì 0 đứng đầu, 041 và 401 lẻ).
- Góp ý đã sửa: 1 (nhãn `giai-banh-56` sang slate), 2 (`10⁶ + 2`, `10³ + 4`), 3 (`goi-y-107-9` thành hình `lines`), 4 (`hop-banh-tui` 7 hộp, mỗi hộp 8, túi 4, đáp án 14; hình `giai-banh-60` -> `giai-banh-56`), 5, 6. Bỏ Góp ý 7 (đổi màu `concept.thua-so`: review ghi "nếu muốn chặt hơn", hai nghĩa nằm ở hai section khác nhau).
- Ids chưa khoá (`content:lock` chưa chạy) nên đổi id không cần retire.
