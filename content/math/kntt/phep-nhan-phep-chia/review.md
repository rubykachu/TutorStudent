# Review: Phép nhân và phép chia số tự nhiên (`phep-nhan-phep-chia`)

- Bài: `content/math/kntt/phep-nhan-phep-chia/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: nhan-cong-lap, bang-nhan, ten-goi, giao-hoan, ket-hop, phan-phoi, nhan-gan-tron, nhan-mot-chu-so, nhan-hai-chu-so, uoc-luong, chia-het, chia-co-du, kiem-tra-chia, dat-tinh-chia, bai-toan-chia, tim-loi-sai
- Nguồn đã đọc: `sources/math/phep-nhan-phep-chia/` - sbt-p17, sbt-p20 (đối chiếu các mục đổi đã được vòng 2 khớp nguồn; vòng này không thêm kiến thức mới)
- `content:check`: 0 lỗi, 1 cảnh báo của bài (id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/phep-nhan-phep-chia/` (ipad, phone, ipad-landscape)
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `87555ec00677e26a95874142644f92eb6135822146e08018e3bed446ee8f8ccf` (`pnpm content:diff` so với bản này)

Đã tự giải mọi exercise đổi hay mới (`chon-5-8`, `dien-7-9`, `chon-cach-viet-15-99`, `chon-tinh-9-98`, `chon-viet-nho-8-7`, `chon-tich-rieng-2`, `chon-nhieu-nho-hon-500`, `chon-kiem-tra-28-4`, `tim-so-chia-36-4`, `chon-nhieu-chia-dung`, `chon-nhieu-du-2`, `du-185-15`, `mua-so-90-13`) và tính lại mọi `fillBlank` (11 câu): đều khớp `answer`/`accept`, trừ phát hiện Nghiêm trọng 1. Ba lỗi Nghiêm trọng của vòng 2 đã sửa đúng: `dien-7-9` accept 9 (ảnh `phone/054`, hình gợi ý và lời giải khớp); không còn "làm tròn" ở lesson.json lẫn `src/visuals` (note, recap section và card, nhãn hình đều dùng "số tròn chục liền trước/liền sau"); hình gia đình phép tính đã một dòng mỗi nhãn trên iPad dọc (`ipad/126`, `ipad/131`). Quy ước "a · b là a được lấy b lần" nhất quán sau đổi (note, hình diện tích xoay cạnh ngang là thừa số thứ nhất, đề `chon-kiem-tra-28-4`, câu nối ở `chia-het`). Khoảng trống dưới hình ở `chon-tich-53-7` trên phone chấp nhận được (`phone/118`). Hình diện tích hẹp của section 6 và 7 còn đọc được nhờ nhãn cạnh (`ipad/067`, `ipad/079`, `phone/067`). Các chỗ thay bằng khoảng trắng không ngắt chỉ nằm quanh "·", "=", ":", "+", "−" và dấu tách nghìn; không còn chỗ sót.

## Nghiêm trọng

### 1. `chon-tich-rieng-2`: lựa chọn d mới cũng là cách viết đúng

- Vị trí: `$.exercises[].options[3]` (`chon-tich-rieng-2`, d "Viết 1 920, thẳng cột với tích riêng thứ nhất"); LL-01
- Nguồn: tr.18, `sbt-p18.png` (nhân với số có hai chữ số)
- Vấn đề: lần sửa Góp ý vòng 2 thay "Viết 19, bỏ chữ số 2" bằng d. Nhưng note ngay trước dạy "tích riêng thứ hai lùi sang trái một cột, chữ số 0 mờ chỉ giữ chỗ", và hình mẫu (`ipad/102-s9-02-block.png`) hiện đúng `4 7 0` với 0 mờ thẳng cột với `1 4 1`. Vậy viết 1 920 thẳng cột với tích riêng thứ nhất chính là cách viết đúng của 64 · 30 trong hình mẫu, trùng với đáp án a về giá trị và vị trí. Trẻ hiểu bài (đã thấy 0 mờ) chọn d sẽ bị chấm sai; câu có hai đáp án đúng.
- Sửa: thay d bằng nhiễu sai thật phản ánh lỗi hay gặp, vd "Viết 19, nhớ 2 sang cột bên trái" (hoặc "Viết 192, lùi sang trái hai cột"); chạy lại `content:check`.

## Nên sửa

### 1. `tim-so-chia-36-4` trùng số với một đáp án của `chon-nhieu-chia-dung`

- Vị trí: `$.exercises[]` (`tim-so-chia-36-4`) so với `chon-nhieu-chia-dung` lựa chọn b `36 : 4 = 9` (cùng card `chia-het`); LL-07
- Nguồn: —
- Vấn đề: câu mới hỏi số chia khi số bị chia 36, thương 4, đáp án 9; câu chọn nhiều của cùng card có sẵn đáp án đúng `36 : 4 = 9`. Trẻ gặp câu này sau câu kia chỉ cần nhớ số.
- Sửa: đổi câu mới sang cặp chưa dùng trong card, vd "số bị chia là 30 và thương là 5" (đáp án 6, `check.expr` `30:5`).

## Góp ý

### 1. `chon-nhieu-du-2` lặp số với recap của section 15

- Vị trí: `$.exercises[]` (`chon-nhieu-du-2`, lựa chọn a `27 : 5`) so với visual `bai-toan-chia-tom-tat` (`catalog.ts`, `total: 27`, `per: 5`); LL-07
- Nguồn: —
- Vấn đề: 27 chia 5 dư 2 là đáp án đúng ở câu này và là ví dụ của recap cuối bài.
- Sửa: `27 : 5` thành `32 : 5` (thương 6, dư 2).

### 2. Hình diện tích hẹp ở section 6 và 7 có ô lưới nhỏ

- Vị trí: visual `phan-phoi-goi-banh` (`$.sections[5].blocks[0]`), `gan-tron-12-19` (`$.sections[6].blocks[0].children[1]`)
- Nguồn: —
- Vấn đề: hình đứng rộng 3 ô (phone ~60px), lưới mờ nhỏ; đọc được nhờ nhãn 3 và 12, nhưng khó đếm ô.
- Sửa: cho hình rộng hơn (ô to hơn) khi nhóm ≤ 4 cột; báo người làm app nếu do khung chung.
