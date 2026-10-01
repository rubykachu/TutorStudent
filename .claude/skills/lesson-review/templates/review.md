# Review: <tiêu đề bài> (`<id bài>`)

- Bài: `<đường dẫn lesson.json>`
- Vòng: <số> - <toàn bài, <số> reviewer song song + tổng hợp | chỉ phần đổi (`pnpm content:diff`), section: <id>>
- Nguồn đã đọc: `sources/<subject>/<id bài>/` - <các trang đã đọc, vd p22, p23-24> | không có
- `content:check`: <số> lỗi, <số> cảnh báo của bài
- Đọc hiểu (Haiku, lượt 1): <số Hiểu rõ> / <số Hiểu mơ hồ> / <số Khó hiểu>; tệp `.shots/review/<id bài>/doc-hieu.md` | không chạy (chữ không đổi)
- `lesson:walk`: <số> FAIL, <số> cảnh báo, ảnh trong `.shots/walk/<id bài>/`
- Kết luận: <Đã xuất bản | Đã ghi reviewedHash, chờ quản trị viên đặt published | Chưa đạt: còn <số> lỗi Nghiêm trọng>

## Nghiêm trọng

### 1. <vấn đề, một dòng>

- Vị trí: `<JSON path, vd $.exercises[3].hints.highlight[0]>` (`<id exercise, card hoặc section>`)
- Nguồn: <tr.22, `p22.png`> | —
- Vấn đề: <sai gì, vì sao trẻ bị ảnh hưởng>
- Sửa: <thay đổi cụ thể>

## Nên sửa

<Cùng khuôn như trên. Không có thì ghi "Không có.">

## Góp ý

<Cùng khuôn như trên. Không có thì ghi "Không có.">
