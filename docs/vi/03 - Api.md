## Mô hình hóa

Khi bắt tay thiết kế một module trong RoxaVN, hãy luôn bắt đầu bằng hai câu hỏi:
1. 🧐 Module này sinh ra để làm gì?
2. 🔁 Module này có thể tái sử dụng trong trường hợp nào?

Trả lời được hai câu này, bạn sẽ tự nhiên liệt kê được những tính năng thật sự cần có. Lúc đó module của bạn sẽ gọn gàng, đúng trọng tâm.

Để code đơn giản và dễ hiểu, hãy mô hình hóa mọi thứ xoay quanh đối tượng (entity) – tư tưởng tương tự như lập trình hướng đối tượng (OOP).

Mỗi API chỉ cần làm đúng một việc duy nhất với đối tượng đó:

- Tạo → `POST /object`
- Lấy → `GET /object/:id`
- Sửa → `PUT /object/:id`
- Xóa → `DELETE /object/:id`

Và vì đơn giản là sức mạnh, mỗi module trong RoxaVN chỉ nên có khoảng **4 –> 5 đối tượng (tối đa 10)**. Mỗi đối tượng nên có khoảng từ **7 -> 15 thuộc tính (tối đa 20)**. Mỗi đối tượng này sẽ tương ứng với 1 bảng trong database.

## Đối tượng

Dưới đây là code mẫu khai báo schema cho đối tượng `Message`
```ts
import { Type } from '@roxavn/core/base';

const messageSchema = Type.Resource({
  type: Type.String(),
  userId: Type.String(),
  content: Type.String(),
});
```

#### Type

