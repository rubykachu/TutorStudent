# Design system — Tutor

Nguồn duy nhất cho giao diện. Token định nghĩa ở `src/app/globals.css` (Tailwind v4 `@theme`); component không dùng mã màu hex trực tiếp.

Điều chỉnh so với bộ đề xuất chung cho app giáo dục trẻ em, theo nhu cầu của trẻ thiếu tập trung:
- Giữ: bảng màu "Kids Learning" (xanh học tập), phong cách tối giản, khoảng trắng rộng.
- Bỏ: font Comic Neue (không có bộ ký tự tiếng Việt), màu đỏ cho trạng thái sai, mẫu bố cục landing page/chuyển đổi (không phù hợp app học).
- Thêm: màu khái niệm, trạng thái phản hồi 3 nấc, linh vật.

## 1. Nguyên tắc

1. **Một màn hình, một việc.** Không sidebar, không nhiều cột nội dung cùng lúc khi đang học.
2. **Hình trước, chữ sau.** Chữ giải thích ≤ 2 câu mỗi khối.
3. **Yên tĩnh khi học, vui khi xong.** Hiệu ứng mạnh chỉ ở khoảnh khắc thưởng (xong phần, nhận sticker).
4. **Sai không đáng sợ.** Sai = cam + linh vật gợi ý, không đỏ, không tiếng báo lỗi gắt (chỉ một tiếng "oops" trầm, nhẹ).
5. **Màu mang nghĩa, nhưng không chỉ màu.** Mỗi khái niệm có màu + ký hiệu hình (tròn, vuông, tam giác…) để trẻ mù màu vẫn phân biệt.

## 2. Màu

Chỉ giao diện sáng. Mọi cặp chữ/nền đã kiểm tra tương phản WCAG AA (≥ 4.5:1).

### Nền tảng
| Token | Hex | Dùng cho | Tương phản |
|---|---|---|---|
| `--color-background` | `#F8FAFC` | Nền app | — |
| `--color-surface` | `#FFFFFF` | Thẻ, khung bài tập | — |
| `--color-foreground` | `#1E293B` | Chữ chính | 13.98 trên nền |
| `--color-muted` | `#F1F5F9` | Nền phụ, ô chưa chọn | — |
| `--color-muted-foreground` | `#475569` | Chữ phụ | 7.24 trên nền |
| `--color-border` | `#E2E8F0` | Viền | — |
| `--color-primary` | `#2563EB` | Nút chính, liên kết | 5.17 với chữ trắng |
| `--color-ring` | `#2563EB` | Viền focus (2px, offset 2px) | — |

### Màu môn
| Token | Hex | Môn | Tương phản chữ trắng |
|---|---|---|---|
| `--color-subject-math` | `#2563EB` | Toán | 5.17 |
| `--color-subject-literature` | `#B4533F` | Ngữ văn (hồng đất) | 4.94 |
| `--color-subject-geography` | `#0F766E` | Địa lí (xanh ngọc) | 5.47 |

Địa lí dùng xanh ngọc thay vì xanh lá để không trùng màu "đúng".

### Phản hồi
| Token | Hex | Dùng cho |
|---|---|---|
| `--color-correct` | `#15803D` | Viền/biểu tượng đúng (5.02 với trắng) |
| `--color-correct-soft` | `#F0FDF4` | Nền ô đúng; chữ trên nền này dùng `#166534` (6.81) |
| `--color-retry` | `#C2410C` | Viền/biểu tượng sai — "thử lại" (5.18 với trắng) |
| `--color-retry-soft` | `#FFF7ED` | Nền ô sai; chữ trên nền này dùng `#9A3412` (6.88) |
| `--color-highlight` | `#FDE68A` | Nền của thứ đang được chọn (câu đang chọn); không dùng cho gợi ý hay lỗi |
| `--color-reading` | `#BAE6FD` | Nền của chữ đang được đọc trong lời giới thiệu bài; chữ vẫn `--foreground` |
| `--color-destructive` | `#DC2626` | **Chỉ** thao tác nguy hiểm ở trang phụ huynh/quản trị (thu hồi mã, xoá). Không bao giờ dùng trong giao diện trẻ |

