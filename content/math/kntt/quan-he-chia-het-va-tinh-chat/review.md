# Review: Quan hệ chia hết và tính chất (`quan-he-chia-het-va-tinh-chat`)

- Bài: `content/math/kntt/quan-he-chia-het-va-tinh-chat/lesson.json`
- Vòng: 5 - chỉ phần đổi (`pnpm content:diff`: lời đọc tổng quan và 3 video), section: `chia-deu`, `uoc-boi`, `tong-chia-het`
- Nguồn đã đọc: không có (diff chỉ có video và lời đọc; đối chiếu với câu quy tắc, recap và quy ước của chính bài)
- `content:check`: 0 lỗi, 0 cảnh báo của bài
- `lesson:walk`: 0 FAIL, 0 cảnh báo, ảnh trong `.shots/walk/quan-he-chia-het-va-tinh-chat/`
- Kết luận: 0 Nghiêm trọng; 4 mục Nên sửa trong kịch bản video đã sửa và dựng lại trong vòng này
- Bản đã review: `3557fe62c7fa8b371e4786eca4a334f7ba8bc3081de3446db5622c634e4a259e` (`pnpm content:diff` so với bản này)

Đã soát: toàn bộ 44 câu của 3 kịch bản (toán, chữ dùng, "bạn", khớp câu quy tắc và quy ước "a · b là a được lấy b lần"), lời đọc tổng quan (chép nguyên văn hook, summary, goals, whyItMatters), câu mở đầu và một giọng Mỹ Duyên (`pnpm video:check`), mốc thời gian từng chữ, và khung hình cách 2,5 giây của cả 3 video (chữ rõ, không chồng, không lộ kết quả trước lời). Whisper sau khi dựng lại: mọi câu từ 97,1% trở lên.

## Nghiêm trọng

Không có.

## Nên sửa

### 1. Câu "Mỗi nhóm xếp vừa các túi 6 cái." khó hiểu (đã sửa)

- Vị trí: `tinh-chat-tong/script.json`, cảnh `s01-de` câu 4 và cảnh `s02-tong` câu 7 ("30 cũng xếp vừa các túi 6 cái.")
- Vấn đề: "xếp vừa các túi 6 cái" không nói rõ "túi 6 cái" là túi chứa 6 cái hay có 6 túi; Whisper nghe thành "cắt túi" (96,9%, phải đọc lại 4 lần). Trẻ dễ hiểu sai cỡ túi.
- Sửa: "Mỗi nhóm xếp đều vào các túi, mỗi túi 6 cái, không thừa." và "30 cái cũng xếp đều vào các túi, mỗi túi 6 cái." (cùng khuôn với câu "xếp đều vào các túi, mỗi túi 3 cái" của video `chia-het`). Hai câu mới khớp 100%.

### 2. "Bạn xếp đều ..." ngay sau "Bạn cú có ..." có hai cách hiểu (đã sửa)

- Vị trí: `chia-het/script.json` cảnh `s01-de` câu 3; `uoc-boi/script.json` cảnh `s01-de` câu 3
- Vấn đề: "Bạn" là trẻ đang xem (câu chào) nhưng sát sau "Bạn cú" (linh vật) nên không rõ ai xếp.
- Sửa: "Bạn cú xếp đều vào các túi, mỗi túi 3 cái." và "Bạn cú xếp đều vào các hộp, mỗi hộp 6 cái."; "Bạn" chỉ còn là trẻ ("Chào bạn", "Bạn nhớ nhé").

### 3. Câu "Phép nhân cũng cho ta ước." bỏ điều kiện "khác 0" của bài (đã sửa)

- Vị trí: `uoc-boi/script.json` cảnh `s04-tich` câu 1
- Vấn đề: note của bài nói "mỗi thừa số khác 0 là một ước của tích"; câu video nói rộng hơn (thừa số 0 không là ước), lệch quy tắc.
- Sửa: câu đánh `rule`, chép nguyên văn "Trong một phép nhân, mỗi thừa số khác 0 là một ước của tích."; `video:build` kiểm nguyên văn đạt.

### 4. Video `uoc-boi`: dấu nhân hiện ở "Phép nhân" và nhãn "ước" hiện khi chưa có số (đã sửa)

- Vị trí: `uoc-boi/index.html` cảnh `s04-tich`
- Vấn đề: dấu "·" bật lên ở chữ "nhân" đầu tiên (nằm trong câu giới thiệu, trước "24 bằng 6 nhân 4") và hai nhãn "ước" hiện dưới ô trống ở chữ "ước" của câu đó; hình có khe trống và nhãn chưa có số để chỉ.
- Sửa: dấu nhân bật ở "nhân" thứ hai, hai nhãn "ước" bật ở "6" và "4" của câu "Nên 6 và 4 đều là ước của 24". Đã xem lại khung hình: số hiện đúng lúc đọc, nhãn hiện sau số.

## Góp ý

### 1. Caption hình `tong-12-18-6` dùng cách nói đã bỏ khỏi video

- Vị trí: `$.sections[tong-chia-het].blocks[1]` (`visual.tong-12-18-6`)
- Vấn đề: caption "mỗi nhóm xếp vừa các túi 6 cái" cùng cách nói khó hiểu như câu video đã sửa.
- Sửa: tuỳ tác giả, đổi thành "mỗi nhóm xếp đều vào các túi 6 cái" (đổi lesson.json nên cần review lại, chưa làm trong vòng video).

### 2. Màn gần như trống khi đọc câu quy tắc dài

- Vị trí: `uoc-boi` cảnh `s04-tich` (khoảng 5 giây đầu) và `tinh-chat-tong` cảnh `s01-de` câu "Bạn cú có hai nhóm kẹo." (chưa có hình nhóm kẹo)
- Vấn đề: chỉ có linh vật; không sai nhưng hình không đi cùng lời. Không chặn.

### 3. Giọng Mỹ Duyên đọc "ước" nghe gần "ướt"

- Vị trí: `uoc-boi`, 2 câu có chữ "ước" (Whisper 97,1% và 97,8%)
- Vấn đề: đặc trưng giọng miền Nam; phụ đề vẫn đúng chữ. Giữ nguyên, vì đổi giọng là đọc lại cả bài.
