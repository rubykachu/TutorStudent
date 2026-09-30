# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 3 - chỉ phần đổi (`pnpm content:diff`), section: tap-hop-la-gi, thao-tac, ngoac-nhon, dau-cham-phay, thuoc, khong-thuoc, liet-ke, xet-thuoc, dau-hieu-dac-trung, hai-cach-mo-ta
- Nguồn đã đọc: `sources/math/tap-hop/` - p5, p6
- `content:check`: 0 lỗi, 1 cảnh báo của bài (80 id chưa có trong `ids.lock.json`)
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/tap-hop/`
- Kết luận: Đã xuất bản (0 Nghiêm trọng; `content:hash --approve` ghi `reviewedHash`, `status: published`)
- Bản đã review: `383b55968497af5ebe81a6bdd0e92c5d08cc46bb015797fad32e8f36c4f8af6c` (`pnpm content:diff` so với bản này)

Tự giải trước khi đọc `answer` các exercise đã đổi: `chon-dong-dung` (k ∈ R), `chon-viet-dung` ({4; 5; 6}), `dien-liet-ke-chan` ({4; 6; 8}), `chon-dau-hieu-3456` (lớn hơn 2 và nhỏ hơn 7; nhiễu mới "nhỏ hơn 7" quá rộng, không thành đáp án đúng), `kt-xet-hai-chu-so` (64), `kt-cham-dau-hieu` (vùng "x là số chẵn nhỏ hơn 9"), `kt-dau-giua` (;), `chon-x-thuoc`, `chon-x-khong-thuoc`, `dien-dau-xet-so` (610 ∈, 95 ∉), `kt-ngoac-dung`, `chon-chu-so-343`, `mua-trong-nam`, `nhom-la-tap-hop`, `gom-nhom-hop`. Mọi đáp án đúng và duy nhất. Đã xem ảnh các visual đổi (`.shots/tap-hop/`) và ảnh walk của các section có mục đổi.

Mục vòng 2 (số theo `review.md` vòng 2):
- Nghiêm trọng 1, 2, 3: đã hết. `dem-chu-cai-nha-trang` chỉ còn card `liet-ke`; note, recap section và recap card `dau-hieu` cùng câu "phần tử nào cũng có, số khác thì không có", `chon-dau-hieu-3456` có nhiễu quá rộng; `chon-dong-dung` dùng R = {h; k}.
- Nên sửa đã sửa: 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15. Mục 10 còn trên phone ở recap xét thuộc (mục 1 dưới đây).
- Góp ý đã sửa: 16, 17, 18, 19, 20, 21, 22, 24, 26, 29, 30, 31, 33, 34, 35. Còn lại: 25 (dấu phẩy sau "Giữa hai phần tử" ở note section 4), 32 (hình lệch, mục 2 dưới đây); 27, 28 là việc của app; 23 không đổi.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Recap xét thuộc trên phone: "A." rơi xuống dòng riêng

- Vị trí: `$.sections[7].recap.caption`, `$.cards[8].recap.caption` (section `xet-thuoc`, card `xet-thuoc`)
- Nguồn: —
- Vấn đề: ảnh `phone/102-s8-05-recap.png`: "…không có thì x ∉" rồi "A." một mình dòng dưới; iPad liền một dòng. Phần còn lại của mục 10 vòng 2.
- Sửa: dùng khoảng trắng không ngắt (U+00A0) giữa kí hiệu và tên tập hợp ("x ∈ A", "x ∉ A") trong các caption có kí hiệu, hoặc rút câu ngắn hơn.

### 2. `kt-cham-dau-hieu`: tập hợp bị tách hai dòng, hình lệch trái trên iPad

- Vị trí: visual `tap-hop.visual.cham-dau-hieu` (`$.exercises[45]`)
- Nguồn: —
- Vấn đề: ảnh `ipad/107-s9-03-exercise-kt-cham-dau-hieu.png`: "A = { x |" một dòng, "x là số chẵn nhỏ hơn 9 }" dòng dưới, cả khối dồn trái dù màn rộng; khó đọc thành một tập hợp (cùng loại mục 15 vòng 2).
- Sửa: giữ cả tập hợp một dòng và căn giữa (thu cỡ ô, hay cho ô dấu hiệu co theo chữ).

## Góp ý

- `kt-dau-giua` (`$.exercises[18]`): đề viết "số áo 3, 8 và 10" có dấu phẩy giữa hai số, ngay trong câu hỏi dấu viết giữa hai số của tập hợp; có thể dùng hai số ("số áo 3 và 8").
- Câu định nghĩa dấu hiệu đặc trưng (`$.sections[8]`, `$.cards[9]`): "số khác" chỉ hợp tập số; nếu muốn dùng chung, đổi "phần tử khác" hay "thứ khác". "Nó viết sau" nên là "Nó được viết sau".
- Recap xét thuộc thiếu chủ ngữ: "x có trong A thì x ∈ A, …" rõ hơn "Có trong A thì …".
- Note section 4 (`$.sections[3].blocks[0].children[0].text`): thêm dấu phẩy "Giữa hai phần tử, ta viết dấu chấm phẩy." (mục 25 vòng 2).
