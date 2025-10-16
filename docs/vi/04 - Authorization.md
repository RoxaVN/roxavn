## Giới thiệu về Policy

RoxaVN có cách tiếp cận kiểm soát quyền truy cập (authorization) khác biệt so với các framework truyền thống. Thay vì phải tự kiểm tra quyền trong từng hàm xử lý (controller/service), RoxaVN cho phép bạn định nghĩa các policy ngay tại khai báo API.  

Nhờ vậy:
- **Backend** không cần viết lại các đoạn `if (!hasPermission) throw forbiddenException()` nữa, vì đã có `AuthorizationMiddleware` tự động kiểm tra.  
- **Frontend** không cần tự xử lý quyền thủ công, mà chỉ cần dùng các tiện ích sẵn có như component `<IfCanAccessApi />` hoặc hook `useAuthorization()`.

Ví dụ trên Frontend:

```tsx
<IfCanAccessApi api={messageApi.getMany} children={<ListMessages />} />
````

Đoạn code trên sẽ:

* Kiểm tra xem user hiện tại có quyền gọi API `messageApi.getMany` hay không.
* Nếu có quyền, component `<ListMessages />` sẽ được hiển thị.
* Nếu không có quyền, component đó sẽ không render — giúp giao diện tự động ẩn các phần không được phép truy cập.

### Định nghĩa policy trong API

Mỗi API trong RoxaVN có thể định nghĩa danh sách các policy kiểm tra quyền thông qua thuộc tính `authorization.policies`. Cấu trúc như sau:

```ts
authorization: {
  policies: Array<(context: PolicyContext) => BasePolicy | undefined>,
},
```

Trong đó:

* `context` là ngữ cảnh hiện tại, có kiểu là `PolicyContext` bao gồm thông tin người dùng, request khi gọi api.
* Mỗi phần tử trong mảng `policies` là một hàm trả về
  * `BasePolicy` — dùng để mô tả logic kiểm tra quyền cụ thể.
  * `undefined` - không được phép
* Khi có **ít nhất một policy hợp lệ**, user được phép truy cập API.
* Nếu **không có policy nào cho phép**, server sẽ tự động trả về lỗi **403 Forbidden** mà không cần viết thêm code.

### BasePolicy

`BasePolicy` là một abstract class trong RoxaVN, được dùng làm nền tảng để xây dựng các chính sách kiểm tra quyền truy cập (authorization policy). Mỗi policy kế thừa từ `BasePolicy` sẽ định nghĩa điều kiện kiểm tra quyền riêng biệt, giúp hệ thống linh hoạt và dễ mở rộng.

```ts
abstract class BasePolicy<S> {
  abstract priority: number;

  abstract check: (context: PolicyContext, arg: S) => boolean;

  constructor(public data: T) {}

  static getter(context, data: T): S;
}
```

#### Giải thích chi tiết

| Thành phần       | Mô tả                                                      |
| -----------------|------------------------------------------------------------|
| **priority**:`number`                        | Độ ưu tiên của policy. Khi có nhiều policy cùng kiểm tra, RoxaVN sẽ sắp xếp theo thứ tự `priority` (thấp hơn chạy trước).                                                                                                            |
| **check**(context: `PolicyContext`, arg: `S`) => `boolean` | Hàm kiểm tra điều kiện với đầu vào là PolicyContext và arg S được lấy từ hàm static `getter()`, nếu policy không định nghĩa `getter()` thì arg sẽ là undefined. Trả về `true` nếu user được phép truy cập, ngược lại trả về `false`. |
| **constructor**(data: `any`)    | Truyền dữ liệu khởi tạo cho policy module.                                                                                                                                                                                           |
| *static* **getter**(context: `PolicyContext`, data: any) => `S`          | Hàm tiện ích dùng để trích xuất dữ liệu cần thiết `S` (nếu trả về S là undefined thì coi như kiểm tra quyền thất bại) từ `context` và `data` trước khi gọi `check()`. Không bắt buộc phải khai báo                                   |

#### Flow kiểm tra policy 

```mermaid
stateDiagram-v2
    state "policy.constructor.getter() to get resource S" as getter
    state "policy.check(context, resource S)" as check

    [*] --> getter: call
    getter --> False: can't get resource
    getter --> check: call
    check --> True
    check --> False