### Màu khái niệm
Gán qua `Concept.color` trong `lesson.json` bằng tên token, không bằng hex. Mỗi màu đi kèm một ký hiệu hình.

| Tên | Hex | Ký hiệu | Ví dụ gán |
|---|---|---|---|
| `blue` | `#2563EB` | ● tròn | Cơ số |
| `violet` | `#7C3AED` | ▲ tam giác | Số mũ |
| `pink` | `#DB2777` | ◆ thoi | Nhân vật chính |
| `amber` | `#B45309` | ■ vuông | Kết quả / giá trị |
| `teal` | `#0F766E` | ⬟ ngũ giác | Địa danh |
| `sky` | `#0369A1` | ✚ chữ thập | Biện pháp tu từ |
| `lime` | `#4D7C0F` | ★ sao | Từ khoá |
| `slate` | `#475569` | ▬ thanh | Phụ, trung tính |

Trong một bài, mỗi khái niệm giữ một màu cho mọi visual, công thức, highlight, thẻ ôn. Ký hiệu trong công thức cũng tô màu, không chỉ chú thích: TeX viết `\concept{blue}{2}^{\concept{violet}{5}}` (tên màu khái niệm, không mã hex); `content:check` báo lỗi nếu màu không thuộc khái niệm nào của bài.

## 3. Chữ

| Vai trò | Font | Cỡ (iPad / điện thoại) | Độ đậm | Line-height |
|---|---|---|---|---|
| Tiêu đề màn hình | Baloo 2 | 32 / 28px | 700 | 1.2 |
| Tiêu đề khối | Baloo 2 | 24 / 22px | 600 | 1.25 |
| Thân | Be Vietnam Pro | 20 / 18px | 400 | 1.6 |
| Văn bản đọc hiểu | Be Vietnam Pro | 21 / 19px | 400 | 1.75, tối đa 60 ký tự/dòng |
| Nút | Be Vietnam Pro | 20 / 18px | 600 | 1 |
| Chú thích | Be Vietnam Pro | 16 / 16px | 400 | 1.5 |
| Công thức | KaTeX | 1.25× chữ thân | — | — |

Cả hai font có bộ ký tự `vietnamese`; nạp qua `next/font/google` với `subsets: ["latin", "vietnamese"]`, `display: "swap"`. Không chữ nào < 16px.

## 4. Khoảng cách, bo góc, bóng

- Thang khoảng cách (density thấp): 8, 12, 16, 24, 32, 48, 64, 96px. Lề màn hình: 24px iPad, 16px điện thoại.
- Khoảng cách giữa hai vùng chạm ≥ 12px.
- Bo góc: 12px (ô nhỏ), 20px (thẻ, nút lớn), 28px (khung bài tập), tròn hoàn toàn (chip, avatar).
- Bóng: một cấp duy nhất `0 2px 8px rgb(15 23 42 / 0.08)` cho thẻ nổi; không bóng lồng nhau.

## 5. Chạm và bố cục

