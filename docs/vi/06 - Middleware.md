## Backend

Trong RoxaVN, mọi API được gọi thông qua một **Router pipeline**, nơi mỗi middleware có thể can thiệp, xác thực, hoặc biến đổi request/response.  
Hai khái niệm quan trọng trong pipeline là **RouterContext** và **MiddlewareService**.

### `RouterContextState`

`RouterContextState` chứa toàn bộ trạng thái của request đang được xử lý. Đây là phần dữ liệu "mềm" mà middleware hoặc API handler có thể đọc, ghi hoặc sửa đổi trong suốt vòng đời của request.

```ts
export interface RouterContextState<T extends Api = Api> {
  request: InferApiRequest<T>; // Dữ liệu request (tự infer từ Api)
  response?: InferApiResponse<T>; // Dữ liệu response (nếu đã có)
  requestHeaders: Record<string, any>; // Header request
  responseHeaders: Record<string, any>; // Header response
  user?: { id: string }; // Thông tin user đã xác thực (nếu có)
  userSession?: {
    id: string;
    expiryDate: Date;
    createdDate: Date;
    metadata: Record<string, any> | null;
  }; // Thông tin phiên đăng nhập của user
  [key: string]: any; // Cho phép middleware khác thêm dữ liệu tuỳ ý
}
```

#### Ví dụ

* Middleware xác thực (`AuthMiddleware`) có thể gán `context.state.user` khi user đã login.
* Middleware ghi log (`LoggerMiddleware`) có thể thêm `traceId` vào `context.state`.

### `RouterContext`

`RouterContext` là đối tượng truyền qua toàn bộ pipeline xử lý API.
Mỗi middleware nhận `RouterContext` và có thể đọc, ghi, hoặc chặn luồng xử lý.

```ts
export interface RouterContext {
  request: Request; // Đối tượng request gốc (từ Node.js, ...)
  state: RouterContextState; // Trạng thái mở rộng của request
  api: Api; // Định nghĩa API đang được gọi
}
```

#### Ví dụ

```ts
context.request.url       // URL của request
context.state.user?.id    // ID user hiện tại
context.api.method        // Loại API (GET, POST, PUT, ...)
```

### MiddlewareService

Middleware là lớp trung gian cho phép bạn can thiệp pipeline xử lý API — ví dụ:

* Kiểm tra xác thực
* Ghi log request
* Thêm headers
* Biến đổi dữ liệu request/response

Mỗi middleware kế thừa từ `MiddlewareService` và được đăng ký vào `serverModule` bằng decorator `@serverModule.useApiMiddleware()`.

```ts
@serverModule.useApiMiddleware()
export class ValidatorMiddleware extends MiddlewareService {
  priority: number;

  async handle(context: RouterContext, next: () => Promise<void>) {
    // Xử lý trước khi API handler chạy
    await next();
    // Xử lý sau khi API handler hoàn thành
  }
}
```

#### Giải thích:

* `priority`: Xác định thứ tự thực thi middleware (số càng nhỏ chạy càng sớm)
* `handle(context, next)`: Hàm chính của middleware

  * `context`: Thông tin request hiện tại
  * `next()`: Gọi middleware kế tiếp trong chuỗi (hoặc handler cuối cùng)

### Cách sử dụng

#### Kiểm tra Header hợp lệ

```ts
@serverModule.useApiMiddleware()
export class HeaderValidatorMiddleware extends MiddlewareService {
  priority = 10;

  async handle(context: RouterContext, next: () => Promise<void>) {
    const { requestHeaders } = context.state;
    if (!requestHeaders['x-api-key']) {
      throw new Error('Missing API Key');
    }
    await next();
  }
}
```

#### Ghi log Request

```ts
@serverModule.useApiMiddleware()
export class LoggerMiddleware extends MiddlewareService {
  priority = 100;

  async handle(context: RouterContext, next: () => Promise<void>) {
    const start = Date.now();
    await next();
    console.log(`[${context.api.method}] ${context.request.url} - ${Date.now() - start}ms`);
  }
}
```

Rất hay — phần này có thể được trình bày trong tài liệu chính thức như sau để người đọc hiểu rõ vai trò và thứ tự hoạt động của các middleware trong RoxaVN 👇

### Các Middleware có sẵn trong RoxaVN

RoxaVN cung cấp sẵn một số middleware hệ thống giúp quá trình xử lý request trở nên an toàn, tự động và nhất quán hơn. Các middleware này được tự động đăng ký khi khởi tạo server, theo đúng thứ tự ưu tiên (`priority`).

#### 1. TransactionalMiddleware

Đảm bảo toàn bộ quá trình xử lý một request (bao gồm nhiều thao tác database khác nhau) được thực thi trong **một transaction duy nhất**. Nếu bất kỳ lỗi nào xảy ra trong quá trình xử lý API, transaction sẽ **tự động rollback**, giúp dữ liệu luôn ở trạng thái nhất quán.

**Đặc điểm:**
- Tự động bắt đầu transaction khi request bắt đầu.
- Tự động commit nếu không có lỗi.
- Tự động rollback nếu có exception hoặc validation fail.
- Không cần thao tác thủ công trong từng API.

#### 2. ValidatorMiddleware

Kiểm tra **đầu vào (input)** của request có hợp lệ so với schema khai báo trong định nghĩa API hay không.

Nếu request không hợp lệ, middleware sẽ **ngăn API chạy** và trả về lỗi `422 validationException`, kèm thông tin lỗi chi tiết theo từng field để frontend hiển thị chính xác.

#### 3. AuthenticatorMiddleware

Xác thực người dùng (Authentication) trước khi vào API. Middleware này kiểm tra **accessToken** trong cookie hoặc header. 

Nếu token hợp lệ:

* Lưu thông tin `user` và `userSession` vào `context.state`
* Cho phép tiếp tục luồng xử lý

Nếu không hợp lệ:

* Trả về lỗi `401 unauthorizedException`

#### 4. AuthorizationMiddleware

Thực hiện kiểm tra quyền truy cập (Authorization) của người dùng dựa trên **policy** được khai báo trong định nghĩa API. Middleware này tự động:

1. Lấy danh sách policy trong `authorization.policies`
2. Gọi lần lượt từng policy
3. Nếu **ít nhất 1 policy cho phép**, request được tiếp tục
4. Nếu **không có policy nào cho phép**, trả về lỗi `403 forbiddenException`


#### 5. Thứ tự thực thi Middleware (Pipeline)

| Thứ tự | Middleware                | Nhiệm vụ chính                              |
| :----: | ------------------------- | ------------------------------------------- |
|   1️⃣    | `TransactionalMiddleware` | Mở transaction cho toàn bộ request          |
|   2️⃣    | `ValidatorMiddleware`     | Kiểm tra đầu vào có hợp lệ với schema không |
|   3️⃣    | `AuthenticatorMiddleware` | Xác thực user từ token                      |
|   4️⃣    | `AuthorizationMiddleware` | Kiểm tra quyền truy cập qua policy          |
|   5️⃣    | API Handler               | Xử lý nghiệp vụ chính nếu hợp lệ            |
