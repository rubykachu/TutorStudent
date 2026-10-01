# Vận hành: đưa app lên mạng và giữ cho chạy

Sổ tay cho chủ dự án. Bản đầu tiên là bản "dùng được ngay": app chạy trên Vercel, video và lời đọc nằm trên bucket R2 công khai, cả app nằm sau mã gia đình, tiến độ của bé vẫn lưu riêng trên từng máy (IndexedDB). Chưa có: đồng bộ tiến độ qua R2, PIN trên server, PWA ngoại tuyến, trang quản trị (xem các mục "Tiến độ và đồng bộ", "Truy cập và bảo mật", "Offline và PWA" của `docs/spec.md`).

Mọi bước ở phần "Các bước ngoài máy" ghi ra ngoài máy này (R2, Vercel, GitHub), nên mỗi bước cần chủ dự án đồng ý trước khi chạy; tài khoản nào dùng cho bước nào ghi ngay trong bước.

## Biến môi trường

| Tên | Bắt buộc | Đặt ở đâu | Ý nghĩa |
|---|---|---|---|
| `FAMILY_CODES` | production | Vercel (Sensitive) | Mã gia đình, mỗi gia đình một mã, cách nhau bằng dấu phẩy. Mỗi mã dài ít nhất 10 chữ hoặc số (dấu cách, dấu gạch và chữ hoa không tính). Bỏ một mã khỏi danh sách là cắt quyền của gia đình đó |
| `SESSION_SECRET` | production | Vercel (Sensitive) | Khoá ký cookie `tutor_family`, ít nhất 32 ký tự ngẫu nhiên. Đổi khoá là mọi máy phải nhập lại mã |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | khi dùng bucket | Vercel, lúc build | Địa chỉ công khai của bucket media, không có dấu `/` ở cuối, ví dụ `https://pub-xxxx.r2.dev`. Để trống thì app đọc video từ `public/media` |

Quy tắc đã được code giữ:

- Máy dev và test không đặt hai biến mã: không có cổng, vào thẳng. Server production thiếu hoặc đặt sai một trong hai biến: không phục vụ gì (trả 503, log ghi lý do), để quên biến không bao giờ làm app mở cho người lạ.
- `NEXT_PUBLIC_MEDIA_BASE_URL` được ghép vào mã trình duyệt lúc build. Đổi nó thì phải deploy lại. Giá trị sai (thiếu `https://`, hay `http://` ở production) làm build dừng với thông báo rõ.
- Mẫu các biến nằm ở `.env.example`; tệp `.env*` thật không bao giờ commit.

## Chuẩn bị trên máy (không ghi ra ngoài)

Tạo mã gia đình (12 ký tự, bỏ chữ dễ nhầm như `0/o`, `1/l`), chạy mỗi gia đình một lần và ghi lại mã đưa cho gia đình đó:

```bash
node -e 'const a="abcdefghjkmnpqrstuvwxyz23456789",c=require("crypto"),g=()=>Array.from({length:4},()=>a[c.randomInt(a.length)]).join("");console.log([g(),g(),g()].join("-"))'
```

Tạo khoá ký cookie:

```bash
openssl rand -hex 32
```

Thử bản production ngay trên máy. Dev server của chủ dự án đang giữ thư mục `.next`, nên build trong một worktree riêng:

```bash
git worktree add ../tutor-prod-check HEAD
cd ../tutor-prod-check && pnpm install --frozen-lockfile --prefer-offline
FAMILY_CODES='<mã>' SESSION_SECRET='<khoá>' pnpm build
FAMILY_CODES='<mã>' SESSION_SECRET='<khoá>' pnpm start --port 3200
```

Cần thấy: `/` chuyển sang `/unlock`; nhập đúng mã vào được; `/dev/mascot` là 404; chỉ bài `published` có trong `/content/index.json`. Xong thì `git worktree remove ../tutor-prod-check`.

## Các bước ngoài máy