```

#### Ví dụ minh họa

Giả sử bạn muốn định nghĩa một policy cho phép người dùng truy cập API khi có quyền

```ts
export class SimpleRolePolicy extends BasePolicy {
  priority = 10;

  check = (
    _context: PolicyContext,
    role: { permissions: string[] }
  ) => {
    return role.permissions.includes(this.data.permission);
  };

  constructor(data: {permission: string}}) {
    this.data = data;
  }

  static async getter(
    ctx: PolicyContext,
    data: SimpleRolePolicy['data']
  ): Promise<{ permissions: string[] }> {
    throw new Error('[RolePolicy] Must define ' + ctx + data);
  }
}
```

* **`check()`**
  Hàm kiểm tra quyền thực tế. RoxaVN sẽ truyền vào `context` và dữ liệu được lấy từ `getter()`.
  Trong ví dụ trên, hàm chỉ đơn giản kiểm tra xem `permission` của policy có nằm trong danh sách `role.permissions` hay không.

* **`getter()`**
  Đây là hàm **bắt buộc override** trên từng môi trường (Backend hoặc Frontend) để xác định cách lấy `role` của người dùng:

  * **Backend:** sẽ truy vấn cơ sở dữ liệu để lấy danh sách quyền (`permissions`) của user.
  * **Frontend:** sẽ lấy thông tin `role` từ `RolesContext`.

> ⚠️ Nếu bạn không override `getter()` ở môi trường tương ứng, policy sẽ ném lỗi như trong ví dụ trên (`throw new Error(...)`).

Ở phía client, để policy hoạt động đúng, bạn cần bọc toàn bộ ứng dụng hoặc khu vực cần kiểm tra quyền bằng component:

```tsx
<ApiRolesGetter api={roleApi.getMany} apiRequest={{userId: user.id}}>
  <IfCanAccessApi api={messageApi.create}>
    <CreateMessageForm />
  </IfCanAccessApi>
</ApiRolesGetter>
```

* **`<ApiRolesGetter />`**:
  Component này có nhiệm vụ lấy danh sách `role` của người dùng, sau đó lưu vào `RolesContext`.

Cách dùng

```ts
const messageApi = {
  create: messageSource.create({
    request: Type.Any({}),
    authorization: {
      policies: [
        (context) =>
          new SimpleRolePolicy({
            permission: permissions.CreateMessage.name,
          }),
      ],
    },
  }),
}
```

## Role-based access control

Ví dụ `SimpleRolePolicy` ở trên chỉ minh họa cách kiểm tra quyền đơn giản. Trong thực tế, RoxaVN hỗ trợ **mô hình phân quyền đa tầng (multi-scope)** để xử lý các trường hợp phức tạp hơn, nơi mà một người dùng có thể có nhiều vai trò khác nhau ở các phạm vi khác nhau.

### Vấn đề thực tế

Hệ thống phân quyền của RoxaVN được thiết kế để giải quyết các bài toán như sau:

- Mỗi **module** trong RoxaVN có thể có **các chức vụ (role)** riêng biệt với **quyền (permission)** cụ thể để quản lý dữ liệu trong module đó.  
  → Ví dụ: module `@roxavn/module-message` có role `Admin` với quyền *xem*, *sửa*, *xoá* tất cả `Channel` và `Message`.

- Bên cạnh đó, trong từng **phạm vi nhỏ hơn** (như Channel, Project, ...), người dùng có thể có **role riêng biệt**.  
  → Ví dụ: trong channel “Tin tức về RoxaVN” (id = 1), người dùng có thể mang vai trò `ChannelAdmin` hoặc `ChannelModerator`, cho phép họ *xem*, *sửa*, *xoá* tất cả `Message` thuộc riêng channel này.

### Cấu trúc Role

Để hỗ trợ mô hình trên, RoxaVN định nghĩa cấu trúc `Role` với các thuộc tính sau:

| Thuộc tính      | Kiểu dữ liệu | Mô tả                                                                                                                                                              |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **name**        | `string`     | Tên của chức vụ (ví dụ: `Admin`, `Viewer`, `Moderator`, ...)                                                                                                       |
| **scope**       | `string`     | Tên của phạm vi áp dụng quyền. Ví dụ: <br> - `@roxavn/module-message` cho role cấp module <br> - `channel` cho role cấp channel                                    |
| **scopeId**     | `string`     | ID của phạm vi. <br> - Với role module, `scopeId = '*'` (áp dụng cho toàn bộ module). <br> - Với role cấp channel, `scopeId` chính là ID của channel (ví dụ: `1`). |
| **permissions** | `string[]`   | Danh sách quyền mà role được cấp (ví dụ: `CreateMessage`, `DeleteMessage`, `EditChannel`, ...).                                                                    |


### Ứng dụng Web

Như đã giới thiệu ở phần đầu, ứng dụng web của RoxaVN được chia thành ba phần chính Admin Dashboard, Personal Profile, Custom Application. Mỗi phần có cơ chế quản lý quyền (role & permission) khác nhau, nhưng đều sử dụng chung kiến trúc `ApiRolesGetter` và `RolesContext` để quản lý quyền người dùng trên frontend.

#### 1. Admin Dashboard

Trong khu vực Admin Dashboard, khi người dùng truy cập, client sẽ tự động lấy toàn bộ danh sách `role` mà user đang có trong các module bằng component `ApiRolesGetter`.

```tsx
// Component ApiRolesGetter có nhiệm vụ lấy danh sách `role` của người dùng,
// sau đó lưu vào RolesContext để các component con có thể sử dụng lại.
<ApiRolesGetter api={authService.getUserModulesApi}>
  <AdminComponent />
