# Bàn giao: Bài 11 `uoc-chung-uoc-chung-lon-nhat` (Ước chung. Ước chung lớn nhất)

## Trạng thái
- Cập nhật cuối: 01/10/2026. Bài `status: draft`, đã sửa xong theo review vòng 2 (Nghiêm trọng 1-4, Nên sửa 1-15, Góp ý trừ 14), chưa review vòng 3 (diff-only, Sonnet), chưa `content:hash --approve`, chưa `content:lock`, chưa có lời đọc tổng quan và video.
- Vòng 2 đã sửa: note màn chạm ƯCLN (20 và 24); section 5 tự diễn đạt lại định nghĩa số nguyên tố (note thường) và phân tích (rule duy nhất, recap một quy tắc); câu điền số hoàn hảo, câu rút gọn phân số có điều kiện số chia; một cách nói cho ước chung (section 10), quy tắc "các loại đồ vật", "số nhỏ nhất", hộp và túi mua trọn; bảng đổi số của Nên sửa 9 (đổi id, hình lời giải đồng bộ); bỏ màn `hh-28`; phản ví dụ 2/8 ở section phân số tối giản; glossary thêm "phân số tối giản", "số hoàn hảo".
- Màu khái niệm: ƯC teal, ƯCLN amber, số nguyên tố sky (khớp glossary), thừa số nguyên tố blue, số mũ violet, phân số tối giản pink; đồ vật, chấm dải băng, "Còn thừa" dùng slate, lime. Khái niệm "Phân số" và "Rút gọn phân số" bỏ (card phân số dùng "Phân số tối giản" để giữ dấu kiến thức nền tiểu học).
- Cố ý không làm: Góp ý 14 (câu số hoàn hảo đáp án "là" cần cộng 5 số hạng, quá 2 phép tính của LL-18). Note không viết "2/8" (lint cấm "số/số" trong chữ) nên câu về phân số của Mai viết bằng lời, phân số nằm ở khối công thức.
- Kiểm: `content:check` 0 lỗi của bài, `visual:shot` 150/150, `lesson:walk` 0 failure (điện thoại, iPad dọc, iPad ngang; đã xem sheet các section 2-6, 8-13), `lint`, `typecheck` đạt; `test` đạt trừ `tests/video/voices.test.ts` (thay đổi của việc khác trong cây).
- Việc kế tiếp: review vòng 3, rồi `content:lock`, lời đọc tổng quan và video (skill `lesson-video`). Việc căn chỉnh section 5 với bài Số nguyên tố sau khi bài đó xuất bản giữ nguyên như mục dưới.

## Nguồn (sách bài tập, `sources/math/uoc-chung-uoc-chung-lon-nhat/`, không commit)
- Đề: tr.38–40 in (PDF 39–41), tệp `sbt-p38.png`, `sbt-p39.png`, `sbt-p40.png`. Bài 12 "Bội chung. Bội chung nhỏ nhất" bắt đầu ở tr.41.
- Lời giải: tr.107 (từ giữa trang, câu 2.33–2.40) và tr.108 (đầu trang, câu 2.41–2.43), tệp `sbt-p107.png`, `sbt-p108.png`.
- Nhập bằng `pnpm sources:import <pdf> --pages 38-40 (rồi 107-108) --subject math --series kntt --slug uoc-chung-uoc-chung-lon-nhat --book sbt --offset 1`.
- Chương II "Tính chia hết trong tập hợp các số tự nhiên"; bài in là "Bài 11. Ước chung. Ước chung lớn nhất" (`number: 11`, `order: 11`).
- Nội dung nguồn: ước chung (ƯC), ước chung lớn nhất (ƯCLN), tìm ƯCLN bằng phân tích ra thừa số nguyên tố (3 bước), tìm ƯC qua ƯCLN; kiến thức bổ sung (kí hiệu (a, b), a = dm, b = dn với (m, n) = 1); kĩ năng (xác định ƯC, ƯCLN của hai hay ba số; dùng tính chất chia hết; nhận biết phân số tối giản và rút gọn); ví dụ 1 (số lớn nhất để ba số có cùng số dư), ví dụ 2 (chia đội nhiều nhất); câu 2.33–2.43.

## Giả định (không hỏi được chủ dự án)
- Số trong bài tự chọn, không dùng số của sách; chỉ giữ dạng bài.
- Trẻ yếu nhân chia: mở bằng việc cắt dải băng thành các đoạn bằng nhau và xếp đồ vật đều vào các đĩa, mỗi bước một ý, số nhỏ.
- Chưa dạy kí hiệu tập hợp để trẻ phải gõ: các danh sách ước chỉ để đọc và chạm chọn (hồ sơ người học: chưa viết được { }).
- Không dạy kiến thức bổ sung (a, b), a = dm, b = dn và câu 2.41–2.43 (cần chữ cái m, n trẻ chưa gặp) và ví dụ 1 (số dư bằng nhau, cần hiệu chia hết, đoán là nâng cao); ghi ở đây để chủ dự án quyết định có bổ sung sau.
- Phân số tối giản và rút gọn (câu 2.40) có một section cuối bài; trẻ đã biết phân số từ tiểu học nhưng chương phân số của lớp 6 chưa tới, nên section chỉ dùng phân số có tử, mẫu nhỏ và dạy luật "tối giản" từ ƯCLN.
- Số hoàn hảo (câu 2.38) có một section ngắn (luyện liệt kê ước); không dùng 496.

