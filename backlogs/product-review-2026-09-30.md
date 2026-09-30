# Review sản phẩm theo 6 tiêu chí của chủ dự án (đêm 2026-09-29 → sáng 2026-09-30)

Nguồn: video + ảnh `.shots/evidence/morning-report/{ipad,phone}/`, chạy thử live ở 390×844, 820×1180, 1180×820.

| Tiêu chí | Điểm ban đầu |
|---|---|
| 1. Dễ dùng | 3/5 |
| 2. Phù hợp trẻ em | 3/5 |
| 3. Font rõ, dễ đọc | 3/5 |
| 4. Nội dung, trình bày, ôn tập (trẻ / phụ huynh) | 2,5/5 (trẻ 3, phụ huynh 1) |
| 5. Bố cục tinh tế, responsive | 2/5 |
| 6. Skill | 3/5 |

## Việc sửa rõ ràng (làm ngay)
1. Hình gợi ý nấc 2 / lời giải nấc 3 nằm dưới mép màn ở mọi khổ; nấc 3 không thấy đáp án → đưa vào tầm nhìn (thay chỗ bàn phím hoặc tự cuộn).
2. Thanh "Kiểm tra" dính đáy che hàng phím cuối (phone, iPad ngang).
3. Phiên ôn: tóm tắt tự đóng 3 giây + chạm đâu cũng bỏ qua; hiện cả sau câu đúng → chỉ sau câu sai, chỉ nút "Tiếp".
4. Phím "mũ" chưa được dạy trước câu nhập luỹ thừa đầu tiên; phím "," thừa khi không có số thập phân.
5. Định nghĩa nằm trong caption xám 16px; tóm tắt chỉ có công thức trần; màn chỉ có một note/công thức.
6. Tô vàng nấc 1 đè lên lựa chọn sai của trẻ, trông như đang chọn.
7. Học tiếp phải bấm 4 lần; không có "Học tiếp"; phần kế tiếp không nổi trên trang bài.
8. Công thức KaTeX mảnh, nhỏ, lệch kiểu chữ số với visual.
9. iPad dọc: nội dung dồn phần ba trên, giữa trống; iPad ngang: một cột, chưa 2 cột; phone: cú đứng riêng một hàng; ô môn lệch tiêu đề khi không có dòng phụ.
10. Phiên ôn hỏi lại đúng câu vừa luyện; `cham-so-mu` dùng lại hình 6⁴; thiếu "phép nâng lên luỹ thừa"; câu chuyện nhà vua không có kết.
11. Skill: thiếu luật sư phạm cho người học chậm; mâu thuẫn "block = màn" với pitfalls; review không nhìn màn hình; mục Nên sửa trốn vào backlog mãi; bước chạy thử thủ công không có script.
12. Hai nút "Tiếp" khi reduced motion; hạt số 12–13px; chữ "0 ngày" nghe như chấm điểm; hình từng bước để lỗ trắng.

## Cần chủ dự án quyết
- Trần số bước mỗi phần (đề xuất ≤ 8 bước: 4 khối + 3–4 câu) và chia phần 1 thành hai.
- Nới luật "không chữ": bong bóng lời của cú ở nấc 2, nấc 3 và khi đúng (1 câu).
- Mức phần thưởng ở màn "Xong phần" / "Ôn xong" (sticker đầy dần theo phần?).
- Trang phụ huynh tối thiểu có PIN (thời lượng, phần đã xong, lỗi hay gặp) làm trước mốc Go-live hay không.

## Vòng 2 (sau đợt sửa đêm)

| Tiêu chí | Vòng 1 | Vòng 2 |
|---|---|---|
| 1. Dễ dùng | 3 | 3,5 |
| 2. Phù hợp trẻ em | 3 | 3,5 |
| 3. Font rõ | 3 | 3,5 |
| 4. Nội dung / ôn tập (trẻ · phụ huynh) | 2,5 (3 · 1) | 3 (3,5 · 1) |
| 5. Bố cục | 2 | 3 |
| 6. Skill | 3 | 3,5 |

Việc sửa rõ ràng còn lại: bàn cờ tràn khung ở iPad ngang (walk cần báo tràn); cú chiếm cột làm gãy lựa chọn / ô điền trên iPad dọc; gợi ý nấc 2 bị đẩy khỏi màn khi mở lại bàn phím (phone); recap phần 1 bốn ý; số mũ Unicode nhỏ trong câu và lựa chọn; "Hỏi lại" trùng câu vừa luyện (card cần ≥ 3 câu); 4 mục Nên sửa trong backlog bài; khung xám khi visual đang tải; nút "Phát" hiện lại sau animation; iPad ngang cột hẹp; chữ "sticker" rơi dòng; số thẻ ở màn ôn xong.

Cần chủ dự án quyết thêm: khoá thứ tự phần / "Học tiếp" theo phần đầu tiên chưa học; bỏ hẳn tô vàng ở nấc 1.

## Trạng thái khi tạm dừng (sáng 2026-09-30)
Đợt sửa vòng 2 dừng giữa chừng theo yêu cầu. Đã commit: tóm tắt ngắn + lint độ dài recap và ≥ 3 câu/card; khung trả lời full width, iPad ngang 2:3, dải gợi ý khi mở lại bàn phím; số mũ trong chữ dễ đọc, công thức/ô điền không gãy dòng; visual rộng co theo cột, preload visual; walk báo tràn ngang và kiểm gợi ý sau khi mở lại bàn phím.
Chưa xong / cần kiểm lại: thay đổi dở chưa commit ở `src/exercises/fill-blank/fill-blank-answer.tsx` + test; nút "Phát" sau animation; chữ "sticker" rơi dòng + số thẻ ở màn ôn xong; review lại bài luỹ thừa bằng subagent mới + approve (hash có thể đang lệch); chạy gate đầy đủ + `lesson:walk`.
Hook `github-identity-guard.sh` hiện chặn mọi lệnh git ghi trong repo (đòi email tomosia) — cần chủ dự án chốt mapping `TutorStudent → rubykachu` trước khi commit tiếp.

## Quyết định (chủ dự án giao Claude tự chốt, 2026-09-30)
1. Mỗi phần tối đa 4 màn giải thích + 4 câu (kiểm tra + luyện tập), cộng màn tóm tắt; `content:check` chặn khi vượt. Phần dài thì tách.
2. Cú nói một câu ngắn (bong bóng lời) ở nấc 2, nấc 3 và khi đúng; nấc 1 vẫn không chữ.
3. Màn "Ôn xong" có tiến độ; sticker của bài tô màu dần theo số phần đã xong.
4. Làm trang phụ huynh tối thiểu có PIN ngay (đọc dữ liệu trên máy; đồng bộ để mốc Go-live).
5. Không khoá thứ tự phần; "Học tiếp" luôn trỏ phần đầu tiên chưa xong.
6. Bỏ tô vàng ở nấc 1: rung + viền cam cho câu trả lời; gợi ý trong đề dùng viền màu khái niệm, không dùng nền vàng.
Mapping hook `TutorStudent → rubykachu` đã thêm vào `~/.claude/hooks/github-identity-guard.sh`.
