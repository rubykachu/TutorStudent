---
name: lesson-visual
description: Viết visual cho một bài học (hình giải thích, animation từng bước, hình tương tác, vùng chạm, hình gợi ý và lời giải) trong src/visuals/<môn>/<bài>/, đăng ký vào registry, rồi chụp ảnh và tự xem từng ảnh. Dùng khi người dùng nói "làm animation cho bài", "vẽ hình cho bài", "làm visual", "thêm hình gợi ý", hoặc khi content:check báo visualId chưa có trong registry.
---

# Visual bài học

Mẫu đầy đủ: `src/visuals/math/luy-thua/`. Kiểu dữ liệu và hợp đồng (`VisualProps`, `VisualMeta`, validator, solver): `src/visuals/registry.ts`. Màu, chạm, chuyển động: `docs/design-system.md` mục "Màu", "Chạm và bố cục", "Chuyển động".

## Quy trình

1. **Lấy danh sách.** `pnpm content:check` liệt kê các `visualId` "not in the visual registry". Với mỗi id, xác định vai trò và bộ số từ `lesson.json` (block, `visualId` của bài tập, `hintVisualId`, `solutionVisualId`, sticker).
2. **Dùng primitive có sẵn** trong `src/visuals/shared/` (xem cách dùng trong `src/visuals/math/luy-thua/`). Thiếu thì thêm primitive vào `shared/` nếu bài khác cũng sẽ cần, kèm test trong `tests/visuals/primitives.test.tsx`; phần chỉ bài này dùng để trong `parts.tsx` của bài.
3. **Viết component** tại `src/visuals/<subject>/<slug>/<ten>.tsx`, id `<slug>.visual.<ten>`. Hình giải thích bắt đầu từ `templates/visual.tsx`. Theo vai trò:
   - **Giải thích** (block của section): `StepPlayer`, mỗi bước thêm một ý; hàng chưa hiện vẫn giữ chỗ để bước sau không đẩy bước trước.
   - **Tương tác** (`manipulate`): báo trạng thái qua `onStateChange`, vẽ `shownState` khi khung hiện đáp án, khoá khi `disabled`. Validator và solver cùng id đặt trong file `.ts` không có React (vd `validators.ts`); solver trả về trạng thái mà validator chấp nhận.
   - **Vùng chạm** (`tapRegion`): `RegionSvg` + `Region id`; vùng chạm ≥ 48px.
   - **Gợi ý nấc 2, lời giải nấc 3** (`hintVisualId`, `solutionVisualId`): theo "Luật gợi ý 3 nấc" trong `.claude/skills/lesson-review/references/checklist.md`.
4. **Màu khái niệm.** Dùng `CONCEPT_CLASSES`, `ConceptShape`, `PowerText` với tên màu của concept trong bài; không mã hex. Màu luôn đi kèm ký hiệu hình (`ConceptMark`). Chữ số trong hình mang màu khái niệm của nó, trừ câu hỏi mà màu chính là đáp án.
5. **Chuyển động.** Chỉ animate `transform` và `opacity`, lấy transition từ `useVisualTransition()`. `StepPlayer` đã xử lý reduced motion (đứng yên, bấm "Tiếp"). Không lặp vô hạn.
6. **Vừa khung.** SVG co theo chiều rộng khung, chữ co theo: cỡ chữ hiển thị = `fontSize` × chiều rộng hiển thị / chiều rộng `viewBox`, phải ≥ 16px ở điện thoại 390px. Dòng dài thì thu gọn (xem `FactorRow` trong `src/visuals/math/luy-thua/parts.tsx`) hoặc xuống dòng. Mọi hình có `label` tiếng Việt cho trình đọc màn hình.
7. **Một component, nhiều bộ số.** Viết factory trong `src/visuals/<subject>/<slug>/examples.tsx`, file không có `"use client"`, vì trang `/dev/visuals/[id]` là server component gọi factory khi nạp visual. Registry nạp factory qua một helper riêng cho bài, viết theo mẫu `lessonExample` trong `registry.ts` (helper đó chỉ nạp `luy-thua`).
8. **Đăng ký** trong `src/visuals/registry.ts`: `interactive: true` chỉ khi trẻ thao tác (được đếm trong `content:check --stats`); `regions` đúng thứ tự vẽ; `validators` và `solutions` theo id. `tests/visuals/registry.test.tsx` tự render mọi entry và so `regions`; validator mới cần thêm params mẫu vào `samples` trong test đó và test hành vi riêng như `tests/visuals/luy-thua.test.tsx`.
9. **Chụp và xem.** `pnpm visual:shot <slug>` chụp mọi visual của bài, từng bước `StepPlayer`, ở iPad và điện thoại vào `.shots/<slug>/`, và báo lỗi khi phần tử tràn khung hay chồng nhau. Đọc từng PNG bằng Read: chữ đọc được, màu đúng khái niệm, không tràn, hình gợi ý dừng ở "?". Sửa rồi chụp lại tới khi sạch.
10. **Kiểm.** `pnpm lint && pnpm typecheck && pnpm test && pnpm content:check`.