</ApiRolesGetter>
````

Sau khi `RolesContext` được khởi tạo, tất cả các trang hoặc component con có thể sử dụng các cơ chế kiểm tra quyền như:

```tsx
<IfCanAccessApi api={messageApi.create}>
  <CreateMessageButton />
</IfCanAccessApi>
```

> ✅ **Lưu ý:**
> Trong Admin Dashboard, bạn không cần gọi lại API để lấy role của người dùng — vì `ApiRolesGetter` đã tự động xử lý điều này ngay từ đầu.

#### 2. Personal Profile và Custom Application

Đối với các khu vực mang tính cá nhân hoặc ứng dụng tuỳ chỉnh, quyền truy cập thường phụ thuộc vào **phạm vi (scope)** cụ thể — ví dụ như từng đối tượng như `Channel`, `Project`, ...

Trong các trường hợp này, bạn cần đặt component `ApiRolesGetter` ở cấp phạm vi của đối tượng, để chỉ lấy các role có liên quan đến scope đó.

```tsx
<ApiRolesGetter apiRequest={{ scope: scopes.Channel.name, scopeId: channel.id }}>
  <ChannelDetail />
</ApiRolesGetter>
```

* `scope`: tên của phạm vi cần lấy quyền (ví dụ: `"channel"`).
* `scopeId`: định danh cụ thể của phạm vi (ví dụ: `channel.id = "1"`).

Sau đó `RolesContext` sẽ lưu role cho phạm vi này, toàn bộ các component con bên trong (như danh sách tin nhắn, hành động xoá, ghim, chỉnh sửa, v.v.) có thể sử dụng trực tiếp `IfCanAccessApi` để kiểm tra quyền.

#### 3. Cách hoạt động tổng quát

1. `ApiRolesGetter` gọi API lấy danh sách role tương ứng với **scope** và **scopeId**.
2. Các role được lưu vào `RolesContext`.
3. `IfCanAccessApi` và `useAuthorization()` tự động đọc dữ liệu trong `RolesContext` để kiểm tra quyền truy cập.
4. Nếu người dùng không có quyền phù hợp, component sẽ không hiển thị hoặc thao tác sẽ bị vô hiệu hóa.
