# Review: Quan hệ chia hết và tính chất (`quan-he-chia-het-va-tinh-chat`)

- Bài: `content/math/kntt/quan-he-chia-het-va-tinh-chat/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: `ky-hieu`, `kiem-tra`, `uoc-boi`, `tim-uoc`, `tim-boi`, `tong-chia-het`, `tong-khong-chia-het`, `hieu-chia-het`, `hieu-khong-chia-het`, `tim-x`, `so-du`, `nhom-so-hang` (và `chia-deu` cho câu `tinh-thua-26-6`)
- Nguồn đã đọc: `sources/math/quan-he-chia-het-va-tinh-chat/` - sbt-p30 (mục A ý 1-4, b ≠ 0)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (103 id chưa khoá, đúng với bài draft)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quan-he-chia-het-va-tinh-chat/`; thêm `pnpm visual:shot` 152/152 pass để xem hình gợi ý nấc 2 và `chon-tong-5`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `8daadff18c7683c45c7b20e3e5d28266fc81fb5613c3e5730ac97e308bd78d76` (`pnpm content:diff` so với bản này)

Ba Nghiêm trọng vòng 2 đã sửa đúng: note `tim-uoc` "Mọi số khác 0 đều có ước là 1 và ước là chính nó. Ví dụ 30 có ước 1 và ước 30." (ảnh `phone/056`); note `uoc-boi` "Trong một phép nhân, mỗi thừa số là một ước của tích" đúng cả với 16 = 4 · 4; ví dụ 52 quyển vở xếp thành các chồng 4 quyển được 13 chồng khớp quy ước m · n với hình `chia-du-52-4` (`52 = 4 · 13`, `53 = 4 · 13 + 1`, ảnh `phone/033`). Note, recap section và recap card của cả 13 section vẫn khớp nguyên văn (đã chạy script so). Id đổi tên (`chon-uoc-10`, `chon-nhieu-chia-het-7`, `chon-nhieu-uoc-14`, `dien-tong-7`, `du-tong-30-4`) và hình bỏ (`xet-tung-so-hang`, `hieu-24-12-6`, `chia-tui-goi-y-17-5`, `dem-cach-goi-y-7-38`, `hieu-goi-y-20-7`, `nhom-goi-y-10`) không còn tham chiếu trong `src/`, `content/`, `tests/`, `scripts/`. Đã tự giải các câu mới và đổi: `chon-nhieu-chia-het-8` (32, 48), `chon-goi-9-63` (chỉ "Ước của 63"), `tim-uoc-10` (5), `chon-nhieu-boi-6` (12, 18), `chon-tong-9` (18 + 27), `dien-tong-4`, `tong-30-4` (a), `chon-hieu-khong-9` (45 − 20), `tim-x-nho-nhat-18-24` (6), `dien-du-20-6` (không chia hết), `chon-nhieu-tong-mu-5` (9 + 9², 9² + 9³), `chon-nhieu-hieu-khong-4`, `doc-42-7`: đều đúng và duy nhất, trừ câu ở mục Nghiêm trọng 1. Hình gợi ý nấc 2 mới (`chia-tui-goi-y-19-5` dư 4, `dem-cach-goi-y-7-37` dư 2, `hieu-goi-y-22-8`, `nhom-goi-y-2`) dừng ở "?" và không trùng đáp án đề; `hieu-36-12-6` hiện số trừ 12, hiệu 24 tách bạch; chấm 0 của `tim-boi-4` cùng màu "Bội".

## Nghiêm trọng

### 1. `chon-nhieu-uoc-22` hỏi "ước của 14" nhưng đáp án và lựa chọn là của 22

- Vị trí: `$.exercises[19]` (`ex.chon-nhieu-uoc-22`, card `uoc-boi`; `prompt[0].text`, `options`, `answer`) - LL-17
- Nguồn: tr.30 (`sbt-p30.png`, mục A ý 2)
- Vấn đề: bản sửa đổi lựa chọn c từ 7 sang 11 (để tránh trùng câu khác) và đổi id sang 22, nhưng đề vẫn là "Chọn tất cả ước của 14." Lựa chọn 3, 2, 11, 4 với đáp án b, c (2 và 11): 11 không là ước của 14, còn 7 (ước thật của 14) không có trong lựa chọn. Trẻ làm đúng (chọn 2, không chọn 11) bị báo sai, trẻ chọn 11 được báo đúng. Không có `check` nên máy không bắt.
- Sửa: đổi đề thành "Chọn tất cả ước của 22." (ước 1, 2, 11, 22; đáp án b, c giữ nguyên, nhiễu 3 và 4 hợp lý, không trùng `xep-uoc-14` ở section `tim-uoc`).

## Nên sửa

### 1. Note "Trong một phép nhân, mỗi thừa số là một ước của tích" chưa loại thừa số 0

- Vị trí: `$.sections[3].blocks[2].children[0].text` (`section.uoc-boi`, `phone/042-s4-03-block.png`) - LL-17
- Nguồn: tr.30 (b ≠ 0)
- Vấn đề: với 0 · 5 = 0, thừa số 0 không là ước của 0, cùng điểm "khác 0" mà vòng 2 đã chặn ở câu "luôn là ước". Không màn hay câu nào dẫn trẻ tới thừa số 0 và quy tắc `tim-uoc` ngay sau đã nói "số khác 0", nên xếp Nên sửa.
- Sửa: "Trong một phép nhân, mỗi thừa số khác 0 là một ước của tích. ..." hoặc "Trong một tích khác 0, mỗi thừa số là một ước của tích."

### 2. Hai câu ở section `tong-khong-chia-het` cùng khuôn, cùng số chia 6

- Vị trí: `$.exercises` `ex.tong-24-10` (câu kiểm tra) và `ex.tong-30-4` (card `tong-khong-chia-het`) - LL-07
- Nguồn: —
- Vấn đề: cùng đề "Tổng a + b có chia hết cho 6 không?", cùng ba lựa chọn, đáp án đều là "Không, vì [số hạng nhỏ] không chia hết cho 6"; làm xong câu này, trẻ gõ lại đúng khuôn câu kia mà không cần xét lại. Số không trùng hình hay recap nên không chặn.
- Sửa: đổi số chia ở `tong-30-4`, vd "Tổng 35 + 4 có chia hết cho 7 không?" với 35 chia hết cho 7, 4 không chia hết cho 7.

## Góp ý

### 1. Id `ex.dien-du-20-6` không còn khớp số của câu

- Vị trí: `$.exercises` `ex.dien-du-20-6` (nay là 14 · q + 3, chia cho 7) - LL-15
- Nguồn: —
- Vấn đề: id theo số cũ 20 và 6, câu nay dùng 14, 7 và 3; các id khác đã đổi theo số. Id chưa khoá nên đổi được.
- Sửa: đổi thành `ex.dien-du-14-7` (chưa khoá id), cập nhật tham chiếu nếu có.