Thứ tự này để mỗi bước dùng được kết quả của bước trước: bucket có địa chỉ rồi mới tải video lên, có địa chỉ bucket rồi mới đặt biến cho Vercel, có địa chỉ app rồi mới khoá CORS đúng origin.

Dùng đúng một biến shell trong cả phần này, đặt một lần ở đầu phiên:

```bash
export BUCKET=tutor-media          # tên bucket media (đổi nếu muốn)
export APP_ORIGIN=https://tutor-student.vercel.app   # địa chỉ app, điền lại ở bước 6 nếu Vercel cấp tên khác
```

### 1. Tạo bucket media công khai (Cloudflare R2)

Tài khoản Cloudflare của chủ dự án. Dùng `wrangler`; lần đầu cần đăng nhập trình duyệt:

```bash
npx wrangler login
npx wrangler r2 bucket create "$BUCKET"
npx wrangler r2 bucket dev-url enable "$BUCKET"
```

Lệnh cuối in ra địa chỉ `https://pub-<mã>.r2.dev`. Ghi lại, đó là giá trị của `NEXT_PUBLIC_MEDIA_BASE_URL`:

```bash
export MEDIA_URL=https://pub-<mã>.r2.dev
```

Địa chỉ `r2.dev` chỉ dành cho giai đoạn đầu (Cloudflare giới hạn tốc độ và không cache ở CDN). Khi có tên miền riêng: R2, bucket, Settings, Custom Domains, rồi đổi `NEXT_PUBLIC_MEDIA_BASE_URL` và deploy lại; đường dẫn file không đổi nên không phải dựng lại gì.

### 2. Tạo khoá R2 để tải file lên

Công cụ tải là `rclone` (máy chưa có: `brew install rclone`). Khoá chỉ dùng cho nó, không đưa vào app. Trong Cloudflare: R2, Manage API tokens, Create API token, quyền Object Read and Write, giới hạn ở bucket `$BUCKET`. Lấy Access Key ID, Secret Access Key và Account ID, rồi đặt trong phiên shell (không ghi vào tệp, không commit):

```bash
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID=<Access Key ID>
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=<Secret Access Key>
export RCLONE_CONFIG_R2_ENDPOINT=https://<Account ID>.r2.cloudflarestorage.com
```

### 3. Tải `public/media` lên bucket

`public/media` (không nằm trong git) có 109 tệp, khoảng 48 MB: `video/<bài>/<tên>.mp4|vtt|jpg` và `narration/<bài>/overview.m4a|vtt`. Giữ nguyên đường dẫn vì `lesson.json` chỉ ghi đường dẫn tương đối. Mỗi loại tệp tải riêng để `Content-Type` đúng (Safari từ chối phụ đề `text/plain`):

```bash
cd /Users/minhtang/Documents/Projects/MyProject/TutorStudent
upload() {  # upload '<mẫu tệp>' <Content-Type> [cờ rclone thêm]
  rclone copy public/media "r2:$BUCKET" --s3-no-check-bucket --progress \
    --header-upload 'Cache-Control:public,max-age=3600' \
    --include "$1" --header-upload "Content-Type:$2" "${@:3}"
}

# thử trước, không ghi gì
upload '*.mp4' video/mp4 --dry-run

upload '*.mp4' video/mp4
upload '*.vtt' text/vtt
upload '*.jpg' image/jpeg
upload '*.m4a' audio/mp4
```

Kiểm: `rclone size "r2:$BUCKET"` phải báo 109 objects. Ghi đè tệp đã có chỉ khi video được dựng lại; `rclone copy` không xoá gì trên bucket.

Sao lưu các bản đọc từng câu (`video/projects/**/audio/`, `video/.cache/`) lên bucket private là việc riêng ở README, mục "Dọn dẹp và Go-live"; không cần cho lần deploy đầu.

Kiểm bucket trả đúng loại tệp và hỗ trợ tua (Range):

```bash
curl -sI -H 'Range: bytes=0-99' "$MEDIA_URL/video/luy-thua/luy-thua-la-gi.mp4" | grep -iE 'HTTP|content-type|content-range|accept-ranges'
curl -sI "$MEDIA_URL/video/luy-thua/luy-thua-la-gi.vtt" | grep -iE 'HTTP|content-type'
```

