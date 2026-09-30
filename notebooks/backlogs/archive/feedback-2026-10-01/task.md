Archived: 01/10/2026, sections A and B done; leftovers in `../../video-opening-retrofit/task.md` and `../../lesson-phep-cong-phep-tru/task.md`.

# Góp ý của chủ dự án sau khi bé dùng thử (01/10/2026)

Ảnh minh hoạ: các tệp `NN.png` trong thư mục này (số ảnh ghi trong ngoặc).
Đồng nghiệp nhận xét: app thú vị, UI/UX đẹp, kiểu Duolingo, đúng hướng. Giữ phong cách hiện tại.

## A. Giao diện, trải nghiệm (một đợt) — xong 12/12 (kế hoạch: `plan.md`)
1. [x] Trang môn: hiện số chương/bài như sách, vd "Chương I · Bài 4", để phụ huynh tra nhanh (17). Cần trường chương/số bài trong nội dung.
2. [x] Tiêu đề bài ghi "Bài 4: Phép cộng và phép trừ số tự nhiên"; tiêu đề phần trong player ghi rõ là phần ("Phần 3: Nhân, chia trước…") để không bị hiểu là câu hỏi (18).
3. [x] Bé không phân biệt màn lý thuyết và màn bài tập: mỗi màn có nhãn rõ "Lý thuyết" / "Bài tập" (kèm "Kiểm tra nhanh" / "Luyện tập"). Chỉ sửa UI, không sửa video.
4. [x] Màn "cùng làm" (lý thuyết có chạm): chạm đúng thì màn chuyển ngay sang bước giải thích, bé không kịp thấy mình đúng hay sai (19, 20). Chạm đúng phải dừng lại, hiện rõ là đúng (màu, dấu, âm thanh), bé bấm để đi tiếp. Chạm sai hiện đang đúng (21). Bài tập đang đúng (22).
5. [x] Âm thanh "click" nhẹ khi chạm lựa chọn/đáp án (âm thanh dùng chung, tạo một lần).
6. [x] Tiêu đề trang môn ghi "Môn: Toán".
7. [x] Từ màn "Giới thiệu bài" bấm "Học tiếp" sang phần học thì không có nút quay lại màn giới thiệu.
8. [x] Chấm tiến độ bấm được để về đúng bước đã qua; có nhãn "Câu 1", "Câu 2"… (hoặc "Lý thuyết 1") (23).
9. [x] Nút "Bỏ qua" cho bài tập (bài khó, không muốn làm, nội dung không phù hợp): đi tiếp không cần đúng; ghi là bỏ qua (không chấm mức nhớ), trang phụ huynh thấy được.
10. [x] Màn hướng dẫn thao tác là hình minh hoạ nhưng bé tưởng tương tác, chạm mãi không thấy gì, hỏi có phải lỗi app (24, 25). Hoặc làm hình mẫu chạm được thật, hoặc ghi rõ "Hình mẫu, chưa cần chạm" và bỏ dáng vẻ bấm được.
11. [x] Bài điền: đặt thẻ vào ô trống làm chữ rớt dòng, nội dung nhảy vị trí (26, 27). Ô trống phải giữ chỗ đủ rộng từ đầu.
12. [x] Chạm sticker không có hiệu ứng, âm thanh; chưa tạo sức hút sưu tầm (28). Thêm hiệu ứng, âm thanh, và màn chi tiết (tên, bài, tiến độ, cách nhận).

## B. Video và giọng đọc — xong 3/3
13. [x] Bài 4 `phep-cong-phep-tru` chưa có video, lời đọc giới thiệu. Xong: lời đọc giới thiệu và 3 video (`ghep-tron`, `dat-tinh-tru`, `tim-so-hang`) giọng Mỹ Duyên; chờ reviewer kiểm (`lesson-phep-cong-phep-tru/task.md`).
14. [x] Mọi video mở đầu bằng câu chào/giới thiệu ("Ở bài này chúng ta sẽ học…") và vài giây đệm trước nội dung, để bé không mất mấy chữ đầu. Ghi thành luật trong skill `lesson-video` và kiểm tự động được (câu đầu của `script.json` là câu mở đầu). Xong: cờ `opening` trên câu đầu, `PAUSE.leadIn` = 1 s, kiểm trong `pnpm video:check` và `tests/video/voices.test.ts`; 9 video cũ nằm trong `openingExempt`, làm lại ở `video-opening-retrofit/task.md`.
15. [x] Thêm giọng nữ để đỡ nhàm chán giọng nam: agent chọn 2–3 ứng viên, tạo mẫu nghe thử (cùng một đoạn), chủ dự án chọn. Sau khi chọn, ghi giọng vào cấu hình; bài nào dùng giọng nào do skill quyết định theo quy tắc rõ ràng.
    - Chủ dự án đã chọn (01/10/2026), sau khi nghe 11 giọng nữ VieNeu và một bản nhân bản giọng: giọng nữ là preset VieNeu "Mỹ Duyên" (giọng miền Nam), giọng nam giữ "Hải Đăng". Agent chọn giọng cho từng bài theo không khí của bài. Mỗi bài dùng đúng một giọng cho lời đọc giới thiệu và mọi video, không xen nam và nữ trong một bài. Giọng khai một lần cho cả bài; lệnh dựng lời đọc và video đọc từ đó; kiểm tra tự động báo lỗi khi một bài có kịch bản dùng giọng khác. Các bài đã có video đều dùng Hải Đăng, không phải đọc lại. Xong: giọng khai trong `video/projects/<bài>/media.json`, danh sách giọng ở `video/voices.ts`, luật chọn giọng trong skill `lesson-video`.
