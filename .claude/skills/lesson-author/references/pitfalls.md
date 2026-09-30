# Bẫy khi soạn bài

## Màn hình

- KaTeX không ngắt dòng ở `\qquad`: hai công thức dài đặt cạnh nhau sẽ tràn màn hình điện thoại. Xếp dọc bằng `\begin{gathered} … \\ … \end{gathered}`.
- Không viết chữ Việt trong TeX (`\text{thừa số}`): KaTeX hiển thị bằng font dự phòng, chữ lệch dòng. Lời để trong `note` hay `caption`.
- Luỹ thừa trong câu chữ viết bằng ký tự mũ Unicode (2⁵, aⁿ), không viết `2^5`. Công thức cần tô màu thì đưa vào khối `formula`.

## Màu khái niệm

- Trong công thức, tô chính ký hiệu, không chỉ chú thích: `\concept{blue}{2}^{\concept{violet}{5}}` tô cả cơ số lẫn số mũ. Lint báo lỗi khi màu không thuộc `concepts` của bài.
- Câu hỏi mà màu chính là đáp án ("chạm vào cơ số", "gọi tên từng phần"): phần trẻ phải chạm hay gọi tên không mang màu khái niệm, ở cả đề, hình lẫn highlight (highlight trỏ vào phần đó thì bỏ `conceptId`).

## Bài tập

- Câu kiểm tra và câu luyện tập trong cùng section không dùng chung một hình cố định: làm xong câu này, trẻ chỉ cần chọn "phần còn lại" ở câu kia. Đổi số hoặc đổi hình.
- Đề chỉ có một câu chữ thì nấc 1 chỉ tô được cả câu. Muốn tô trúng chỗ hay sai, thêm khối `formula` có `\htmlId{<id>}{…}` quanh phần đó rồi trỏ `target: "part"`.

## Nguồn

- Thuật ngữ đã học trước lớp 6 mà trang SGK chỉ dùng, không định nghĩa (từ ghép, từ láy): chỉ dạy khi glossary ghi `"prerequisite": "tiểu học"` cho thuật ngữ đó, câu định nghĩa là câu chuẩn, gọn như sách lớp 6, ví dụ không gây tranh cãi (tránh từ ghép có hai tiếng cùng âm đầu như "hoa hồng"), và `sourceRef` của section, card ghi rõ "Kiến thức nền (tiểu học); câu 5 tr.26" (lint kiểm dấu này).