- Vùng chạm ≥ 48×48px; nút chính cao 64px iPad / 56px điện thoại.
- Ngoại lệ vùng chạm của chấm tiến độ (`SectionStepper`): cao 48px, rộng bằng chấm cộng khoảng đệm hai bên vì cả hàng chấm phải vừa một hàng; chỉ chấm của màn đã qua bấm được, có tên ("Lý thuyết 1", "Câu 2") hiện khi rê hoặc focus.
- Ngoại lệ vùng chạm trong dòng chữ (`tapText`, `PassageReader`): ở chế độ chạm, line-height ≥ 2.3 (dòng ≥ 48px), chạm chọn cả câu, câu đang chọn có nền `--color-highlight`.
- Viewport mục tiêu: iPad dọc 820×1180, ngang 1180×820; điện thoại 390×844. Không cuộn ngang. Tôn trọng `env(safe-area-inset-*)` khi chạy PWA toàn màn hình.
- Nội dung học: một cột, rộng tối đa 720px, căn giữa. iPad ngang: màn học rộng tối đa 960px, bài tập chia hai cột (đề và hình gợi ý bên trái, ô trả lời bên phải) khi khung bài tập rộng từ 50rem, cột đề rộng ít nhất 26rem, khung hẹp hơn thì giữ một cột; đề có đoạn văn đọc hiểu hoặc câu hỏi dài thì giữ một cột, đề trải hết bề ngang phía trên ô trả lời. Cú đậu ở góc trên phải thẻ trả lời ở mọi khổ, không chiếm cột riêng. Visual rộng hơn cột thì tự thu nhỏ vừa cột.
- Nút "Tiếp" / "Kiểm tra" cố định đáy màn hình, trong vùng ngón cái.
- Màn một khối (giải thích, nhắc lại, xong phần, ôn xong): nội dung căn giữa theo chiều dọc giữa đầu màn và thanh nút, không để khoảng trống lớn phía trên nút. iPad dọc (biến thể `tall:` = rộng ≥ 768px và cao ≥ 992px): visual phóng 1.3×, ô môn cao hơn, linh vật màn xong lớn hơn.
- Kéo thả (dnd-kit): có phương án thay thế chạm-để-chọn rồi chạm-để-đặt cho mọi thao tác kéo.
- Không phụ thuộc hover. Mọi phản hồi chạm hiện trong ≤ 100ms (scale 0.97 khi nhấn).

## 6. Chuyển động

| Loại | Thời lượng | Easing |
|---|---|---|
| Phản hồi chạm | 100–150ms | `ease-out` |
| Chuyển khối/màn | 250–300ms | spring (stiffness 300, damping 30) |
| Rung khi sai | 300ms, biên độ 6px, 3 lần | `ease-in-out` |
| Animation giải thích | theo nội dung, trẻ điều khiển được (phát/tạm dừng/tua lại) | — |
| Thưởng (sticker, xong phần) | 600–900ms | spring có nảy nhẹ |

- Chỉ animate `transform` và `opacity`.
- `prefers-reduced-motion: reduce` → bỏ rung, bỏ nảy, chuyển cảnh bằng fade; animation giải thích vẫn chạy nhưng dạng từng bước bấm "Tiếp".
- Không chuyển động nền, không hiệu ứng lặp vô hạn trong lúc học (trừ linh vật chớp mắt ≥ 4 giây/lần).

## 7. Phản hồi bài tập (3 nấc)

| Trạng thái | Viền | Nền | Linh vật | Âm thanh |
|---|---|---|---|---|
| Chưa trả lời | `--color-border` 2px | `--color-surface` | — | — |
| Đã chọn | `--color-primary` 3px | `--color-surface` | — | — |
| Đúng | `--color-correct` 3px + dấu ✓ + pháo giấy ~1 giây (bỏ khi giảm chuyển động) | `--color-correct-soft` | vui, bong bóng khen | nhạc vui ngắn rồi cú đọc lời khen, mọi lần đúng |
| Sai lần 1 | `--color-retry` 3px nét đứt + rung | `--color-retry-soft` | cổ vũ, bong bóng động viên | cú đọc câu động viên |
| Sai lần 2 | như lần 1 | như lần 1 | gợi ý, chỉ vào visual gợi ý | "oops" nhẹ rồi cú đọc câu gợi ý |
| Sai lần 3 | như lần 1 | như lần 1 | cổ vũ, visual lời giải chạy | "oops" nhẹ rồi cú đọc câu lời giải |

Nấc 1 không tô vàng; chữ duy nhất là câu động viên trong bong bóng của cú: thẻ trả lời rung và có viền cam nét đứt; phần trả lời sai có viền cam nét đứt (vùng chạm: vòng cam nét đứt). Gợi ý tác giả trỏ vào đề (khối, phần công thức, câu) và phím "mũ" được viền/gạch chân bằng màu khái niệm của đích gợi ý, không có khái niệm thì `--color-concept-slate`. Nấc 2 khi không có visual gợi ý: cùng viền đó, dày hơn. `--color-highlight` chỉ dành cho trạng thái đang chọn.

