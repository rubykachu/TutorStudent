# Bài thu-tu-thuc-hien-phep-tinh: mục không chặn

Các mục Nên sửa và Góp ý còn lại sau các vòng review, không chặn xuất bản.

- Section `bieu-thuc-chu` chưa có màn "cùng làm" tương tác (trẻ chạm chữ để thay bằng số). Cần một visual mới.
- Section `tim-so-chua-biet` chưa có màn "cùng làm"; `tim-x` chỉ có một màn mẫu tĩnh.
- Bài 1.64a của sách bài tập (luỹ thừa của cả một nhóm trong ngoặc, ví dụ `[(33 − 3) : 3]^(3+3)`) và bài 1.67 (toán chuyển động có chữ) chưa có dạng tương ứng: engine `expression.ts` chưa nhận luỹ thừa của nhóm ngoặc.
- Nấc 1 của câu tính dài tô cả biểu thức (không chỉ phép tính hay sai); cần `\htmlId` riêng từng phép.
- Hình gợi ý của câu chạm phép tính làm trước có cùng khung với đề, nên vị trí vùng đáp án suy ra được; đổi biểu thức gợi ý có phép làm trước ở chỗ khác.
- Hình `nhan-chia-on` vẽ gạch ngang thay cho ghế và bạn; hình bảng nhân, tách chục tô kết quả nền vàng thay cho kiểu "Kết quả" (hổ phách gạch chân).
- Màu concept `bang-nhan` và `nhan-hai-chu-so` (violet) trùng màu "số mũ" của bài luỹ thừa; hiện chưa hiện cho trẻ.
- Phím "mũ" của bàn phím số hiện ở mọi câu số (việc của app).
- Một số câu kho ôn dùng số gần với ví dụ trên màn quy tắc.
- Nhãn cột sai của `tong-hop-dong-viet-lai` còn là "Sai: cộng trước"; đổi thành "Sai: làm 5 + 3 trước".
- Caption câu chuyện mua quà (section ngoặc lồng) chưa nói 32 là số tiền gì.
- `chon-nhieu-luy-thua-truoc` có lựa chọn `(1 + 2) · 3²` cần biết ngoặc trước luỹ thừa; thêm card `tinh-day-du` vào cardIds hoặc đổi lựa chọn.
- `overview.summary` còn dài 3 câu và chưa nhắc biểu thức chứa chữ.
- Hình gợi ý `tim-x-1-goi-y`, `tim-x-2-goi-y` dùng đẳng thức không có nghiệm tự nhiên; lời giải `tim-x-kiem-tra-giai` lặp dòng "2x + 6 = 14".
- Chú thích màn cùng làm dùng cụm "để tính ra nó", đọc hơi vấp.

## Từ các luật lessons-learned (30/09/2026)

- Cảnh báo `[guides]` về `match` (`ex.noi-dau-voi-ten`) và `order` (`ex.sap-buoc-cong-tru`): hết khi bài `tap-hop` có hai màn hướng dẫn đó (LL-04).
- Recap `dau-phep-tinh`, `hon-hop`, `ngoac-long` và card `tinh-day-du` nói gọn quy tắc bằng lời khác note nên các note đó chưa đánh `rule` (LL-05). Thống nhất câu rồi đánh `rule: true` nếu muốn luật kiểm.
