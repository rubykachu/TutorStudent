# LL-26 — Lời giải thích gọi lựa chọn theo vị trí mà app xáo thứ tự

## Triệu chứng

`explain` (hay một lý do `wrong`) của câu `choice` gọi lựa chọn theo chỗ đứng trong JSON: "hai tổng đầu", "hai dãy sau", "tổng thứ ba", "lựa chọn cuối". App xáo thứ tự lựa chọn mỗi lần làm (`seededShuffle` trong `src/exercises/choice/choice-answer.tsx`), nên trên màn "hai tổng đầu" thường là hai lựa chọn khác. Lời giải thích khi đó gán lý do đúng cho lựa chọn sai và ngược lại, đúng ở chỗ bé đang cần hiểu vì sao.

## Ví dụ thật

- `quy-tac-dau-ngoac` vòng 1, `ex.chon-tong-bang-0` (chọn tất cả các tổng bằng 0): "Hai tổng đầu có đủ các cặp số đối nhau, nên bằng 0. Tổng thứ ba còn lại 3 − 4 = −1 và tổng thứ tư còn lại 3." Ở phần lớn thứ tự xáo, câu này bảo tổng có −4 hay có số 3 thừa ra là bằng 0.
- Cùng vòng, `ex.chon-nhom-20-8`: "Hai dãy đầu nhóm số hạng mà vẫn giữ nguyên dấu … Hai dãy sau đổi dấu …".
- `phep-chia-het-uoc-va-boi-cua-mot-so-nguyen` vòng 2, `ex.chon-thuong-nho-nhat` (câu kho ôn mới thêm ở vòng sửa để thay câu xếp thứ tự): "Hai phép đầu có hai số khác dấu nên thương âm", nên ở phần lớn thứ tự xáo câu này bảo phép (−15) : (−5) cho thương âm. Câu `choice` viết mới ở vòng sửa cũng phải soát cụm chỉ vị trí như câu của vòng 1.

## Nguyên nhân gốc

Tác giả viết lời giải thích nhìn vào mảng `options` trong JSON, nơi thứ tự cố định, và không thấy màn xáo. Câu `multiple: true` hay bị nhất vì lời giải thích muốn nói gộp nhiều lựa chọn một lúc.

## Cách phòng

- `lesson-author`: trong `explain` và `wrong` của câu `choice`, gọi lựa chọn bằng nội dung của nó ("tổng từ −2 đến 2", "cách viết 20 − (8 + 5) − 3"), không bằng vị trí hay chữ a, b, c, d. Lý do riêng của từng lựa chọn đặt vào `wrong` của lựa chọn đó.
- Người: tìm trong `explain` của mọi câu `choice` các chữ "đầu", "sau", "cuối", "thứ hai", "thứ ba", "thứ tư", "trên", "dưới", "kia" khi chúng chỉ lựa chọn; mỗi chỗ là Nghiêm trọng (giải thích nói sai đáp án ở hầu hết lần làm).
- Kiểm được bằng máy: một luật lint quét `explain.text` của câu `choice` tìm cụm chỉ vị trí lựa chọn.

## Trạng thái

Chỉ người soát.
