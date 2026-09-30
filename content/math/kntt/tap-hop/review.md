# Review: Tập hợp (`tap-hop`)

- Bài: `content/math/kntt/tap-hop/lesson.json`
- Vòng: 4 - chỉ phần đổi (`pnpm content:diff`), section: tap-hop-la-gi, thao-tac, ngoac-nhon, dau-cham-phay, thuoc, khong-thuoc, liet-ke, xet-thuoc, dau-hieu-dac-trung, hai-cach-mo-ta
- Nguồn đã đọc: `sources/math/tap-hop/` - không mở lại; các mục đổi là caption, khoảng trắng không ngắt quanh ∈ ∉, ví dụ trong note và bốn câu chọn nhiều, không thêm kiến thức ngoài trang p5, p6 đã đối chiếu ở vòng trước
- `content:check`: 0 lỗi, 0 cảnh báo
- `lesson:walk`: 0 FAIL, ảnh trong `.shots/walk/tap-hop/` (phone, ipad, ipad-landscape); ảnh visual trong `.shots/tap-hop/`
- Kết luận: Chưa đạt: còn 1 lỗi Nghiêm trọng
- Bản đã review: `fb433467d5a73ff300e1cc7d49effcfb3c0231466fc0edeb3f6e2deb7b08c8e5` (`pnpm content:diff` so với bản này)

Vòng 3: đã xuất bản, 0 Nghiêm trọng, 2 Nên sửa, 4 Góp ý. Nên sửa 1 (recap xét thuộc, "A." rơi dòng riêng trên phone) đã hết: `phone/102-s8-05-recap.png` giữ "x ∉ A." liền nhau. Nên sửa 2 (`kt-cham-dau-hieu`) chưa sửa, ghi lại ở mục 5 dưới đây. Bốn Góp ý vòng 3 chưa đổi.

Tự giải trước khi đọc `answer`: `chon-tat-ca-cuoi-tuan` (thứ Bảy, Chủ nhật), `chon-tat-ca-thuoc` (A = {2; 5; 8}: 2, 5, 8), `chon-tat-ca-khong-thuoc` (C = {4; 6; 7}: 5, 8), `chon-phan-tu-dau-hieu` (11, 12, 13). Cả bốn khớp `answer`, không nhiễu nào thành đáp án đúng (14 và 9 nằm ngoài G; "tháng Bảy" và "thứ Sáu" không phải ngày cuối tuần). Đề đều ghi "Chọn tất cả", nấc 1 tô đề (câu chữ hoặc công thức tập hợp), không tô lựa chọn. `minutes` các section có màn đổi khớp số màn (khoảng 40 giây mỗi màn). Mọi caption mới có 1–2 câu, câu dài nhất khoảng 20 âm tiết. Đã xem ảnh phone và ipad của mọi màn có mục đổi.

## Nghiêm trọng

### 1. Note dấu hiệu đặc trưng: một tên E cho hai tập hợp khác nhau trên cùng một màn

- Vị trí: `$.sections[8].blocks[0].children[0].text` và visual `tap-hop.visual.dau-hieu-vi-du` cùng khối (section `dau-hieu-dac-trung`)
- Nguồn: —
- Vấn đề: ví dụ mới thay cho "x là …" viết "E = {x | x là số tự nhiên nhỏ hơn 5}", nhưng hình ngay dưới trong cùng khối là "E = {x | x là số tự nhiên lớn hơn 2 và nhỏ hơn 6}" (`phone/104-s9-01-block.png`, `ipad/104-s9-01-block.png`). Một tên tập hợp chỉ một tập hợp. Trẻ đối chiếu chữ với hình sẽ hiểu hai dấu hiệu này mô tả cùng một E. Section 10 lại dạy "hai cách đều chỉ cùng một tập hợp", nên trẻ dễ rút ra điều sai: {0; 1; 2; 3; 4} và {3; 4; 5} là một tập hợp.
- Sửa: cho note dùng đúng ví dụ của hình ("E = {x | x là số tự nhiên lớn hơn 2 và nhỏ hơn 6}"), hoặc đổi tên tập hợp trong note (ví dụ "M = {x | x là số tự nhiên nhỏ hơn 5}"), hoặc bỏ tên tập hợp: "Viết {x | dấu hiệu}, …".

## Nên sửa

### 2. `lap-ghep-liet-ke`: hai nhãn đè lên nhau

- Vị trí: visual `tap-hop.visual.lap-ghep-liet-ke` (`$.sections[6].blocks[0]`, section `liet-ke`)
- Nguồn: —
- Vấn đề: ở bước cuối, nhãn "mở ngoặc nhọn" và "dấu chấm phẩy" chồng lên nhau thành "mở ngoặdấu chấm" (`phone/084-s7-01-block-end.png`, `ipad/084-s7-01-block-end.png`). Đây là hai tên mà màn đang dạy.
- Sửa: để nhãn so le trên và dưới công thức, hoặc giãn cột giữa `{` và phần tử đầu, hoặc cho nhãn xuống dòng trong khung hẹp bằng bề rộng cột.

### 3. Caption hình vẽ từng nét ∈, ∉, dấu chấm phẩy chưa nói "làm gì" theo luật mới

