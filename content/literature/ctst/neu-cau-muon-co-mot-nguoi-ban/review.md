# Review: Nếu cậu muốn có một người bạn… (`neu-cau-muon-co-mot-nguoi-ban`)

- Bài: `content/literature/ctst/neu-cau-muon-co-mot-nguoi-ban/lesson.json`
- Vòng: 8 - chỉ phần đổi (`pnpm content:diff`), video và ghi chú lề, section: cao-xuat-hien, cam-hoa-la-gi, duy-nhat, hanh-tinh-khac, doi-khac, cach-cam-hoa, chia-tay, bi-mat
- Nguồn đã đọc: `source-passage.txt` (đối chiếu lời dẫn video và từng ghi chú lề); không đọc lại ảnh `sources/literature/neu-cau-muon-co-mot-nguoi-ban/` vì phần đổi không thêm kiến thức, bài tập hay card
- Phần đổi: ba video mới đứng đầu section (`ai-dang-noi` ở `cao-xuat-hien`, `cam-hoa-la-gi` ở `cam-hoa-la-gi`, `bi-mat-cua-cao` ở `bi-mat`) kèm 6 clip; 20 ghi chú lề (`annotations[].text`) viết lại thành việc cho trẻ.
- Kết quả soát video: lời dẫn, chuyển cảnh và câu không đánh dấu đều đúng văn bản và đúng người nói (hoàng tử bé hỏi "Cảm hoá nghĩa là gì?" đúng ba lần: l11-1, l13-2, l15-2; "Vậy thì bạn chẳng được gì cả" là lời hoàng tử bé; lúa mì vàng óng như tóc hoàng tử bé theo l31-15, l31-17). Mỗi clip gắn đúng card mà đoạn đó giảng (`ai-noi` s02–s04, `nghia-cam-hoa` s01–s02, `duy-nhat` s03–s04, `cam-xuc-chia-tay` s01–s02, `bai-hoc` s03, `lap-lai` s04). Hình trên contact sheet khớp lời, trừ phát hiện 5. Video giảng lại đúng nội dung card nên các câu luyện tập hỏi lại nội dung đó (`nghia-cam-hoa`, `bi-mat-la-gi`) là kiểm tra điều đã dạy, không phải lộ đáp án. Cần người nghe duyệt ba câu Whisper nghe lệch (không phải lỗi nội dung): `bi-mat-cua-cao` "Màu lúa mì sẽ làm cáo nhớ bạn." nghe thành "như bạn" (giây ~25), "mắt trần" nghe thành "mắt chân" (giây ~41); `cam-hoa-la-gi` "Chưa cảm hoá thì…" nghe thành "Chứ cảm hoá" (giây ~37).
- Kết quả soát ghi chú lề: cả 20 ghi chú ≤ 12 chữ, không còn "Để ý:", câu neo đều nằm trong khối passage và đúng câu ghi chú nói tới; các việc "đọc lại hai câu trước" (l29-1: l27-2, l28-1), "đếm mấy lần" (l11-1: ba câu trong khối), "tìm câu cáo nói trước đó" (l57-1: l56-4), "đọc tiếp" (l31-13, l37-1 trong khối; l47-3 dẫn sang section `bi-mat` ngay sau) đều làm được. Phát hiện 1–4 dưới đây.
- `content:check`: 1 lỗi (`[review-hash]`, lệnh cuối vòng xoá), 1 cảnh báo ("3 id(s) not in ids.lock.json", khoá sau khi duyệt)
- `lesson:walk`: 0 FAIL, 0 cảnh báo ở ipad, phone, ipad-landscape, ảnh trong `.shots/walk/neu-cau-muon-co-mot-nguoi-ban/` (đã xem màn video có phụ đề và thanh điều khiển, màn đọc có ghi chú của `cao-xuat-hien`, `cam-hoa-la-gi`, `bi-mat`)
- Kết luận: Đã xuất bản (`pnpm content:hash neu-cau-muon-co-mot-nguoi-ban --approve`, 2026-09-30); 5 mục Nên sửa, 4 mục Góp ý chờ tác giả xử lý hoặc ghi backlog
- Bản đã review: `bc4a79c2ca5c78b118ea49e682d7eb317d93b48632fe062d05689509cdafada1` (`pnpm content:diff` so với bản này)

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Ghi chú lề chỉ thẳng câu trả lời của câu kiểm tra `cham-cau-giai-thich`