Sau khi đúng, thanh dưới có hai nút chia đôi: "Làm lại" (phụ, bên trái) và "Tiếp" (chính, bên phải).

### Âm thanh

- Mọi lần kiểm đều có tiếng (bảng trên); mọi câu trong bong bóng đều có giọng đọc, đúng câu đang hiện. Không có bong bóng nào im lặng.
- Một giọng cho mọi câu của cú, mọi file cùng độ lớn (giọng −16 LUFS, "oops" nhỏ hơn 4 LU) và không vỡ tiếng (đỉnh < −1 dBFS). Thông số ở `scripts/lib/sound-spec.ts`.
- Không đọc chữ bằng giọng máy của trình duyệt.
- Công tắc âm thanh: nút loa tròn 48px (`Volume2`/`VolumeX`, màu `--color-muted-foreground`), luôn ở đầu phải hàng trên cùng của màn hình; một setting cho mỗi con. Bật lại thì phát nhạc vui để xác nhận.

## 8. Linh vật

- Một bạn cú, vẽ SVG phẳng, 2–3 màu từ bảng màu, nét tròn, mắt to.
- Biểu cảm: `happy`, `hint`, `cheer`, `welcome` (vui khi gặp lại sau nhiều ngày không học — không trách), `idle`.
- Kích thước: 96px trên trang chủ; cạnh bài tập 72px trên iPad dọc, 56px đậu ở góc trên phải thẻ trả lời trên điện thoại và iPad ngang (không chiếm hàng riêng, không nhận chạm). Không che nội dung bài.
- Biểu cảm đổi bằng Motion (xoay đầu, chớp mắt, vỗ cánh ≤ 600ms).
- Bong bóng lời cạnh bài tập: một câu ngắn (≤ 10 chữ) ở cả ba nấc và khi đúng (câu động viên và lời khen chọn cố định theo lượt làm), luôn kèm giọng đọc. Chữ ≥ 18px, nằm một hàng riêng phía trên thẻ trả lời, bên trái đầu cú, không che câu trả lời hay nút; vùng đọc cho trình đọc màn hình đọc đúng câu đó. Mọi câu nằm ở `src/mascot/lines.ts`.
- Màu: `--color-mascot-body` `#C08457` (thân), `--color-mascot-shade` `#94603A` (tai, cánh), `--color-mascot-belly` `#FDF0DC` (mặt, bụng), `--color-mascot-beak` `#F59E0B` (mỏ, chân, lấp lánh). Chỉ trang trí, không mang chữ.
- Trang chủ: `welcome` khi lần học cuối cách hôm nay ≥ 3 ngày; `happy` khi hôm nay đã học; còn lại `idle`.
- `StreakFlame`: ngọn lửa `--color-streak` `#EA8A0C` trên nền `--color-streak-soft` `#FFF4E0`; lửa xám khi hôm nay chưa học. Đếm số ngày có học trong chuỗi (ngày nghỉ giữ chuỗi nhưng không cộng).

## 9. Component chính

