# Review: Quan hệ chia hết và tính chất (`quan-he-chia-het-va-tinh-chat`)

- Bài: `content/math/kntt/quan-he-chia-het-va-tinh-chat/lesson.json`
- Vòng: 7 - chỉ phần đổi (`pnpm content:diff`), section: `quan-he-chia-het-va-tinh-chat.section.tong-chia-het`, `quan-he-chia-het-va-tinh-chat.section.so-du`
- Nguồn đã đọc: không có (ảnh `sources/` không mở; diff chỉ đổi một caption và một hình gợi ý, đối chiếu với đề, câu quy tắc, recap và lời video của chính bài)
- `content:check`: 1 lỗi (`[review-hash]`, bình thường vì bài đã đổi sau lần review), 0 cảnh báo của bài
- `lesson:walk`: không chạy (điều phối đã chụp riêng hình mới `so-du-goi-y-15-7` ở iPad và điện thoại, từng bước 1 và 2 cùng trạng thái cuối; reviewer đã xem các ảnh đó)
- Kết luận: Đã xuất bản: 0 Nghiêm trọng, 0 Nên sửa, 0 Góp ý
- Bản đã review: `0ea4ba2120df39e921563ad6ded982791bb19b6cf195fe57e6dcb0fbf5c9c7fe` (`pnpm content:diff` so với bản này)

## Phần đổi đã soát

1. `ex.dien-du-14-7`, `hints.hintVisualId`: `so-du-goi-y-15-10` thành `so-du-goi-y-15-7`.
   - Toán đúng: a = 15 · q + 7; 15 · q chia hết cho 5; 7 không chia hết cho 5 nên a không chia hết cho 5. Nhãn cuối và đáp án "không chia hết" đồng dạng với câu, không còn ngược đáp án như hình cũ.
   - Nấc 2 theo luật: số khác đề (15, 7, 5 so với 14, 3, 7), cùng dạng, dừng ở "?" trước dòng kết luận. Ảnh bước 1 (a = 15 · q + 7, ba "?"), bước 2 (thêm 15 · q chia hết cho 5, còn hai "?") và trạng thái cuối (ba dòng, một "?") đều không hiện dòng kết luận ở nấc 2; không có tag màu nào lộ trước. Không chép số của câu (LL-02, LL-15 đạt).
   - Đúng cách dạy của bài: đúng khung "số hạng chia hết + số hạng không chia hết thì tổng không chia hết" ở các màn quy tắc `so-du`, cùng dạng ví dụ `so-du-khong-chia-het-5` (10 · q chia hết cho 5, 4 không chia hết cho 5).
   - Ký hiệu và màu khớp bài: `\chiahet`, `\khongchiahet` hiển thị đúng ở ảnh iPad và điện thoại; tag `pink` cho "không chia hết", `teal` cho "chia hết" như `so-du-khong-chia-het-5` và `so-du-giai-12-9`. Chữ và số lớn, không chồng, không cắt (LL-12 đạt).
   - `so-du-goi-y-15-10` chỉ còn dùng cho `chon-12q-9` (a = 12 · q + 9, đáp án chia hết cho 3): hình chia hết cho 5 vẫn đồng dạng và không lộ đáp án 3; không hỏng.
2. Section `tong-chia-het`, `blocks[1].caption` của `tong-12-18-6`: "Hai nhóm kẹo, 12 cái và 18 cái. Mỗi nhóm chia đều vào các túi 6 cái, không thừa cái nào."
   - Toán đúng: 12 = 6 · 2, 18 = 6 · 3. Hai câu ngắn (câu dài nhất 13 âm tiết), không "…", không phủ định kép ("không thừa cái nào" nói về kẹo, không phải đáp án), từ lớp 6.
   - Không lộ nhầm quy tắc và không nói tổng 30 hay kết luận trước hình; quy tắc vẫn nằm ở `note` có `rule: true` ngay sau.
   - Lời video `tinh-chat-tong` (`video/projects/quan-he-chia-het-va-tinh-chat/tinh-chat-tong/script.json`, chỉ đọc): cảnh `s01-de` nói "Nhóm một có 12 cái, nhóm hai có 18 cái" và "Mỗi nhóm xếp đều vào các túi, mỗi túi 6 cái, không thừa." Khớp caption mới, không mâu thuẫn.

## Mục khác cùng section

- `tong-chia-het`: `note` quy tắc và recap giống nguyên văn (recap caption trùng câu `rule: true`); `checkIds` `tong-14-21` (7, 14, 21) và `practiceIds` `chon-nhieu-tong-8` (8, 16, 24, 32, 40) không trùng số 12, 18, 6 của hình, nhiễu vẫn không thành đáp án đúng. Không hỏng.
- `so-du`: `note` quy tắc và recap giống nguyên văn; `chon-du-8-5` (kiểm tra) và `chon-12q-9` (luyện tập) vẫn đúng đáp án và `explain`; hình gợi ý mới không trùng hình với hai câu này (15 và 7 không phải số của `chon-du-8-5` hay `chon-12q-9`); các hình bài giảng `so-du-34-10`, `so-du-chia-het-2`, `so-du-khong-chia-het-5` không đổi, không bị hình mới chép lại. Không hỏng.

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

Không có.
