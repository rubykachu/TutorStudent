# LL-27 — Bài vẽ chấm bằng chương trình có tập lời giải khác lời giải định dạy

## Triệu chứng

Câu `manipulate` cho bé vẽ hay bật đoạn trên lưới (vẽ thêm đường gấp khúc, đặt điểm) được chấm bằng chương trình: nhận mọi cách vẽ thoả điều kiện (đủ độ dài, đúng số trục). Tác giả chọn độ dài, bảng và điều kiện theo một lời giải trong đầu, nhưng tập lời giải thật mà hàm chấm nhận lại khác:

- chỉ còn lời giải lạ (đường rời xa hình cho sẵn) mà bé gần như không nghĩ tới, còn cách vẽ tự nhiên (nối vào hình) thì không có;
- hình lời giải nấc 3 lấy "cách đầu tiên" hàm giải tìm được, khác lời giải của sách và khó hiểu;
- `explain` tả một hình không có trong tập lời giải.

## Ví dụ thật

- `hinh-co-truc-doi-xung` phần bài tập sách bài tập vòng 1 (Nghiêm trọng): câu dẫn `ex.l59b-dan` (vẽ thêm đường gấp khúc độ dài 2 để hình có hai trục) chỉ có một lời giải là đường "└" ở góc dưới trái, không chạm hình "┐" cho sẵn; `explain` chỉ nói "Thử vài cách vẽ". Độ dài 4 thì có đúng hai lời giải, cả hai nối hai đầu thành hình chữ nhật 2 × 1 ô như cách của sách. Cùng vòng (Nên sửa): hình lời giải `sbt-5-9a-giai` do `solveEdges` lấy cách đầu tiên (ô vuông kèm móc thừa), khác hình chữ L của lời giải sách tr.119; `explain` của `ex.l59a-dan` tả "đoạn nối hai đầu" mà hai đầu nằm chéo nhau.

## Nguyên nhân gốc

Test chỉ kiểm "hàm giải tìm được một lời giải và hàm chấm nhận nó", không liệt kê cả tập lời giải để người soạn nhìn. Hình lời giải và lời giải thích được viết theo ý định, không theo tập đó.

## Cách phòng

- `lesson-visual` và `lesson-author`: với mỗi câu vẽ chấm bằng chương trình, liệt kê mọi lời giải hàm chấm nhận (bảng nhỏ duyệt được hết) và xem từng cái; đổi độ dài, bảng hay điều kiện cho tới khi tập lời giải chứa cách vẽ tự nhiên, nhất là cách của sách. Hình lời giải nấc 3 dùng danh sách đoạn cố định theo lời giải sách, không lấy cách đầu tiên của hàm giải. `explain` tả một hình nằm trong tập đó.
- Người: Reviewer tự giải câu vẽ trước khi đọc `answer`; cách tự nhiên bị từ chối thì chạy liệt kê lời giải. Checklist trục 2 "Mỗi câu hỏi có đúng một đáp án" và phần "Câu dẫn" của bài tập sách bài tập.

## Trạng thái

Chỉ người soát. Có thể máy hoá: test của bài in số lời giải của mỗi câu vẽ và báo khi chỉ có lời giải không chạm hình cho sẵn.
