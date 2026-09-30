---
name: import-source
description: Nhận yêu cầu soạn bài từ lời tự do của chủ dự án - đọc hồ sơ người học, hỏi đúng phần còn thiếu bằng câu hỏi có lựa chọn, chốt bảng kế hoạch, nạp trang PDF vào sources/, rồi giao cho lesson-author. Chỉ chạy khi chủ dự án gõ "/import-source <mô tả>", ví dụ "/import-source soạn bài 6 toán kntt từ ~/Downloads/toan6-tap1.pdf", "/import-source nạp sách bài tập ngữ văn", "/import-source bắt đầu chương 2".
disable-model-invocation: true
model: sonnet
---

# Nhận nguồn và bắt đầu soạn bài

Mọi bước theo `references/intake.md`.

1. **Đọc lời chủ dự án** (phần sau `/import-source`): PDF, sách, môn, bài, trang, mong muốn riêng.
2. **Đọc `docs/learner.md`**, suy mọi mục của "Danh mục".
3. **Hỏi phần còn thiếu hay đã cũ** theo "Cách hỏi".
4. **Trình "Bảng kế hoạch"** và chờ chủ dự án đồng ý.
5. **"Nạp nguồn"** cho từng bài.
6. **Giao việc.** Một bài: skill `lesson-author`. Nhiều bài: `lesson-author` mục "Nhiều bài một lúc". Chuyển kèm bảng kế hoạch và các lỗ hổng cần bắc thang.