- Vị trí: `$.sections[1].blocks[1].annotations[1]` (section `cam-hoa-la-gi`, câu neo `l16-2`)
- Nguồn: —
- Vấn đề: "Cáo giải thích “cảm hoá” ở câu này." gắn trên `l16-2`, mà câu kiểm tra của section yêu cầu "Chạm vào câu cáo giải thích “cảm hoá” nghĩa là gì" với đáp án `l16-2`. Trẻ chỉ cần nhớ ô ghi chú, không phải tự tìm câu, nên câu kiểm tra mất tác dụng. Chọn Nên sửa vì trẻ không học sai, và nghĩa của từ đã được dạy ngay sau đó (note, video).
- Sửa: bỏ ghi chú khỏi `l16-2`, chuyển sang một việc về nghĩa, không chỉ vị trí câu, ví dụ gắn `l17-1`: "Nghĩ xem: “gần gũi hơn” là thế nào?".

### 2. Ghi chú lề nằm trên câu trả lời và chép lại đề của câu kiểm tra `cham-neu-cam-hoa`

- Vị trí: `$.sections[2].blocks[0].annotations[0]` (section `duy-nhat`, câu neo `l18-6`)
- Nguồn: —
- Vấn đề: "Tìm chữ “nếu”: điều gì sẽ xảy ra khi được cảm hoá?" gắn đúng trên `l18-6`, trong khi câu kiểm tra hỏi "Chạm vào câu cho biết điều sẽ xảy ra nếu hoàng tử bé cảm hoá cáo" với đáp án `l18-6`. Ghi chú là đề bài kèm luôn vị trí đáp án. (Video `cam-hoa-la-gi` ở section trước cũng đã đọc câu "tụi mình sẽ cần đến nhau", nên phần tự tìm trong section này càng cần giữ.)
- Sửa: gắn ghi chú sang câu khác và đổi việc, ví dụ neo `l18-7`: "Đếm xem cáo nói “duy nhất trên đời” mấy lần." (hai lần, `l18-7` và `l18-8`, đều trong khối).

### 3. Ghi chú `l52-4` chỉ giải nghĩa từ, không có việc cho trẻ

- Vị trí: `$.sections[8].blocks[2].annotations[1]` (section `bi-mat`, câu neo `l52-4`)
- Nguồn: —
- Vấn đề: "“Cốt lõi”: quan trọng nhất. “Mắt trần”: cái nhìn thường." chưa theo yêu cầu mỗi ghi chú là một việc cụ thể cho trẻ, khác các ghi chú giải nghĩa còn lại (`l31-1`, `l37-1` đều có việc đi kèm).
- Sửa: thêm việc trong giới hạn 12 chữ, ví dụ "Đọc câu này, thay “cốt lõi” bằng “điều quan trọng nhất”.". Nghĩa "mắt trần" vẫn phải được dạy trước câu luyện tập `noi-nghia-tu` cùng section (đã có trong video `bi-mat-cua-cao` s03 "chỉ nhìn bằng mắt thì không thấy"; nếu bỏ khỏi ghi chú thì cân nhắc thêm vào note của section). Tránh việc "tìm câu hoàng tử bé nhắc lại", vì câu đó (`l53-1`) là đáp án của `cham-lap-lai-de-nho`.

### 4. "bạn" trong hai ghi chú dễ bị hiểu là chính trẻ

- Vị trí: `$.sections[4].blocks[0].annotations[1]` (section `doi-khac`, neo `l31-6`), `$.sections[7].blocks[0].annotations[1]` (section `chia-tay`, neo `l45-1`)
- Nguồn: —
- Vấn đề: "So sánh bước chân của bạn với các bước chân khác." và "Tìm điều cáo vẫn còn sau khi bạn đi." dùng "bạn" theo cách cáo gọi hoàng tử bé, nhưng ghi chú là lời nói với trẻ (video của bài cũng gọi trẻ là "bạn"). Trẻ có thể hiểu là "bước chân của em". Đề mơ hồ theo checklist là Nên sửa.
- Sửa: "So sánh bước chân hoàng tử bé với các bước chân khác." (11 chữ); "Tìm điều cáo vẫn còn khi hoàng tử bé đi." (10 chữ).