## Phụ thuộc Bài 10 (`so-nguyen-to`, đang soạn song song, chưa xuất bản)
- Phương pháp phân tích ra thừa số nguyên tố cần "số nguyên tố" và "phân tích ra thừa số nguyên tố". Bài này dạy tối thiểu tại chỗ ở một section nhắc lại (`nhac-thua-so`), không liên kết id hay nội dung của Bài 10, hình `ladder` là của riêng bài này.
- Việc bắt buộc sau khi Bài 10 xuất bản: chạy một vòng diff-only căn chỉnh section 5 (`nhac-thua-so`) với Bài 10: định nghĩa "số nguyên tố", cách viết phân tích, cách gọi "thừa số nguyên tố" và màu khái niệm (Bài 10 dùng màu sky cho "số nguyên tố"; ở đây số nguyên tố cũng sky, thừa số nguyên tố blue). Các review của Bài 11 đã xét section 5 tự thân, không đối chiếu bản nháp Bài 10.
- Khi Bài 10 xuất bản, đối chiếu: định nghĩa số nguyên tố, cách viết phân tích, cách gọi "thừa số nguyên tố", màu khái niệm; có thể bỏ section `nhac-thua-so` nếu trùng. Bài này không thêm term "số nguyên tố" vào `content/glossary/math.json`.

## Cấu trúc bài (12 section, 12 card, 60 bài tập, 75 hình)
1 `uoc-chung` (cắt dải băng thành các đoạn bằng nhau, hình tương tác `cutTry`); 2 `liet-ke-uc` (liệt kê ước từng số rồi chọn số chung); 3 `uoc-chung-lon-nhat` (định nghĩa, kí hiệu ƯC và ƯCLN); 4 `so-nho-chia-het` (số lớn chia hết cho số bé thì ƯCLN là số bé, câu 2.34); 5 `nhac-thua-so` (số nguyên tố và phân tích bằng cách chia dần, nhắc tối thiểu từ Bài 10); 6 `uclnn-phan-tich` (3 bước của sách, bảng số mũ); 7 `uclnn-ba-so`; 8 `uc-tu-uclnn` (ƯC là các ước của ƯCLN, câu 2.35); 9 `chia-deu-nhieu-nhat` (ví dụ 2, chia đều vào các đĩa); 10 `bai-toan-uc` (câu 2.37, 2.39); 11 `so-hoan-hao` (câu 2.38); 12 `phan-so-toi-gian` (câu 2.40). Câu 2.33 ở section 2, 2.36 ở section 1 và 3. Câu 2.41–2.43 và ví dụ 1 không làm (xem "Giả định").
Hình: `src/visuals/math/uoc-chung-uoc-chung-lon-nhat/` (danh mục `catalog.ts`: mỗi hình một dòng dữ liệu; loại hình dùng chung `rows`, `lines`, `chips` ở `src/visuals/shared/`; loại riêng của bài: `cutBars`, `cutTry`, `ucLists`, `ladder`, `expTable`, `plates`, `notation`, `sticker`). Hình tương tác: `cutTry` (validator `cat-vua-het` trong `logic.ts`) và `chips` (validator `chon-dung` dùng chung).
Khái niệm mới trong `content/glossary/math.json`: "ước chung" (teal), "ước chung lớn nhất" (amber), tên riêng "ƯC", "ƯCLN", "Ư" (hai thuật ngữ và tên riêng nằm trong commit của Bài 10 vì tệp dùng chung).

## Thay đổi ngoài nội dung bài
- `src/visuals/registry.ts`: thêm khối `commonEntries` và dòng `EXAMPLE_MODULES` của bài này (chỉ phần của bài, nằm sau khối của Bài 10).
- `scripts/lesson-walk.ts`: bỏ qua ký tự khoảng trắng độ rộng 0 mà KaTeX thêm vào công thức xếp chồng (phân số, `gathered`) khi đo chữ nhỏ; trước đó mỗi công thức như vậy báo "text below 16px: 1.0px".

## Để reviewer soi kĩ
- Đáp án và nhiễu: mọi số đã tính bằng chương trình khi dựng; tập trung vào lời đề (LL-01, LL-10), nhất là `hoan-hao-8`, `hoan-hao-12` (lựa chọn đều mở bằng "Có/Không"), `uc-la-uoc-cua`, `chon-uclnn-18-30` và các câu "nhiều nhất" (`dia-12-20`, `but-vo-20-30`) nơi một ước chung nhỏ hơn cũng thoả điều kiện chia đều.
- Section 12 dùng phân số (tử, mẫu, rút gọn) là kiến thức tiểu học không khai `prerequisite` trong glossary; xem có thuộc phạm vi bài không (LL-09), hay chuyển sang bài phân số sau.
- Section 5 lặp phần của Bài 10: so định nghĩa số nguyên tố, cách viết phân tích, màu (ở đây số nguyên tố sky như glossary, thừa số nguyên tố blue) sau khi Bài 10 xuất bản.
- Hình chia dần (`ladder`) và Bài 10 `sơ đồ cột` cùng ý; có thể gộp về `shared/` khi cả hai đã xuất bản.
- Section 11 không có ví dụ đời sống (số hoàn hảo thuần số, như `luy-thua-10` của Bài 9); câu mẫu 28 có 4 phép cộng nhưng chỉ trong hình từng bước.
- Câu `order` (`xep-uclnn-6-8`, `xep-chia-dan-18`, `xep-uclnn-12-30`) chỉ có một thứ tự đúng; kiểm lại.
- Chưa có lời đọc tổng quan nên `overview.narration` còn trống.

## Kiểm tra chưa làm
- `pnpm visual:shot` bản cuối sau khi sửa `plates` và `exp-table` (đã xem ảnh lần chụp trước và sheet walk, không có lỗi).
