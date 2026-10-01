---
name: lesson-visual
description: Viết visual cho một bài học (hình giải thích, animation từng bước, hình tương tác, vùng chạm, hình gợi ý và lời giải) trong src/visuals/<môn>/<bài>/, đăng ký vào registry, rồi chụp ảnh và tự xem từng ảnh. Dùng khi người dùng nói "làm animation cho bài", "vẽ hình cho bài", "làm visual", "thêm hình gợi ý", hoặc khi content:check báo visualId chưa có trong registry.
model: sonnet
---

# Visual bài học

Mẫu đầy đủ: `src/visuals/math/luy-thua/`. Kiểu dữ liệu và hợp đồng (`VisualProps`, `VisualMeta`, validator, solver): `src/visuals/registry.ts`. Màu, chạm, chuyển động: `docs/design-system.md` mục "Màu", "Chạm và bố cục", "Chuyển động".

## Nhiều visual: chia subagent

Bài cần từ 6 visual mới trở lên và phiên này có Agent tool thì sau bước 1 chia theo nhóm section liên tiếp, mỗi nhóm một subagent (`model: "sonnet"`), mở song song trong một lượt gọi. Trước khi chia, phiên này viết vào `parts.tsx` các phần nhiều nhóm cùng dùng và định sẵn tên tệp của từng nhóm. Mỗi subagent làm bước 2–6 cho danh sách của nhóm, chỉ ghi tệp của nhóm (validator, solver cũng trong tệp `.ts` riêng của nhóm), không sửa `parts.tsx`, `examples.tsx`, `registry.ts`, test; trả về factory, mục registry và params mẫu cần thêm. Phiên này gộp một lần: bước 7–8 cho mọi nhóm, rồi bước 9–10.

## Quy trình

1. **Lấy danh sách.** Từ `pnpm content:check`: mọi `visualId` báo "not in the visual registry" và mọi chỗ giữ `fixture.*` báo `[placeholder]`. Với mỗi chỗ, xác định vai trò và bộ số từ `lesson.json` (block, `visualId` của bài tập, `hintVisualId`, `solutionVisualId`, sticker).
2. **Dùng primitive có sẵn** trong `src/visuals/shared/` (xem cách dùng trong `src/visuals/math/luy-thua/`). Phần chỉ bài này dùng để trong `parts.tsx` của bài. Visual của bài khác dùng lại được bằng id registry (`luy-thua.visual.*`) ngay trong `lesson.json`; còn component của bài khác thì không import chéo thư mục bài mà chuyển nó sang `shared/` khi bài thứ hai cần, kèm test trong `tests/visuals/primitives.test.tsx`.
3. **Viết component** tại `src/visuals/<subject>/<slug>/<ten>.tsx`, id `<slug>.visual.<ten>`. Hình giải thích bắt đầu từ `.claude/skills/lesson-visual/templates/visual.tsx`. Theo vai trò:
   - **Giải thích** (block của section): `StepPlayer`, mỗi bước thêm một ý; hàng chưa tới hiện mờ với "?" (`Reveal` trong `src/visuals/shared/reveal.tsx`, có `placeholder`) để bước sau không đẩy bước trước.
   - **Ví dụ của màn quy tắc và recap**: chỉ vẽ ví dụ có nhãn (vd các component trong `src/visuals/math/luy-thua/rule-examples.tsx`). Câu bài học nằm ở `note` của `group` hay `caption` của recap trong JSON; chữ trong visual chỉ là nhãn ngắn (tên phần, số, "6 bình phương"). Ví dụ chỉ là công thức thì dùng khối `formula` với `\concept{…}`, không cần visual.
   - **Tương tác** (`manipulate`): báo trạng thái qua `onStateChange`, vẽ `shownState` khi khung hiện đáp án, khoá khi `disabled`. Mỗi nút đổi trạng thái mang dấu trong `src/visuals/shared/markers.ts` (`stateKey` của `NumberStepper`, `stateStepper`/`stateStep`, `stateSet`) để `pnpm lesson:walk` tự làm được câu. Validator và solver cùng id đặt trong file `.ts` không có React (vd `validators.ts`); solver trả về trạng thái mà validator chấp nhận.
   - **Vùng chạm** (`tapRegion`): `RegionSvg` + `Region id`; vùng chạm ≥ 48px.
   - **Gợi ý nấc 2, lời giải nấc 3** (`hintVisualId`, `solutionVisualId`): theo "Luật gợi ý 3 nấc" trong `.claude/skills/lesson-review/references/checklist.md`.
4. **Màu khái niệm.** Dùng `CONCEPT_CLASSES`, `ConceptShape`, `PowerText` với tên màu của concept trong bài; không mã hex. Màu luôn đi kèm ký hiệu hình (`ConceptMark`). Chữ số trong hình mang màu khái niệm của nó, trừ phần trẻ phải chạm hay gọi tên (xem `.claude/skills/lesson-author/references/pitfalls.md`).
5. **Chuyển động.** Chỉ animate `transform` và `opacity`, lấy transition từ `useVisualTransition()`. `StepPlayer` đã xử lý reduced motion (đứng yên, bấm "Tiếp"). Không lặp vô hạn.
6. **Vừa khung.** SVG co theo chiều rộng khung, chữ co theo: cỡ chữ hiển thị = `fontSize` × chiều rộng hiển thị / chiều rộng `viewBox`, phải ≥ 16px ở điện thoại 390px. Dòng dài thì thu gọn (xem `FactorRow` trong `src/visuals/math/luy-thua/parts.tsx`) hoặc xuống dòng. Mọi hình có `label` tiếng Việt cho trình đọc màn hình.
7. **Một component, nhiều bộ số.** Viết factory trong `src/visuals/<subject>/<slug>/examples.tsx`, file không có `"use client"`, vì trang `/dev/visuals/[id]` là server component gọi factory khi nạp visual. File này cũng export lại các ví dụ có nhãn của màn quy tắc và recap. Thêm slug vào `EXAMPLE_MODULES` trong `registry.ts`, rồi nạp bằng `lessonExample("<slug>", (m) => m.<factory>(…))` hay `(m) => m.<Component>`.
8. **Đăng ký** trong `src/visuals/registry.ts`: `interactive: true` chỉ khi trẻ thao tác (được đếm trong `content:check --stats`); `regions` đúng thứ tự vẽ; `validators` và `solutions` theo id. `tests/visuals/registry.test.tsx` tự render mọi entry và so `regions`; validator mới cần thêm params mẫu vào `samples` trong test đó và test hành vi riêng như `tests/visuals/luy-thua.test.tsx`.
9. **Chụp và xem.** `pnpm visual:shot <slug>` chụp mọi visual của bài, từng bước `StepPlayer`, ở iPad và điện thoại vào `.shots/<slug>/`, và báo lỗi khi phần tử tràn khung hay chồng nhau. Lệnh ghi thêm contact sheet mỗi thiết bị (`sheet-<thiết bị>-NN.png`, mỗi ô in tên ảnh). Đọc các sheet bằng Read, không đọc từng PNG; chỉ mở riêng một PNG khi ô của nó cho thấy điều đáng phóng to. Soát: chữ đọc được, màu đúng khái niệm, không tràn, hình gợi ý dừng ở "?". Sửa rồi chụp lại tới khi sạch.
10. **Kiểm.** `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`. Không được gọi từ lesson-author thì chạy thêm `pnpm lesson:walk <slug>` tới khi 0 FAIL (chỉ walk kiểm hình gợi ý nằm trong màn).
