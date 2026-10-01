# Bài Tập hợp (`tap-hop`): việc còn lại

Bài đã qua 3 vòng review, 0 lỗi Nghiêm trọng (`content/math/kntt/tap-hop/review.md`). Các mục dưới đây không chặn xuất bản.

## Nội dung

Đã sửa (02/10/2026, review vòng 9): khoảng trắng không ngắt ở recap xét thuộc, đề `kt-dau-giua`, câu định nghĩa dấu hiệu đặc trưng. Kiểm kê mọi mục còn lại và lý do: `notebooks/backlogs/fix-earlier-lessons/task.md`.


- Hình `tap-hop.visual.cham-dau-hieu` (câu `kt-cham-dau-hieu`) trên iPad tách tập hợp làm hai dòng và dồn sang trái.
- Mục "Chú ý" (kí hiệu ℕ, viết gọn {x ∈ ℕ | …}, sách bài tập tr.6) chưa có trong bài: bản đầu đã thử và bỏ vì làm section nặng mà không có câu luyện. Khi làm lại cần cách đọc, ví dụ liệt kê và một câu luyện.
- Bài 1.6 và 1.7 của sách (phân số, dạng 2k + 1) chưa lấy số: chương chưa dạy phân số, còn 2k + 1 cần biến k.
- Dấu ; xuất hiện ở các ví dụ của section ngoặc nhọn trước khi section dấu chấm phẩy dạy nó.

## Màn hướng dẫn thao tác (cảnh báo `[guides]`, lessons-learned LL-04)

Môn Toán chưa có màn hướng dẫn `match` và `order`; bài này là bài Toán đầu tiên nên cần hai màn đó (mẫu: `huong-dan-noi`, `huong-dan-xep` của bài Ngữ văn), đặt ở section `thao-tac` hay trước câu đầu tiên dùng chúng (`ex.noi-tap-hop-phan-tu` thuộc card của section đầu `tap-hop-la-gi`, `ex.xep-ghep-tap-hop`). Làm xong thì cảnh báo của `luy-thua` và `thu-tu-thuc-hien-phep-tinh` cũng hết.

Câu `manipulate` gặp hình mà trẻ chưa thấy ở màn khám phá: `ex.chon-do-dung`, `ex.viet-ngoac-mo`, `ex.viet-ngoac-dong`, `ex.dat-cham-phay-bai`, `ex.chon-x-thuoc` (màn đổi x `chon-x-tu-do` ở section sau), `ex.chon-x-khong-thuoc`. Đề có câu dặn thao tác; cần một màn `guide: "manipulate"` chung hoặc cho mỗi hình một màn khám phá trước.

## Câu quy tắc (luật `[rule-sentence]`, lessons-learned LL-05)

Chỉ note `liet-ke` đánh `rule`. Recap các section `tap-hop-la-gi`, `ngoac-nhon`, `dau-cham-phay`, `thuoc`, `khong-thuoc`, `xet-thuoc`, `hai-cach-mo-ta` nói gọn lại chứ không lặp nguyên văn note. Muốn luật kiểm các section này: thống nhất câu quy tắc giữa note, recap section, recap card, rồi đánh `rule: true` (bài phải review lại).

## Lời đọc tổng quan

`pnpm narration:build tap-hop` chưa chạy được ở máy này: mô hình giọng đọc không có trong bộ nhớ đệm và không có mạng. Chạy lại ở máy có mô hình (`VIDEO_PYTHON` trỏ vào môi trường `video/spikes/vieneu`), rồi review phần đổi và duyệt lại vì `overview.narration` làm đổi hash.

## Ứng dụng

- Bài điền chip dùng `RichText`: từ nay chip chỉ có một dấu và ∈ ∉ vẽ bằng phông toán lớn hơn. Chip dài nhiều chữ vẫn cỡ chữ thường.
- Ô trống của `fillBlank` rộng tối thiểu 80px, nên bài ghép cả tập hợp (7 ô) xuống ba dòng trên điện thoại. Ô một kí hiệu có thể hẹp hơn.
