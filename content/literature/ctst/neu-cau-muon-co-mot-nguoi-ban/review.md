# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 9 - chỉ phần đổi (`pnpm content:diff`), ghi chú lề và video bi-mat-cua-cao, section: cao-xuat-hien, cam-hoa-la-gi, duy-nhat, hanh-tinh-khac, doi-khac, chia-tay, bi-mat
- Nguồn đã đọc: `source-passage.txt` (đối chiếu từng ghi chú lề và lời video); không đọc lại ảnh `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` vì phần đổi không thêm kiến thức, bài tập hay card
- Phần đổi: 8 ghi chú lề (`annotations[].text`) viết lại, hai ghi chú chuyển câu neo (`l16-2` → `l17-1`, `l18-6` → `l18-7`); video `bi-mat-cua-cao`: kịch bản `s03-bi-mat` câu 1 thành "cáo tặng hoàng tử bé", hình `s01`/`s02` cho cáo buồn và hoàng tử bé bình thường, cáo vui từ chữ "hối", hai nhãn dời sang dưới cáo; clip `bai-hoc`, `lap-lai` lệch 0,13 giây theo lời mới.
- Kết quả soát mục vòng 8: cả 5 Nên sửa và 4 Góp ý đã sửa đúng. (1) `cam-hoa-la-gi` bỏ ghi chú khỏi `l16-2` (đáp án `cham-cau-giai-thich`), ghi chú mới ở `l17-1` hỏi nghĩa, không chỉ vị trí câu. (2) `duy-nhat` ghi chú ở `l18-7` đếm "duy nhất trên đời" (hai lần: `l18-7`, `l18-8`, cùng khối), không còn chép đề và nằm trên đáp án `l18-6` của `cham-neu-cam-hoa`. (3) `l52-4` có việc "Thay “cốt lõi” bằng “quan trọng nhất”" (đọc lại thành "Điều quan trọng nhất vô hình trong mắt trần", khớp lời video s03 câu 6) và vẫn giải nghĩa "mắt trần" trước câu luyện tập `noi-nghia-tu`; không trỏ tới `l53-1` (đáp án `cham-lap-lai-de-nho`). Ghi chú này cho trước nghĩa hai từ mà `noi-nghia-tu` hỏi, nhưng đó là câu luyện tập của card `nghia-tu`, kiểm tra điều vừa dạy, giống ghi chú "đơn điệu" ở `l31-1`. (4) `l31-6`, `l45-1` đổi "bạn" thành "hoàng tử bé". (5) Video: ảnh cắt ở giây 9,8, 15,5, 22,8 cho cáo buồn có giọt nước mắt, hoàng tử bé mặt bình thường; giây 24,2 cáo cười, nhãn "buồn, muốn khóc" và "không hối tiếc" nằm dưới cáo, khớp lời "cáo buồn đến muốn khóc, nhưng không hối tiếc" (22,1–23,6 giây). Góp ý 1–4: `l22-1` bỏ "liền" (sau câu có ba câu hỏi `l23-1`, `l25-1`, `l27-2`, cùng khối); `l8-2` "Đọc to từ này nhé"; `l39-1` "Đọc to câu này bằng giọng của cáo", không còn lặp đề `cao-se-khoc`; kịch bản s03 "cáo tặng hoàng tử bé", khớp `l47-3`, `l52-2`.
- Kết quả soát ghi chú mới: cả 8 ghi chú ≤ 12 chữ (dài nhất `l52-4`, 12 chữ), mỗi ghi chú là một việc (đọc to, đếm, so sánh, tìm, thay từ, nghĩ nghĩa), câu neo đúng câu ghi chú nói tới, việc làm được trong chính khối passage (`l31-6` so với `l31-7`, `l31-8`; `l45-1` tìm "màu lúa mì" trong chính câu). Không ghi chú nào lộ đáp án câu kiểm tra hay luyện tập cùng section (đã đối chiếu `htb-dang-buon`, `ai-noi-chua-cam-hoa`, `cham-cau-giai-thich`, `nghia-cam-hoa`, `cham-neu-cam-hoa`, `truoc-khi-cam-hoa`, `thu-vi-vi-sao`, `vi-sao-tho-dai`, `buoc-chan-goi-ra`, `noi-doi-khac`, `cao-se-khoc`, `khong-hoi-tiec`, `cham-lap-lai-de-nho`, `hong-khac-biet`, `bi-mat-la-gi`, `noi-nghia-tu`). Recap các section không đổi và vẫn khớp note.
- Cần người nghe duyệt (không phải lỗi nội dung): ba câu Whisper nghe lệch ở vòng 8 vẫn còn trong video: `bi-mat-cua-cao` "Màu lúa mì sẽ làm cáo nhớ bạn." nghe thành "như bạn" (giây ~26), "mắt trần" nghe thành "mắt chân" (giây ~41); `cam-hoa-la-gi` "Chưa cảm hoá thì…" nghe thành "Chứ cảm hoá" (giây ~37).
- `content:check`: 1 lỗi (`[review-hash]`, lệnh cuối vòng xoá), 0 cảnh báo
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở ipad, phone, ipad-landscape, ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/` (đã xem màn đọc có ghi chú của `cao-xuat-hien`, `cam-hoa-la-gi`, `duy-nhat`, `hanh-tinh-khac`, `doi-khac`, `chia-tay`, `bi-mat` ở khổ phone; ảnh chụp sau lần sửa)
- Kết luận: Đã xuất bản (`pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --approve`, 2026-09-30); 1 mục Góp ý chờ tác giả xử lý hoặc ghi backlog
- Bản đã review: `62af8fda2837b125625b453b98c20552282444024132d851b83d79f988138256` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

Không có.

## Góp ý

### 1. Recap, lời video và câu nối vẫn gọi hoàng tử bé là "bạn"

- Vị trí: recap section `doi-khac` và card `doi-khac` ("bước chân bạn như tiếng nhạc, lúa mì làm cáo nhớ bạn"), recap section `chia-tay` và card `cam-xuc-chia-tay` ("Màu lúa mì sẽ làm cáo nhớ bạn."), câu `rule` cùng chữ trong `video/projects/neu-cau-muon-co-mot-nguoi-ban/bi-mat-cua-cao/script.json` cảnh `s02-mau-lua-mi`, `$.exercises[?(@.id=="neu-cau-muon-co-mot-nguoi-ban.ex.noi-doi-khac")]` mục trái `buoc-chan` và mục phải `nho-ban`
- Nguồn: —
- Vấn đề: vòng này đã đổi "bạn" thành "hoàng tử bé" ở hai ghi chú (`l31-6`, `l45-1`) và ở lời video s03 vì bài gọi trẻ là "bạn" ("Bạn nhớ nhé"). Các câu trên vẫn dùng "bạn" theo cách cáo gọi, nên cùng một nhân vật mang hai tên trong một section, và câu tóm tắt "cáo nhớ bạn" có thể nghe như cáo nhớ người học. Chỉ là Góp ý vì ngữ cảnh ngay trước (lời thoại của cáo, hình cáo và hoàng tử bé) giúp hiểu đúng.
- Sửa: đổi "bạn" thành "hoàng tử bé" trong hai recap, hai card và câu `rule` của video (câu `rule` phải trùng recap, nên sửa cùng lúc rồi build lại video), và trong `noi-doi-khac` ("Bước chân hoàng tử bé", "Làm cáo nhớ hoàng tử bé").