Type là schema builder được export lại từ thư viện [TypeBox](https://github.com/sinclairzx81/typebox) — một thư viện nhẹ, mạnh mẽ giúp bạn định nghĩa kiểu dữ liệu vừa:

- Type-safe khi lập trình (được hỗ trợ bởi TypeScript).
- Có thể kiểm tra (validate) ở runtime.

Điều này giúp đảm bảo rằng dữ liệu của bạn luôn đúng kiểu ở cả giai đoạn phát triển và khi chạy thực tế.

#### Type.Resource()

Type.Resource() là utility của RoxaVN giúp khai báo schema cho một đối tượng (resource).
Hàm này sẽ **tự động thêm 4 thuộc tính mặc định** mà mọi đối tượng trong RoxaVN đều có:

| Thuộc tính      | Kiểu dữ liệu                     | Mô tả                                                                                                                                                                                          | Cột tương ứng trong DB      |
| --------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **id**          | `Type.String()`                  | Mã định danh duy nhất cho đối tượng. Bắt buộc mọi resource trong RoxaVN phải có. Kiểu dữ liệu trong DB có thể là `bigint`, `uuid`, hoặc `text`, **nhưng giá trị trả về từ DB phải là string.** | id *(primary key)*          |
| **createdDate** | `Type.Date()`                    | Ngày tạo đối tượng.                                                                                                                                                                            | createdDate (`timestamptz`) |
| **updatedDate** | `Type.Date()`                    | Ngày cập nhật gần nhất của đối tượng.                                                                                                                                                          | updatedDate (`timestamptz`) |
| **metadata**    | `Type.Optional(Type.Metadata())` | Lưu các thông tin tuỳ biến cho đối tượng — giúp các **plugin** mở rộng thêm tính năng mà không cần chỉnh sửa schema gốc.                                                                       | metadata (`jsonb`)          |

#### Ví dụ mở rộng với plugin

Giả sử bạn có `module-message` định nghĩa đối tượng `Message` như trên, với thuộc tính `content` lưu nội dung văn bản của tin nhắn. Khi bạn muốn thêm tính năng gửi kèm hình ảnh, thay vì sửa trực tiếp `Message`, bạn nên tạo một plugin riêng — ví dụ: `plugin-message-media`. Plugin này chỉ cần mở rộng trường `metadata` của `Message` để lưu thông tin hình ảnh, chẳng hạn:

```json
{
  "media": [
    { "type": "image", "url": "https://cdn.example.com/photo1.png" }
  ]
}
```

Cách tiếp cận này giúp:
  
* Giữ `module-message` nhẹ, đơn giản và dễ tái sử dụng.
* Cho phép các plugin mở rộng linh hoạt mà không phá vỡ cấu trúc ban đầu của đối tượng.

## Tạo API

Vì các đối tượng là trung tâm, nên khi khai báo api, cần xác định api đó cho đối tượng nào. Dưới đây là code mẫu của api tạo mới cho đối tượng `Message` bên trên

```ts
import { accessManager, ApiSource } from '@roxavn/core/base';
import { baseModule } from './module.js';

const scopes = accessManager.makeScopes(baseModule, {
  Message: { schema: messageSchema } // messageSchema is defined above
});

const messageSource = new ApiSource(scopes.Message, baseModule);

export const messageApi = {
  create: messageSource.api({
    method: 'POST';
    path: messageSource.apiPath(),
    request: Type.Object({
      content: Type.String({ minLength: 1, maxLength: 8096 }),
      metadata: Type.Optional(Type.Metadata()),
    }),
    response: Type.Object({ id: Type.String() }),
    authorization: {
      policies: [
        policies.Module(baseModule, permissions.CreateMessage),
      ],
    },
  })
};
```

#### Giải thích chi tiết

| Thành phần                                                                     | Vai trò                                                     | Giải thích                                                                                                                                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessManager.makeScopes(baseModule, { Message: { schema: messageSchema } })` | Khởi tạo **scope truy cập** cho đối tượng `Message`.        | Mỗi đối tượng trong module đều có “scope” riêng để xác định quyền truy cập và cấu hình schema tương ứng.                                                       |
| `new ApiSource(scopes.Message, baseModule)`                                    | Tạo một **nguồn API (API source)** cho đối tượng `Message`. | Lớp `ApiSource` giúp tự động ánh xạ route, xử lý prefix đường dẫn.                                                                                             |
| `messageSource.api({...})`                                                     | Định nghĩa một **endpoint cụ thể** (ở đây là API tạo mới).  | Sử dụng phương thức `api()` của `ApiSource` để tạo route RESTful, đồng thời gắn kèm schema request/response (giúp validate, parse dữ liệu) và policy xác thực. |

## Các thuộc tính API

### 1. method

RoxaVN chỉ hỗ trợ các HTTP method tiêu chuẩn sau khi khai báo API:

| **Method** | **Chức năng**     | **Mô tả chi tiết**                                                                                                                                     |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **GET**    | Đọc dữ liệu       | Dùng để **lấy dữ liệu** từ database. API GET **không được phép ghi hoặc thay đổi dữ liệu**.                                                            |
| **POST**   | Tạo mới dữ liệu   | Dùng để tạo đối tượng mới. Trong một số trường hợp, nếu API cần lấy đối tượng, và nếu chưa có thì tạo mới rồi trả về đối tượng vừa tạo, vẫn dùng POST. |
| **PUT**    | Cập nhật toàn bộ  | Dùng để cập nhật toàn bộ thông tin của đối tượng. Tất cả các trường cũ sẽ bị ghi đè.                                                                   |
| **PATCH**  | Cập nhật một phần | Dùng để cập nhật một phần dữ liệu của đối tượng (chỉ những trường được gửi lên).                                                                       |
| **DELETE** | Xoá dữ liệu       | Dùng để xoá đối tượng khỏi hệ thống.                                                                                                                   |

#### 🧭 Quy tắc sử dụng

Luôn chọn đúng method tương ứng với mục đích của API. Điều này không chỉ giúp code dễ đọc và dễ bảo trì, mà còn tối ưu khả năng mở rộng (scalability) của hệ thống.

#### ⚙️ Ví dụ minh họa

Giả sử bạn triển khai hệ thống có:
- **1 database Master**: chuyên xử lý **ghi dữ liệu** (POST, PUT, PATCH, DELETE).  
- **2 database Slave**: chuyên xử lý **đọc dữ liệu** (GET).  
- **5 Web server** kết nối đến Master.  
- **10 Web server** kết nối đến Slave.

Khi đó, bạn có thể cấu hình router theo hướng sau:

- Tất cả request có method = GET được điều hướng đến 10 Web server (Slave).  
- Các method còn lại (POST, PUT, PATCH, DELETE) được điều hướng đến 5 Web server (Master).

Cách tách biệt này giúp:
- Tăng khả năng chịu tải (load balancing) khi có nhiều request đọc dữ liệu.  
- Giảm độ trễ và rủi ro xung đột ghi lên cơ sở dữ liệu chính.

### 2. path

`path` là **đường dẫn** (URL) của API, được tạo tự động dựa trên module và đối tượng mà API đó phục vụ.

Khi gọi hàm `messageSource.apiPath()` RoxaVN sẽ tự động sinh đường dẫn theo định dạng:

```
/{moduleName}/{scopeName}/v1
```

Ví dụ nếu `baseModule` có tên là `"chat"`, và scope là `"Message"`, thì đường dẫn API sẽ là:

```
/chat/message/v1
```

#### Thay đổi version

Nếu bạn muốn sử dụng version khác cho API (ví dụ v2), chỉ cần truyền tham số `version`:

```ts
messageSource.apiPath({ version: '2' })
```

Kết quả:

```
/chat/message/v2
```

#### API cho từng đối tượng cụ thể

Trong trường hợp API dùng để lấy thông tin hoặc cập nhật một đối tượng cụ thể, bạn nên thêm `/:id` vào cuối URL, ví dụ:

```ts
messageSource.apiPath() + '/:id'
```

Khi đó URL sẽ có dạng:

```
/chat/message/v1/:id
```

### 3. request

`request` là schema định nghĩa dữ liệu đầu vào cho API. RoxaVN sử dụng schema này để validate, parse toàn bộ dữ liệu request — bao gồm:
- **param** trong URL (ví dụ: `/chat/message/v1/:id` → lấy `id`),
- **query string** trong URL (ví dụ: `/chat/message/v1?page=3` → lấy `page`),
- và **body** của request (JSON gửi lên từ client).

Tất cả các phần này sẽ được **gom lại** và kiểm tra hợp lệ dựa trên schema mà bạn định nghĩa. Các thuộc tính thừa mà client gửi lên, không được khai báo trong `request` sẽ được loại bỏ.

### 4. response

`response` là schema định nghĩa dữ liệu trả về từ server. RoxaVN sử dụng schema này để parse dữ liệu trả về cho client.

Mọi kết quả trả về của API trong RoxaVN đều được chuẩn hoá theo định dạng **JSON**, giúp client dễ dàng xử lý dữ liệu. Tuy nhiên, một số kiểu dữ liệu (như `Date`) khi được trả về JSON sẽ trở thành chuỗi ISO (`ISO date string`). Khi bạn khai báo với `Type.Date()`, RoxaVN sẽ tự động parse chuỗi ISO này thành đối tượng `Date` trên client — đảm bảo dữ liệu luôn đúng kiểu và sẵn sàng sử dụng.

### 5. authorization

`authorization` định nghĩa danh sách các chính sách bảo mật (security policies) cho API. Khi người dùng gửi request, RoxaVN sẽ kiểm tra tất cả các chính sách trong danh sách này.  
- Nếu ít nhất một chính sách cho phép truy cập, request sẽ được xử lý và trả về `response`.  
- Nếu không có chính sách nào hợp lệ, server sẽ trả về mã lỗi **403 – Forbidden**.

```ts
    authorization: {
      policies: [
        policies.Module(baseModule, permissions.CreateMessage),
      ],
    },
```

Ví dụ ở trên chỉ người dùng có quyền `permissions.CreateMessage` trong baseModule mới có thể gọi API này.

## Các hàm tiện ích tạo API

`ApiSource` có các hàm tiện ích giúp tạo nhanh các api `create`, `update`, `getOne`, `delete`, `getMany`. Ví dụ api tạo mới Message bên trên có thẻ được viết gọn lại như sau:

```ts
export const messageApi = {
  create: messageSource.create({
    request: Type.Object({
      content: Type.String({ minLength: 1, maxLength: 8096 }),
      metadata: Type.Optional(Type.Metadata()),
    }),
    authorization: {
      policies: [
        policies.Module(baseModule, permissions.CreateMessage),
      ],
    },
  })
};
```

## Định dạng kết quả trả về của API

Mọi API trong RoxaVN đều trả về dữ liệu theo định dạng JSON thống nhất, giúp client dễ dàng xử lý, debug và hiển thị lỗi một cách nhất quán.

### Cấu trúc phản hồi chung

```json
{
  "code": number,
  "data": { ... },
  "error": undefined | {
    "type": string,
    "code": number,
    "metadata": any,
    "i18n": Record<string, {
      "key": string,
      "ns": string | undefined,
      "params": Record<string, any> | undefined
    }>
  }
}
````

Giải thích từng trường

| Trường    | Kiểu dữ liệu | Mô tả                                                                                                                                                                                                                                                |
| --------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **code**  | `number`     | Mã trạng thái HTTP. Tuân theo chuẩn [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).<br>• `200` – Thành công<br>• `400` – Lỗi request không hợp lệ<br>• `403` – Không có quyền truy cập<br>• `500` – Lỗi server nội bộ |
| **data**  | `object`     | Dữ liệu phản hồi, tuân theo **`response schema`** được định nghĩa trong API.                                                                                                                                                                         |
| **error** | `object`     | Thông tin về lỗi                                                                                                                                                                                                                                     | Thông tin chi tiết về lỗi (nếu có). Nếu request thành công, trường này sẽ là `null`. |

### Chi tiết trường `error`

| Thuộc tính    | Kiểu                  | Mô tả                                                                        |
| ------------- | --------------------- | ---------------------------------------------------------------------------- |
| **type**      | `string`              | Loại lỗi, ví dụ: `"Error.ValidationException"`, `"Error.NotFoundException"`. |
| **code**      | `number`              | Mã lỗi nội bộ, dùng để định danh từng loại lỗi trong hệ thống.               |
| **metadata**  | `any`                 | Dữ liệu bổ sung (vd: trường bị sai trong ValidationException).               |
| **i18n**      | `object`              | Thông tin phục vụ cho việc đa ngôn ngữ hóa thông báo lỗi.                    |
| `i18n.key`    | `string`              | Key của bản dịch lỗi (ví dụ: `"Error.ValidationException"`).                 |
| `i18n.ns`     | `string`              | Namespace của bản dịch (vd: `"@roxavn@core"`).                               |
| `i18n.params` | `Record<string, any>` | Danh sách tham số để render thông báo lỗi.                                   |

###  Cấu trúc `data` khi trả về danh sách có phân trang (pagination)

Nếu API trả về danh sách đối tượng, dữ liệu trong trường `data` sẽ có cấu trúc sau:

```json
{
  "items": [ ... ],
  "pagination": {
    "page": number,
    "pageSize": number,
    "totalItems": number
  }
}
```

#### Quy tắc xử lý pagination

* Khi request có tham số `page`, server sẽ:

  * Tự động truy vấn `totalItems` từ database.
  * Trả về đối tượng `pagination` kèm trong phản hồi.
* Nếu request không có tham số `page`, trường `pagination` sẽ là `undefined` để giảm tải cho server (không cần đếm tổng số bản ghi).

### ✅ Ví dụ phản hồi thành công

```json
{
  "code": 200,
  "data": {
    "items": [
      { "id": "1", "content": "Hello!" },
      { "id": "2", "content": "World!" }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 25
    }
  }
}
```

### ❌ Ví dụ phản hồi lỗi

```json
{
  "code": 422,
  "error": {
    "type": "Error.ValidationException",
    "code": 422,
    "metadata": {
      "fields": [
        {
          "path": "newPassword",
          "i18n": {
            "key": "Validation.StringMinLength",
            "params": { "minLength": 6, "type": "string" },
            "ns": "@roxavn@core"
          }
        }
      ]
    },
    "i18n": {
      "key": "Error.ValidationException",
      "ns": "@roxavn@core"
    }
  }
}
```

Trên là ví dụ lỗi khi validate request API, trong metadata chứa thông tin về trường `newPassword` bị lỗi "độ dài tối thiểu là 6".

## API Error

RoxaVN cung cấp sẵn một tập hợp **exception chuẩn** để thống nhất cách xử lý và phản hồi lỗi trong toàn hệ thống. Các exception này giúp API tự động trả về mã lỗi (`code`) và thông tin chi tiết trong trường `error` theo định dạng JSON.


| Tên lỗi                    | Code  | Mô tả                                                       | Khi nào sử dụng                                                                                             |
| -------------------------- | ----- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **badRequestException**    | `400` | Yêu cầu không hợp lệ về mặt **nghiệp vụ (business logic)**. | Khi dữ liệu hợp lệ về cú pháp, nhưng không hợp lệ về logic (vd: user cố gắng xoá chính tài khoản của mình). |
| **alreadyExistsException** | `409` | Tài nguyên đã tồn tại.                                      | Khi gọi API `POST` để tạo dữ liệu trùng khoá hoặc trùng id.                                                 |
| **forbiddenException**     | `403` | Không có quyền truy cập tài nguyên.                         | Khi người dùng không đủ quyền (`permission`) để thực hiện hành động.                                        |
| **validationException**    | `422` | Request không hợp lệ về mặt **schema**.                     | Khi dữ liệu gửi lên không khớp với schema `request` được khai báo trong API.                                |
| **notFoundException**      | `404` | Không tìm thấy tài nguyên.                                  | Khi truy vấn id hoặc record không tồn tại trong database.                                                   |
| **serverException**        | `500` | Lỗi nội bộ server.                                          | Khi hệ thống gặp lỗi không xác định (lỗi ngoài dự kiến).                                                    |

Ngoài ra bạn có thể tự tạo lỗi với câu lệnh `npx roxavn gen error`

```bash
✔ What's your error name? · userNotFound
✔ What's your error message in english? · User {{name}}  not found

Loaded templates: /.../roxavn/packages/cli/templates
      inject: static/locales/en.json
      inject: static/locales/en.json
     skipped: src/base/errors.ts
⠴ shell: npx roxavn sync -i is in progress...
```

Sau khi hoàn tất, RoxaVN sẽ tự động:

- Thêm lỗi userNotFoundException vào file src/base/errors.ts.
```ts
export const userNotFoundException = new BaseException({
  baseModule,
  type: 'Error.UserNotFoundException',
  code: 404 // thêm dòng này trả về mã lỗi 404, mặc định là 400
});
```
- Cập nhật file bản dịch static/locales/en.json để hỗ trợ thông báo lỗi i18n.
- Đồng bộ kiểu cho i18n trong project.

Bạn có thể throw lỗi này ở bất kỳ đâu trong logic xử lý của API:

```ts
throw userNotFoundException.make({ name: 'Woody' })
```

Server sẽ trả về phản hồi JSON tương ứng như sau

```json
{
  "code": 404,
  "error": {
    "type": "Error.UserNotFoundException",
    "code": 404,
    "i18n": {
      "key": "Error.UserNotFoundException",
      "ns": "{{ YOUR_MODULE_NAME }}",
      "params": { "name": "Woody" }
    }
  }
}
```