# Tín Hiệu Số

**Tín Hiệu Số** là website tạp chí công nghệ xây dựng bằng **Next.js App Router**, **Supabase** và TypeScript. Dự án có phần nội dung công khai theo phong cách magazine, bộ lọc chuyên mục, tìm kiếm, bài viết Markdown, cùng khu vực biên tập được bảo vệ bằng Google OAuth và role `admin`.

> Giao diện được lấy cảm hứng từ nhịp điều hướng, phân tầng nội dung và trải nghiệm đọc của một trang tạp chí công nghệ; không sao chép nhận diện hay nội dung của bất kỳ trang tham chiếu nào.

## Chức năng

| Khu vực | Nội dung đã có |
|---|---|
| Công khai | Trang chủ magazine, bài nổi bật, danh sách mới nhất, trang chuyên mục, tìm kiếm, trang đọc bài và footer. |
| Biên tập | Google OAuth, kiểm tra role `admin`, danh sách bài viết, tạo/sửa/xóa, lưu nháp/xuất bản, editor Markdown và upload thumbnail. |
| Dữ liệu | Schema SQL, Row Level Security, trigger profile khi có user mới, bucket Supabase Storage `thumbnails` và seed danh mục. |
| Sẵn sàng triển khai | Lệnh build Next.js, TypeScript strict, Vitest, middleware làm mới session và cấu hình tương thích Vercel. |

## Kiến trúc

```text
app/                    # Next.js App Router: website công khai, auth callback, admin
components/             # Header, footer, card bài viết, OAuth và admin editor
lib/                    # Supabase server/browser clients, query helpers, kiểu dữ liệu
supabase/schema.sql     # Toàn bộ database schema, RLS, Storage policies và danh mục seed
tests/                  # Kiểm thử hàm tiện ích và smoke test kết nối Supabase
```

## Chạy tại máy local

Yêu cầu Node.js 20.9 trở lên và pnpm 10 trở lên.

```bash
git clone https://github.com/<tai-khoan-github>/netvn-inspired-blog.git
cd netvn-inspired-blog
pnpm install
pnpm dev
```

Ứng dụng chạy tại `http://localhost:3000`. Lệnh kiểm tra trước khi đưa lên GitHub hoặc Vercel:

```bash
pnpm test
pnpm typecheck
pnpm build
```

## Cấu hình Supabase

Tạo một project mới tại [Supabase](https://supabase.com/dashboard). Trong **SQL Editor**, chạy toàn bộ file [`supabase/schema.sql`](./supabase/schema.sql). File này sẽ tạo các bảng `profiles`, `categories`, `posts`, trigger đồng bộ user, chính sách RLS, bucket ảnh công khai `thumbnails` và năm danh mục biên tập mặc định.

Sau đó tạo file `.env.local` ở thư mục gốc. **Không commit tệp này**.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_<your-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Hai giá trị đầu tiên lấy từ **Project Settings → API**. Biến thứ ba được dùng làm URL gốc cho callback OAuth trong môi trường local.

### Bật Google OAuth và gán admin đầu tiên

Trong **Authentication → Providers**, bật Google provider và điền Client ID/Client Secret của Google. Ở phần URL configuration, thêm các URL sau vào danh sách redirect URLs.

| Môi trường | Redirect URL |
|---|---|
| Local | `http://localhost:3000/auth/callback` |
| Vercel | `https://<ten-du-an>.vercel.app/auth/callback` |
| Tên miền riêng | `https://<ten-mien-cua-ban>/auth/callback` |

Người dùng đăng nhập lần đầu sẽ có profile với role `user`. Gán tài khoản biên tập đầu tiên thành admin trong SQL Editor, thay email bằng email Google của bạn:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'you@example.com'
);
```

RLS trong schema chỉ cho phép người dùng `admin` thêm, sửa, xóa bài viết và upload ảnh. Khóa anon/publishable được dùng phía trình duyệt; quyền thực thi được giới hạn bởi các policy đó. Không cần và không nên đưa `service_role` key vào website.

## Triển khai lên Vercel

Đẩy mã nguồn lên một repository GitHub rồi import repository đó trên [Vercel](https://vercel.com/new). Vercel tự nhận diện Next.js, nên không cần `vercel.json` hay thiết lập build command đặc biệt.

Trong **Project Settings → Environment Variables** của Vercel, tạo đúng các biến sau cho Production, Preview và Development khi phù hợp.

| Biến | Giá trị triển khai |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable/anon key của cùng project. |
| `NEXT_PUBLIC_SITE_URL` | `https://<ten-du-an>.vercel.app` hoặc tên miền riêng. |

Sau khi có domain Vercel chính thức, bổ sung callback URL tương ứng vào Supabase rồi deploy lại. Hướng dẫn chính thức về [Next.js trên Vercel](https://vercel.com/docs/frameworks/nextjs) và [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs) giúp kiểm tra các cấu hình nền tảng nếu cần.

## Lưu ý vận hành

Nội dung demo xuất hiện khi bảng `posts` chưa có bài đã xuất bản, để giao diện vẫn thể hiện đầy đủ khi clone project. Khi có nội dung xuất bản trong Supabase, website tự sử dụng dữ liệu thật. Các file thumbnail do biên tập viên tải lên được lưu trong Supabase Storage bucket `thumbnails`; URL được lưu ở cột `thumbnail_url`.

Nội dung bài viết dùng Markdown. Editor hỗ trợ cú pháp tiêu đề `#`, in đậm `**...**`, danh sách và trích dẫn `>`. Đường dẫn bài viết được tạo từ tiêu đề theo dạng slug tiếng Việt không dấu và có thêm hậu tố ngắn để tránh trùng lặp.

## Kiểm thử

| Lệnh | Mục đích |
|---|---|
| `pnpm test` | Kiểm tra chuyển đổi slug, tạo tóm tắt, format ngày và gọi endpoint cấu hình Supabase. |
| `pnpm typecheck` | Kiểm tra kiểu TypeScript ở chế độ strict. |
| `pnpm build` | Tạo production build tương thích Vercel. |

## Giấy phép

Mã nguồn có thể dùng làm nền tảng cho dự án nội bộ hoặc thương mại của bạn. Hãy thay đổi tên thương hiệu, email liên hệ và nội dung demo trước khi đưa vào vận hành chính thức.