Cần thấy `206`, `video/mp4`, `bytes 0-99/...`, `accept-ranges: bytes` và `text/vtt`.

### 4. Tạo project Vercel và đặt biến môi trường

Tài khoản Vercel `rubykachu` (đã `vercel login`; kiểm bằng `npx vercel whoami`). Chạy trong thư mục dự án:

```bash
cd /Users/minhtang/Documents/Projects/MyProject/TutorStudent
npx vercel link --yes --project tutor-student
```

Đặt ba biến cho môi trường `production` (giá trị đi qua stdin, không hiện trong lịch sử lệnh; hai biến đầu là Sensitive nên Vercel không cho đọc lại):

```bash
printf '%s' '<mã gia đình, nhiều gia đình thì cách nhau dấu phẩy>' | npx vercel env add FAMILY_CODES production --sensitive
printf '%s' '<kết quả openssl rand -hex 32>'                       | npx vercel env add SESSION_SECRET production --sensitive
printf '%s' "$MEDIA_URL"                                           | npx vercel env add NEXT_PUBLIC_MEDIA_BASE_URL production
```

Cấu hình build đã nằm trong `vercel.json` (`pnpm build`, vì lệnh này chạy kiểm tra nội dung và dựng `public/content` trước `next build`) và `package.json` (`engines.node` là `22.x`). Không đặt biến cho môi trường `preview`: bản preview thiếu mã nên trả 503, đúng ý muốn (người lạ không vào được bản thử).

### 5. Đẩy mã lên GitHub

Chỉ dùng token `rubykachu`, qua HTTPS với helper đặt ngay trong lệnh (`credential.helper=` rỗng phải đứng trước, nếu không keychain trả nhầm tài khoản). Commit gần nhất phải là bản đã qua `pnpm lint && pnpm typecheck && pnpm test`:

```bash
cd /Users/minhtang/Documents/Projects/MyProject/TutorStudent
TOK="$(gh auth token -u rubykachu)"
git -c credential.helper= \
    -c credential.helper='!f() { echo "username=rubykachu"; echo "password='"$TOK"'"; }; f' \
  push https://github.com/rubykachu/TutorStudent.git main
```

Nội dung bài `draft` có trong git nhưng không được phát hành: bản build chỉ đưa bài `published` ra ngoài.

### 6. Nối Vercel với repo và deploy

Cách 1, tự deploy mỗi lần push (cần cài Vercel GitHub App cho tài khoản `rubykachu`, làm một lần ở trang Vercel):

```bash
npx vercel git connect https://github.com/rubykachu/TutorStudent.git
```

Sau khi nối, mỗi lần push vào `main` Vercel tự build bản production. Lần đầu có thể kích hoạt bằng lệnh dưới.

Cách 2, deploy tay từ máy, không cần GitHub App:

```bash
npx vercel deploy --prod
```

Lệnh in địa chỉ production, thường là `https://tutor-student.vercel.app`. Nếu khác với `APP_ORIGIN` đã đặt thì đặt lại biến shell. Trong log build kiểm dòng `content:check ... 0 errors`; phiên bản Node.js ở Settings, Build and Deployment phải là `22.x`.

### 7. Cho phép app tải phụ đề và video từ bucket (CORS)

Trình phát đặt `crossOrigin="anonymous"` cho video, và lời đọc lấy phụ đề bằng `fetch`, nên bucket phải trả header CORS cho origin của app và cho yêu cầu `Range` (tua video). Tạo `cors.json` tạm ở thư mục bất kỳ:

```bash
cat > /tmp/tutor-cors.json <<EOF
{
  "rules": [
    {
      "allowed": {
        "origins": ["$APP_ORIGIN"],
        "methods": ["GET", "HEAD"],
        "headers": ["Range", "Content-Type"]
      },
      "exposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges", "Content-Type", "ETag"],
      "maxAgeSeconds": 3600
    }
  ]
}
EOF
npx wrangler r2 bucket cors set "$BUCKET" --file /tmp/tutor-cors.json
npx wrangler r2 bucket cors list "$BUCKET"
rm /tmp/tutor-cors.json
```