- Vị trí: `$.sections[4].blocks[2].caption` (`ve-thuoc`), `$.sections[5].blocks[1].caption` (`ve-khong-thuoc`), `$.sections[3].blocks[1].caption` (`ve-cham-phay`)
- Nguồn: —
- Vấn đề: đây là hình từng bước, có nút Bước tiếp, nhưng caption chỉ tả hình dạng ("Kí hiệu ∈ là chữ C, thêm một gạch ngang ở giữa.", `phone/063-s5-03-block.png`). Hai hình `ve-mo-ngoac` và `ve-dong-ngoac` đã sửa theo luật, còn ba hình này thì chưa, nên cùng một loại hình có hai kiểu caption.
- Sửa: viết theo mẫu của `ve-mo-ngoac`, ví dụ "Bấm Bước tiếp, vẽ ∈ theo từng nét trên giấy nháp: chữ C rồi gạch ngang ở giữa."

### 4. Recap không thuộc: kí hiệu ∈ trong dòng "Viết: kí hiệu ∈ và gạch chéo" rất nhỏ

- Vị trí: visual `tap-hop.visual.the-khong-thuoc` (`$.sections[5].recap`, `$.cards[6].recap` card `khong-thuoc`)
- Nguồn: —
- Vấn đề: ∈ trong dòng chữ đậm nhỏ hơn chữ thường, khó nhận ra (`phone/081-s6-07-recap.png`, `ipad/081-s6-07-recap.png`), trái với luật "∈ ∉ { } trong chữ vẽ bằng phông toán cỡ lớn". Đây là cách viết kí hiệu mà trẻ phải nhớ.
- Sửa: vẽ ∈ ở dòng này bằng cùng thành phần kí hiệu cỡ lớn như nơi khác, hoặc viết "Viết: chữ C, gạch ngang và gạch chéo".

### 5. `chon-tat-ca-cuoi-tuan` trùng nguyên ví dụ của section 1

- Vị trí: `tap-hop.ex.chon-tat-ca-cuoi-tuan`; visual `tap-hop.visual.vi-du-tap-hop` (`$.sections[0].blocks[1]`)
- Nguồn: —
- Vấn đề: hình ví dụ vừa đổi hộp thứ ba thành "các ngày cuối tuần: thứ Bảy, Chủ nhật", và câu mới hỏi đúng tập hợp đó. Trẻ chọn theo trí nhớ hình ví dụ chứ không phải tự nhận ra phần tử.
- Sửa: đổi tập hợp trong câu, ví dụ "các màu của đèn giao thông" (đỏ, vàng, xanh; nhiễu: tím, và một thứ không phải màu), hoặc giữ câu này và đổi hộp thứ ba của hình về ví dụ khác.

### 6. `kt-cham-dau-hieu`: tập hợp vẫn bị tách hai dòng, dồn trái trên iPad (vòng 3 mục 2, chưa sửa)

- Vị trí: visual `tap-hop.visual.cham-dau-hieu` (`tap-hop.ex.kt-cham-dau-hieu`)
- Nguồn: —
- Vấn đề: "A = { x |" một dòng, "x là số chẵn nhỏ hơn 9 }" dòng dưới, cả trên phone lẫn iPad (`phone/107-…`, `ipad/107-s9-03-exercise-kt-cham-dau-hieu.png`, `.shots/tap-hop/tap-hop.visual.cham-dau-hieu-ipad.png`). Khoảng cách mới giữa các ô không giải quyết được việc xuống dòng.
- Sửa: giữ cả tập hợp trên một dòng, căn giữa (thu cỡ ô, cho ô dấu hiệu co theo chữ); phone hẹp thì cho `}` đi cùng dòng với ô dấu hiệu, còn "A = { x |" nằm dòng trên và căn giữa.

## Góp ý

- Caption `tap-net-thuoc`, `tap-net-khong-thuoc` ("…vẽ kí hiệu ∈: …") và `chon-x-tu-do` ("…thì ∈, không thì ∉.") vẫn dùng dấu cách thường trước ∈ ∉. Trên phone, "∈:" và "∉:" bị đẩy xuống đầu dòng dưới (`phone/065`, `phone/075`). Nên dùng U+00A0 giống các caption khác.
- Kí hiệu ∈ ∉ trong note và caption hiện cao ngang chữ thường (`phone/062`, `phone/097`), không lớn hơn như { } trong caption ngoặc nhọn. Vẫn đọc được, nhưng chưa đúng luật "phông toán cỡ lớn" (có thể là việc của thành phần hiển thị trong app).
- Caption bắt đầu bằng "Bấm Bước tiếp…" vẫn hiện ở bước cuối, khi nút Bước tiếp đã ẩn (`phone/002`, `phone/084`, `phone/096`). Đây là việc của app, ví dụ cho phép đổi caption ở bước cuối.
- Trên iPad, một số caption để lại một chữ ở dòng cuối ("phẩy." ở `ipad/083-084`, "hơn." ở `ipad/065`). Đây là bố cục của app (bề rộng khung caption).
- Góp ý vòng 3 chưa đổi: `kt-dau-giua` có dấu phẩy giữa hai số áo trong đề; câu dấu hiệu đặc trưng nên đổi "số khác" thành "phần tử khác", và "Nó viết sau" thành "Nó được viết sau"; recap xét thuộc nên viết "x có trong A thì x ∈ A, …"; note section 4 nên thêm dấu phẩy ("Giữa hai phần tử, ta viết dấu chấm phẩy.").