| Component | Mô tả |
|---|---|
| `BigButton` | Nút chính, cao 64/56px, bo 20px, chữ 20/18px đậm 600, có trạng thái nhấn và disabled rõ ràng |
| `SubjectTile` | Ô môn trên trang chủ: màu môn, biểu tượng SVG (Lucide), tiến độ dạng vòng, luôn có dòng phụ (trạng thái môn), nhắc "n ngày chưa học"; trên iPad ba ô dùng chung hàng lưới (subgrid) để tên môn thẳng hàng |
| `ReviewButton` | Nút "Ôn bài này" trong trang bài, kèm nhãn nhỏ "n thẻ sắp quên" khi có |
| `SectionStepper` | Chấm tiến độ các khối trong một phần (không số, không phần trăm); chấm của màn đã qua bấm được, có tên |
| `ScreenBadge` | Nhãn loại màn ở đầu mỗi màn của player: Lý thuyết (xanh), Bài tập (vàng), Ôn tập (tím) |
| `StickerSheet` | Bảng chi tiết một sticker: hình (bóng xám nếu chưa nhận), tên, bài, tiến độ, cách nhận, nút mở bài |
| `ExerciseFrame` | Khung chung cho 8 dạng bài: đề, vùng trả lời, nút "Kiểm tra", vùng gợi ý, trạng thái 3 nấc |
| `NumberPad` | Khối số 3 cột (phím 0 trải ngang hàng cuối) + cột phụ Xoá / "mũ" / "," — phím "," chỉ hiện khi đáp án có số thập phân; phím 64px (60px ở iPad ngang). Khi nấc 2/3 có hình, bàn phím tạm ẩn để hình vào đúng chỗ, chạm ô đáp số để mở lại |
| `PassageReader` | Hiển thị văn bản đọc hiểu, chạm từng câu để chọn, ghi chú "Theo dõi" dạng thẻ nhỏ bên lề (iPad) hoặc dưới đoạn (điện thoại) |
| `ConceptChip` | Chip màu khái niệm + ký hiệu hình |
| `StickerBook` | Lưới sticker đã nhận, sticker chưa nhận hiện bóng xám |
| `StreakFlame` | Số ngày học liên tục + biểu tượng, hiển thị ngày nghỉ còn lại trong tuần |
| `Avatar` | Mặt thú SVG phẳng (mèo, gấu, thỏ, cáo, gấu trúc, gà con) trên đĩa nền nhạt; màu lấy từ token `--color-avatar-*`, chỉ để trang trí, không mang chữ |

Biểu tượng: Lucide (SVG). Không dùng emoji làm biểu tượng giao diện.

### Trang phụ huynh (`src/components/parent/`)

- Người đọc là phụ huynh trên điện thoại: giọng bình tĩnh, câu ngắn, xưng "bạn" với phụ huynh, gọi trẻ là "con". Vẫn thuần tiếng Việt, cùng token chữ và vùng chạm như giao diện trẻ.
- Lối vào: liên kết chữ nhỏ, màu phụ "Phụ huynh" ở cuối màn chọn hồ sơ; không nổi bật để trẻ không tò mò bấm.
- Mỗi mục là một thẻ `bg-surface shadow-card` có tiêu đề khối và một dòng chú thích giải thích số liệu. Nhiều con → thanh chọn dạng segmented (avatar + tên).
- Biểu đồ chỉ là cột bằng `div` (không thư viện biểu đồ); cột hôm nay `--color-primary`, ngày khác `primary/40`; mỗi cột có chữ số phút và nhãn cho trình đọc màn hình.
- Được phép hiện phần trăm "còn nhớ khoảng n%" (chỉ ở trang phụ huynh, không bao giờ ở giao diện trẻ). Nhập sai PIN báo bằng chữ `--color-retry-soft-foreground`, không đỏ. `--color-destructive` chỉ cho thao tác xoá/thu hồi — hiện trang chưa có thao tác nào như vậy.

## 10. Không làm

- Màu đỏ, dấu ✗ lớn, chữ "Sai rồi!" trong giao diện trẻ.
- Đồng hồ đếm ngược, bảng xếp hạng, điểm số phần trăm.
- Popup, quảng cáo nội bộ, thông báo chen ngang lúc đang làm bài.
- Chữ tiếng Anh trên giao diện.
- Hơn 2 câu chữ trong một khối giải thích.
- Hiệu ứng nền, parallax, hiệu ứng lặp khi đang học.

## 11. Kiểm tra trước khi giao

- [ ] Tương phản chữ ≥ 4.5:1 (đã tính cho mọi token ở mục Màu).
- [ ] Vùng chạm ≥ 48px, khoảng cách ≥ 12px.
- [ ] Không cuộn ngang ở 820×1180, 1180×820, 390×844.
- [ ] Focus ring nhìn thấy trên mọi phần tử tương tác.
- [ ] `prefers-reduced-motion` được tôn trọng.
- [ ] Không màu nào mang nghĩa một mình (có ký hiệu/biểu tượng đi kèm).
- [ ] Không emoji làm biểu tượng; biểu tượng dùng Lucide.
- [ ] Safe area iPad khi mở PWA toàn màn hình.