Muốn thử với dev server trên máy thì thêm `"http://localhost:3001"` vào `origins`. Có tên miền riêng cho app sau này thì thêm origin đó.

Kiểm bằng yêu cầu giả origin của app:

```bash
curl -sI -H "Origin: $APP_ORIGIN" -H 'Range: bytes=0-99' "$MEDIA_URL/video/luy-thua/luy-thua-la-gi.mp4" | grep -iE 'HTTP|access-control|content-range'
curl -sI -H "Origin: $APP_ORIGIN" "$MEDIA_URL/narration/luy-thua/overview.vtt" | grep -iE 'HTTP|access-control|content-type'
```

Cần thấy `access-control-allow-origin: <APP_ORIGIN>` ở cả hai (và `access-control-expose-headers` ở video). Nếu CLI ở phiên bản chưa có `cors set`, dán cùng nội dung ở Cloudflare: R2, bucket, Settings, CORS policy, dạng `[{"AllowedOrigins":["<APP_ORIGIN>"],"AllowedMethods":["GET","HEAD"],"AllowedHeaders":["Range","Content-Type"],"ExposeHeaders":["Content-Length","Content-Range","Accept-Ranges","Content-Type","ETag"],"MaxAgeSeconds":3600}]`.

### 8. Kiểm nhanh từ máy tính

```bash
curl -sI "$APP_ORIGIN/" | grep -iE 'HTTP|location|x-robots-tag'
curl -s -o /dev/null -w '%{http_code}\n' "$APP_ORIGIN/content/index.json"
curl -s -o /dev/null -w '%{http_code}\n' "$APP_ORIGIN/dev/mascot"
```

Cần thấy `307` về `/unlock?next=%2F` cùng `x-robots-tag: noindex, nofollow`, tiếp theo `401` cho `/content/index.json` khi chưa có cookie, và `307` cho `/dev/mascot` (sau khi có cookie thì là 404).

## Kiểm trên iPad Safari

Làm trên chính iPad của bé (hoặc iPad có iOS giống). Mở `APP_ORIGIN`.

1. Mở app: tự chuyển sang trang "Chào bạn!". Gõ mã sai: thấy dòng cam "Chưa đúng rồi", không có chữ đỏ. Gõ sai 5 lần: thấy lời nhắc nghỉ vài phút.
2. Gõ đúng mã (chữ hoa, có dấu gạch hay không đều được): vào trang chọn hồ sơ. Đóng tab, mở lại: vào thẳng, không hỏi mã nữa. Mở một thẻ riêng tư (Private) vào cùng địa chỉ: phải hỏi mã.
3. Mở `APP_ORIGIN/parent` trong thẻ riêng tư: cũng phải hỏi mã (trang phụ huynh cùng cổng).
4. Tạo hồ sơ, vào bài Luỹ thừa. Màn giới thiệu: nút nghe lời đọc phát tiếng, từng từ sáng lên theo giọng (nghĩa là phụ đề tải được qua CORS).
5. Video của bài: bấm phát, hình hiện trước khi phát (poster), phụ đề từng từ chạy đúng nhịp. Kéo thanh tua giữa video và nhảy đến chỗ khác: video tiếp tục từ đó, không treo (kiểm `Range`). Xoay ngang rồi dọc: video vẫn đúng khung. Video dừng ở chỗ hỏi bé ("Xem tiếp") đúng như đã thiết kế.
6. Tiếng: làm một câu đúng và một câu sai nghe tiếng thưởng và tiếng sai; bấm cú mèo nghe tiếng; tắt rồi bật nút tiếng. Thử cả khi gạt công tắc chuông sang im lặng: tiếng của app vẫn phát (đã đặt phiên âm thanh "playback").
7. Làm xong một phần, tải lại trang: tiến độ còn (IndexedDB trên máy này). Vào `/parent` đặt PIN, xem báo cáo.
8. Nếu một bước hỏng, ghi lại bước và ảnh chụp màn hình, rồi xem "Khi có lỗi" dưới đây.

