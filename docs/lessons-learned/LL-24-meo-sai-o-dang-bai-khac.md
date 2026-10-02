# LL-24 — Mẹo sai ở số biên hay ở dạng bài khác trong cùng bài

## Triệu chứng

Một khối `tip` (hay mẹo trong `tips.json`) có câu chữ đúng với ví dụ của nó, nhưng cho kết quả sai, hoặc dạy điều sai, khi trẻ áp dụng đúng từng chữ vào:

- số biên của dạng bài (đáp số nằm sát đầu khoảng, số 1, hai số bằng nhau);
- một dạng bài khác có trong chính bài, mà mẹo không nói là không dùng cho dạng đó;
- chiều ngược lại: mẹo chỉ là điều kiện cần, nhưng tên mẹo và ví dụ duy nhất (một lần kiểm qua) khiến trẻ nhớ thành điều kiện đủ.

## Ví dụ thật

- `boi-chung-boi-chung-nho-nhat` vòng 1, `tip.chon-cong-cu` (section `uclnn-hay-bcnn`): "số cần tìm nhỏ hơn các số đã cho thì tìm ƯCLN" chọn sai công cụ ở bài số vòng bánh răng (`rang-9-6-vong`: đáp số 3 nhỏ hơn 9 và 6, ƯCLN tình cờ cũng bằng 3; hình `rang-12-8-vong`: 3 vòng nhưng ƯCLN = 4) và bài hỏi giờ (`bao-thuc-20-30`: 8 giờ nhỏ hơn 20 và 30, ƯCLN = 10). Mẹo so độ lớn của đáp số thay vì chiều chia hết, trong khi câu quy tắc Bài 11 đã nói theo chiều chia hết.
- Cùng vòng, `tip.hang-con-du` (section `so-trong-khoang`): "bớt số dư, tìm bội chung, cộng số dư lại" cùng câu quy tắc "chọn số nằm trong khoảng đề cho" cho 49 thay vì 37 (hàng 3 và 4 dư 1, từ 37 đến 48). Mẹo không nói phải cộng số dư trước khi chọn trong khoảng; mọi câu của bài đều không chạm biên nên walk không thấy.
- Cùng vòng, `tip.kiem-chia-het` (section `bcnn-ba-so`): "BCNN phải chia hết cho từng số" đúng chữ, nhưng tên "Kiểm lại kết quả" và ví dụ duy nhất là lần kiểm qua (72 với 6, 8, 9) nên trẻ nhớ "chia hết cho mọi số là đúng"; phép kiểm cho qua đúng các lỗi hay gặp (24 với 2, 3, 4; 432 với 6, 8, 9). Lý do `wrong` của câu `tim-loi-bcnn-4-6-9` ("…chưa đủ: còn phải chia hết cho 6 và 9") củng cố cách hiểu sai đó.
- `boi-chung-boi-chung-nho-nhat` vòng 2, `tip.boi-so-lon` (section `liet-ke-bcnn`): "Chỉ liệt kê các bội của số lớn. Số đầu tiên chia hết cho số nhỏ chính là BCNN" đúng với mọi cặp số. Nhưng điều kiện "hai số" chỉ nằm ở tiêu đề, và mẹo ra sai ở cả 5 câu ba số của bài (`bcnn-3-8-12` ra 12 thay vì 24, `bcnn-6-9-15` ra 30 thay vì 90). Vòng 1 chỉ thử mẹo trên các cặp số. Điều kiện của mẹo phải nằm trong `text`, không chỉ ở `title`; nên viết mẹo cho mọi số lượng số ("số lớn nhất", "chia hết cho mọi số còn lại").
- Trước khi có mục này, mẹo sai ở `dau-hieu-chia-het` vòng 1 (thẻ `tim-38a` "gần 11 nhất") được đếm ở LL-17.
- `on-tap-chuong-2` vòng 2, `tip.nho-cong-so-du` (section `bcnn-bai-toan`): cùng lỗi `tip.hang-con-du` của Bài 12 lặp ở bài ôn: "Nhớ cộng lại số dư" đi với câu quy tắc "chọn số nằm trong khoảng đề cho" cho 2.58 ra cả 245 lẫn 305 (bội 240 và 300 trong 200..300), trong khi bước `chon-bc-60` lại bớt số dư ở hai đầu khoảng và sách cộng dư trước rồi chọn. Một dạng bài có số dư phải chốt một thứ tự cho cả section và nói thẳng trong mẹo.
- `cach-ghi-so-tu-nhien` vòng 1: mẹo `i-truoc-i-sau` ("I đứng trước V, X thì trừ 1, đứng sau thì cộng 1") không quyết được ở XIV, XIX, nơi chữ I vừa đứng sau chữ này vừa đứng trước chữ kia, và dạy cách trừ mà sách không dạy (sách tách thành phần IV, IX rồi cộng). Mẹo `viet-so-tu-tong` ("hàng nào không có số hạng thì viết 0") cho 0065 với 6 · 10 + 5 vì không nói bắt đầu từ hàng lớn nhất có trong tổng. Thử mẹo trên số có chữ cần áp hai luật cùng lúc, và trên tổng thiếu hàng ở đầu.
- `thu-tu-trong-tap-hop-cac-so-tu-nhien` vòng 1: ba mẹo cùng lỗi "điều kiện chỉ ở tiêu đề": `tip.doc-dau` ("đầu nhọn chỉ số bé") sai với 9 ≤ 9, 12 ≥ 12 ở section ngay sau; `tip.so-cung-chu-so` ("luôn so từ chữ số bên trái nhất") sai với 9 874 / 10 203; `tip.dem-phan-tu` (b − a + 1) cho kết quả sai ở các câu khoảng cách trên tia số của chính bài (km 55 tới km 70 ra 16) và nói ngược `tip.dem-tu-goc-o` ("đừng đếm vạch gốc"). Thử mẹo trên mọi dạng bài của cả bài có cùng phép tính (đếm số và đo khoảng cách), không chỉ dạng của section chứa mẹo, và soát hai mẹo trong cùng bài không nói ngược nhau.
- `phep-cong-phep-tru-so-nguyen` vòng 1, `tip.dau-truoc` (cộng hai số khác dấu): `text` "xem số nào ở xa 0 hơn, kết quả mang dấu của số đó" không nói chỉ dùng cho phép cộng khác dấu; áp vào (−5) + (−2) ra −3 (đúng nhiễu của câu cùng bài), vào 3 − 8 ra 5. Điều kiện của mẹo phải nằm trong `text`, vì trang "Mẹo hay" gom mẹo ra khỏi section.
- `quy-tac-dau-ngoac` vòng 1: `tip.dau-dau-tien` ("viết thêm dấu + trước số đầu trong ngoặc rồi đổi dấu từng số hạng") không nói chỉ dùng khi trước ngoặc có dấu −, nên 10 + (3 − 5) ra 12 và (3 − 5) − 2 ra 0. `tip.gom-duong-am` (cộng riêng dương, riêng âm) chỉ đúng sau khi đã bỏ hết ngoặc mà không nói vậy: đem dùng cho câu còn ngoặc của chính bài ra 4 thay vì 2, −7 thay vì −1; "mang dấu của nhóm lớn hơn" đọc được là nhóm nhiều số hơn. Mẹo cho một bước giữa của cách làm phải nói nó dùng sau bước nào, và thử trên đề chưa qua bước đó.
- `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` vòng 1: `tip` "Dấu của thương" ("đếm các dấu − của hai số") ra −1 ở câu ôn `[(−24) + 36] : 12` của chính bài vì không nói tính số bị chia trước; `tip` "Kiểm tra số ước" ("số ước luôn chẵn, ra số lẻ thì còn thiếu ước") cho qua lỗi quên hết ước âm (6 → 4, chẵn) và kết luận sai khi số lẻ do thêm nhầm số 0. Mẹo kiểm phải bắt được lỗi chính mà section cảnh báo, và vế "thì bạn còn thiếu" phải thử cả trường hợp đếm thừa.
- `phep-nhan-so-nguyen` vòng 1, `tip.gop-thua-so-chung` và câu quy tắc section `gop-thua-so` ("các tích có chung một thừa số … cộng các thừa số còn lại"): không nói chỉ dùng cho tổng hai tích, nên với hiệu 20 · (−9) − 20 · 21 của bài 3.32, đúng bài mà `sourceRef` của section trích, ra 240 thay vì −600. Thử mẹo trên chính các bài sách mà `sourceRef` trỏ tới, không chỉ trên câu của bài.

## Nguyên nhân gốc

Tác giả thử mẹo trên ví dụ của chính section, không thử trên số biên và trên các dạng bài khác của cả bài (bánh răng, hỏi giờ, xếp hàng). Mẹo "hiểu nhanh" khái quát một quan sát (đáp số ƯCLN thường nhỏ, BCNN thường lớn) thành luật chọn cách làm. Mẹo "tránh sai" chỉ nói điều kiện cần mà không nói rõ nó không đủ.

## Cách phòng

- Tác giả: trước khi gọi review, thử mỗi mẹo trên ít nhất 5 đầu vào gồm số biên, và trên mọi bài tập, hình lời giải của cả bài mà mẹo có thể được đem dùng (không chỉ section chứa mẹo). Mẹo chọn cách làm thì nói theo quan hệ chia hết hay theo câu quy tắc, không theo độ lớn của đáp số. Mẹo chỉ là điều kiện cần thì ví dụ `tex` là một lần kiểm trượt và `text` có một câu "chưa chắc đúng" kèm số.
- Người: checklist trục 2 "Mẹo đúng với mọi đầu vào"; reviewer ghi bảng "mẹo → số đã thử → kết quả" và thêm cột "dạng bài khác của bài".

## Trạng thái

Chỉ người soát.
