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

## Lỗi hay lặp mà máy chưa bắt hết

Mỗi dòng là việc tự soát trước khi gọi review; triệu chứng, ví dụ thật và nguyên nhân ở mục tương ứng trong `docs/lessons-learned/`.

- Tự giải từng nhiễu theo đúng câu chữ đề, nhất là đề "chắc chắn sai", "lớn nhất", câu Ngữ văn xếp loại từ, và bài `order`/`fillBlank` có thể có thứ tự đúng khác (LL-01).
- Hình nấc 2, chú thích lề `passage` và chữ in sẵn trong `segments` của `fillBlank` không được cho biết kết quả của đề (LL-02).
- Màu trong visual và video: cách làm sai không mang màu của cách làm đúng (LL-03).
- Số của câu kho ôn khác cả số trong recap, ví dụ màn quy tắc và trạng thái đầu của hình tương tác (LL-07).
- Đọc lại mỗi đề như trẻ chỉ thấy đúng màn đó: đủ dữ kiện, một tên chỉ một tập hợp, "bạn" không lẫn với trẻ (LL-10).
- Thuật ngữ, quy tắc dùng trong đề, nhiễu, gợi ý phải đã dạy ở section trước; câu kho ôn gắn card cần ý dạy ở section sau thì đổi card (LL-09).
- Nhiễu ứng với lỗi thật, cùng độ dài và hình thức với đáp án (LL-14).
- Sửa chữ thì sửa cả hình dùng chữ đó; hình lời giải vẽ đúng số của đề (LL-15).
- Câu luyện, câu ôn tối đa 2 phép tính nhẩm (LL-18); xưng "bạn", không lộ số trang sách cho trẻ (LL-19).