## Quản lý mã gia đình

Mọi thay đổi biến môi trường chỉ có hiệu lực ở bản deploy mới, nên sau mỗi lệnh dưới cần `npx vercel deploy --prod` (hoặc push một commit). Sửa một biến Sensitive: xoá rồi thêm lại.

- Thêm gia đình: tạo mã mới (lệnh ở "Chuẩn bị trên máy"), nối vào `FAMILY_CODES` bằng dấu phẩy.
- Thu hồi một gia đình: bỏ mã của họ khỏi `FAMILY_CODES`. Cookie đã cấp cho mã đó hết hiệu lực ngay ở lần tải trang sau khi deploy xong; các gia đình khác không bị ảnh hưởng.
- Khẩn cấp (nghi lộ mã): đổi `SESSION_SECRET` và `FAMILY_CODES`, deploy lại; mọi máy phải nhập mã mới.

```bash
npx vercel env rm FAMILY_CODES production --yes
printf '%s' '<danh sách mã mới>' | npx vercel env add FAMILY_CODES production --sensitive
npx vercel deploy --prod
```

Giới hạn thử sai (5 lần trong 10 phút cho mỗi địa chỉ mạng) được đếm trong bộ nhớ của từng instance Vercel, nên chỉ làm chậm việc đoán mã. Độ dài mã (khoảng 59 bit với 12 ký tự ở lệnh trên) mới là thứ khiến việc đoán vô vọng; không dùng mã ngắn hay mã dễ đoán như tên bé hay ngày sinh.

## Khi có lỗi

| Dấu hiệu | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Mọi trang trả "Ứng dụng chưa sẵn sàng" (503) | Production thiếu hoặc đặt sai `FAMILY_CODES` / `SESSION_SECRET` | Vercel, Logs: dòng `family-code gate is closed: <lý do>` nói rõ biến nào; sửa rồi deploy lại |
| Nhập đúng mã vẫn quay về trang nhập | Cookie bị chặn (chế độ riêng tư chặn cookie của bên thứ nhất, hay lỗi giờ máy), hoặc truy cập qua một tên miền khác `APP_ORIGIN` | Thử thẻ thường; kiểm giờ của iPad; vào đúng địa chỉ production |
| Video không phát, phụ đề không hiện | Chưa đặt CORS đúng origin, hay build chưa có `NEXT_PUBLIC_MEDIA_BASE_URL` | Chạy lại bước 7 và các lệnh `curl` ở đó; trong Vercel kiểm biến, sửa xong phải deploy lại |
| Video chạy nhưng không tua được | Bucket không trả `206` cho `Range` | Chạy lệnh `curl` có `Range` ở bước 3 |
| Phụ đề báo sai định dạng | `Content-Type` của `.vtt` không phải `text/vtt` | Tải lại các tệp `.vtt` bằng lệnh ở bước 3 |
| Bài mới không hiện sau khi push | Bài chưa `published` (chỉ bài đã qua review mới được đưa ra) | `pnpm content:check`; xem trạng thái trong `notebooks/backlogs/index.md` |
| Cần quay về bản trước | Bản mới hỏng | Vercel, Deployments, bản cũ, "Promote to Production"; hoặc `npx vercel rollback` |

## Thêm bài mới hay video mới sau này

- Bài mới: soạn, review, `pnpm content:lock <bài>`, commit, rồi bước 5 (đẩy mã). Vercel tự build nếu đã nối repo ở bước 6.
- Video hay lời đọc mới: sau khi dựng trên máy, tải riêng các tệp mới lên bằng lệnh ở bước 3 (chỉ thêm, không dựng lại và không ghi đè tệp cũ trừ khi chủ dự án muốn), rồi push. Không cần đổi biến môi trường.