### 5. Video `bi-mat-cua-cao`: lúc nói "cáo buồn đến muốn khóc", hình cho cáo cười còn hoàng tử bé khóc

- Vị trí: `video/projects/neu-cau-muon-co-mot-nguoi-ban/bi-mat-cua-cao/index.html`, cảnh `s01-chia-tay` (`pose(prince1, "prince-sad", W(sid, "buồn"))`) và `s02-mau-lua-mi` (`prince2` dùng `prince-sad`, `fox2` chuyển `fox-happy` từ chữ "được"); clip `cam-xuc-chia-tay` gắn card `cam-xuc-chia-tay`
- Nguồn: —
- Vấn đề: ở giây ~9–10 lời nói "Cáo buồn lắm." thì mặt hoàng tử bé chuyển sang buồn; từ giây ~16 đến ~26 hoàng tử bé có giọt nước mắt, cáo cười, và nhãn "buồn, muốn khóc" hiện ra giữa hai nhân vật đúng lúc đọc "Chia tay, cáo buồn đến muốn khóc…". Văn bản không nói hoàng tử bé khóc; card này dạy cảm xúc của cáo, nên hình dễ làm trẻ gắn "buồn, muốn khóc" với hoàng tử bé.
- Sửa: ở `s01` đổi mặt cáo (không phải hoàng tử bé) tại chữ "buồn"; ở `s02` để hoàng tử bé ở `prince-calm`, cho cáo buồn khi hiện nhãn "buồn, muốn khóc" rồi mới chuyển `fox-happy` tại "không hối tiếc", hoặc đặt nhãn sát dưới mặt cáo. Build lại video và chạy lại walk.

## Góp ý

### 1. "hỏi liền mấy câu" không khớp đoạn văn

- Vị trí: `$.sections[3].blocks[0].annotations[0]` (section `hanh-tinh-khac`, neo `l22-1`)
- Nguồn: —
- Vấn đề: sau `l22-1` cáo hỏi ba câu (`l23-1`, `l25-1`, `l27-2`) nhưng xen giữa là lời đáp của hoàng tử bé, nên "liền" có thể làm trẻ chỉ đếm được một.
- Sửa: "Đếm xem sau câu này, cáo hỏi mấy câu."

### 2. "Nhớ từ này nhé" chưa phải việc trẻ làm được và thấy được

- Vị trí: `$.sections[0].blocks[3].annotations[1]` (section `cao-xuat-hien`, neo `l8-2`)
- Nguồn: —
- Vấn đề: "Nhớ" không có thao tác cụ thể như các ghi chú khác.
- Sửa: ví dụ "Lần đầu gặp từ “cảm hoá”. Đọc to từ này nhé."

### 3. Ghi chú `l39-1` hỏi trước câu kiểm tra `cao-se-khoc` và thu còn hai lựa chọn

- Vị trí: `$.sections[7].blocks[0].annotations[0]` (section `chia-tay`, neo `l39-1`)
- Nguồn: —
- Vấn đề: "Đọc câu này: cáo đang vui hay buồn?" gần như chính câu kiểm tra "Khi sắp chia tay, cáo cảm thấy thế nào?" (bốn lựa chọn), trên đúng câu căn cứ. Không nói đáp án, nhưng làm câu kiểm tra thành câu lặp lại.
- Sửa: ví dụ "Đọc to câu này bằng giọng của cáo."

### 4. Lời dẫn video "cáo tặng bạn một món quà"

- Vị trí: `video/projects/neu-cau-muon-co-mot-nguoi-ban/bi-mat-cua-cao/script.json`, cảnh `s03-bi-mat`, câu 1
- Nguồn: —
- Vấn đề: video gọi trẻ là "bạn" ("Bạn nhớ nhé"), nên "cáo tặng bạn" có thể nghe như cáo tặng quà cho người xem. Hình hộp quà giữa cáo và hoàng tử bé giúp hiểu đúng, nên chỉ là Góp ý.
- Sửa: "Lúc vĩnh biệt, cáo tặng hoàng tử bé một món quà."
