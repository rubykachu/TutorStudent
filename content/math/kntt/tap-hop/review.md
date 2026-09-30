# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff`), section: tap-hop-la-gi, dau-cham-phay, thuoc, khong-thuoc, dau-hieu-dac-trung (cùng hai visual đổi mã: `lap-ghep-liet-ke` ở section liet-ke, `the-khong-thuoc` ở recap khong-thuoc)
- Nguồn đã đọc: `sources/math/tap-hop/` - không mở lại; các mục đổi là caption, ví dụ trong note (lấy đúng tập hợp của hình cùng khối) và một câu chọn nhiều về đồ vật đời sống, không thêm kiến thức ngoài trang p5, p6 đã đối chiếu ở vòng trước
- `content:check`: 0 lỗi, 0 cảnh báo
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/tap-hop/` (phone, ipad, ipad-landscape); ảnh visual trong `.shots/tap-hop/`
- Kết luận: Đã xuất bản
- Bản đã review: `635a17237df8369db1965799c1168c8d3d31cbef0783db3064ac543263f1bc30` (`pnpm content:diff` so với bản này)

Vòng 4: 1 Nghiêm trọng, 5 Nên sửa. Kiểm lại ở vòng này:
- Nghiêm trọng 1 (một tên E cho hai tập hợp) đã hết: note nay viết "E = {x | x là số tự nhiên lớn hơn 2 và nhỏ hơn 6}", trùng hình ngay dưới (`phone/104-s9-01-block.png`, `ipad/104-s9-01-block.png`).
- Nên sửa 2 (`lap-ghep-liet-ke` nhãn đè) đã hết: "mở ngoặc nhọn", "dấu chấm phẩy", "đóng ngoặc nhọn" xuống dòng trong cột, không chồng (`phone/084-s7-01-block-end.png`, `ipad/084-…`).
- Nên sửa 3 (caption `ve-cham-phay`, `ve-thuoc`, `ve-khong-thuoc`) đã hết: cả ba nói làm gì ("Vẽ … theo từng nét trên giấy nháp") và thứ tự nét, khớp hình từng bước (`phone/051`, `phone/063`, `phone/073`, `ipad/063`).
- Nên sửa 4 (∈ nhỏ trong recap không thuộc) đã hết: dòng nay là "Viết: kí hiệu thuộc và gạch chéo", khớp tên gọi "thuộc" của bài (`phone/081-s6-07-recap.png`, `ipad/081-…`).
- Nên sửa 5 (câu chọn nhiều trùng ví dụ section 1) đã hết: `chon-tat-ca-cuoi-tuan` thay bằng `chon-tat-ca-mau-co`; không visual hay câu nào khác trong bài dùng tập hợp màu cờ.
- Nên sửa 6 (`kt-cham-dau-hieu` xuống dòng trên iPad) đã ghi trong `backlogs/lesson-tap-hop.md`, nên không ghi lại.
- Góp ý khoảng trắng thường trước ∈ ∉: đã hết, "hiệu ∈:" và "thì ∈, không thì ∉." giữ liền trên phone (`phone/065`, `phone/076`).

Tự giải trước khi đọc `answer`: `chon-tat-ca-mau-co` (cờ Việt Nam nền đỏ sao vàng: đỏ, vàng) khớp `answer` a, b. Nhiễu "màu xanh", "màu tím" không nằm trên cờ, không thành đáp án đúng. Đề ghi "Chọn tất cả", `multiple: true`, nấc 1 tô câu đề (một câu), không tô lựa chọn. Câu chỉ nằm trong kho luyện card `phan-tu`, không trùng hình với ba câu kiểm tra section 1 (hộp bút, nhóm là tập hợp, mùa trong năm). Recap các section có mục đổi vẫn khớp note. Đã xem ảnh phone và ipad của mọi màn có mục đổi.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

- Caption bắt đầu bằng "Bấm Bước tiếp…" vẫn hiện ở bước cuối khi nút đã ẩn (`phone/084`); trên iPad một số caption để lại một chữ ở dòng cuối ("ngang." ở `ipad/063`, "phẩy." ở `ipad/084`). Cả hai là bố cục của app.
- Kí hiệu ∈ ∉ trong note và caption cao ngang chữ thường, chưa lớn như { } (việc của thành phần hiển thị trong app).
- Góp ý vòng 3 chưa đổi (đã có trong backlog một phần): dấu phẩy trong đề `kt-dau-giua`; "số khác" nên là "phần tử khác" trong note dấu hiệu đặc trưng; recap xét thuộc nên viết "x có trong A thì …"; note section 4 nên thêm dấu phẩy sau "Giữa hai phần tử".
