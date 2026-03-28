# Patients API

---

## Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/patients` | Создать пациента |
| `GET` | `/patients` | Список пациентов |
| `GET` | `/patients/:id` | Детали пациента |

Все эндпоинты защищены — требуют `Authorization: Bearer <token>`.

---

## POST /patients — Создание пациента

**Запрос:**
```http
POST /patients
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "firstName": "Анна",
  "lastName": "Ковальчук",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "phone": "+380991234567",
  "email": "anna@example.com",
  "addressStreet": "ул. Крещатик 1",
  "addressCity": "Киев",
  "addressZip": "01001",
  "addressCountry": "Украина",
  "tags": ["vip"]
}
```

**Обязательные поля:**

| Поле | Тип | Ограничения |
|---|---|---|
| `firstName` | string | min 1, max 100 символов, не только пробелы |
| `lastName` | string | min 1, max 100 символов, не только пробелы |
| `dateOfBirth` | string | строго формат `YYYY-MM-DD` |

**Опциональные поля:**

| Поле | Тип | Ограничения |
|---|---|---|
| `gender` | `"male" \| "female" \| "other"` | только эти значения |
| `phone` | string | валидный международный номер (`+380991234567`), max 30 |
| `email` | string | валидный email, max 255, сохраняется в lowercase |
| `addressStreet` | string | max 255 |
| `addressCity` | string | max 100 |
| `addressZip` | string | max 20 |
| `addressCountry` | string | max 100 |
| `tags` | string[] | max 20 тегов, каждый max 50 символов, дубли игнорируются |

**Автоматическая обработка на сервере:**
- Пробелы в начале/конце строк обрезаются (`"  Анна  "` → `"Анна"`)
- Email приводится к lowercase (`"Anna@Example.COM"` → `"anna@example.com"`)
- Теги дедуплицируются и очищаются от пробелов
- Пустая строка `""` эквивалентна отсутствию поля

**Что нельзя передавать в body — будет отклонено с `400`:**
- `organizationId` — берётся из токена автоматически
- `status` — всегда `"new"` при создании
- `photoUrl` — отдельный эндпоинт (в разработке)
- любые неизвестные поля

**Ответ `201 Created`:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Анна",
    "lastName": "Ковальчук",
    "dateOfBirth": "1990-05-15",
    "gender": "female",
    "phone": "+380991234567",
    "email": "anna@example.com",
    "addressStreet": "ул. Крещатик 1",
    "addressCity": "Киев",
    "addressZip": "01001",
    "addressCountry": "Украина",
    "photoUrl": null,
    "status": "new",
    "tags": ["vip"],
    "organizationId": "uuid",
    "createdAt": "2026-03-12T10:00:00.000Z",
    "updatedAt": "2026-03-12T10:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-03-12T10:00:00.000Z",
    "path": "/patients"
  }
}
```

**Ошибки:**
```json
// 400 — невалидные поля
{
  "success": false,
  "statusCode": 400,
  "message": [
    "firstName must not be empty or whitespace",
    "dateOfBirth must be in format YYYY-MM-DD",
    "phone must be a valid international phone number"
  ]
}

// 400 — неизвестное поле (например передали organizationId)
{
  "success": false,
  "statusCode": 400,
  "message": ["property organizationId should not exist"]
}

// 401 — нет или истёк токен
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Частые ошибки фронта:**

| Ситуация | Что происходит |
|---|---|
| `dateOfBirth: "15.05.1990"` | 400 — неверный формат, нужен `YYYY-MM-DD` |
| `phone: "0991234567"` | 400 — нужен международный формат `+380991234567` |
| `gender: "Женский"` | 400 — только `male`, `female`, `other` |
| `tags: ["VIP", "vip"]` | OK — дубли удаляются, сохранится `["vip"]` |
| `firstName: "   "` | 400 — только пробелы не принимаются |
| `email: "ANNA@CLINIC.COM"` | OK — сохранится как `anna@clinic.com` |

---

## GET /patients — Список пациентов

**Запрос:**
```http
GET /patients?page=1&limit=20&search=Анна&status=active
Authorization: Bearer <token>
```

**Query-параметры:**

| Параметр | Тип | Дефолт | Описание |
|---|---|---|---|
| `page` | number | `1` | Номер страницы |
| `limit` | number | `10` | Записей на странице (max 100) |
| `search` | string | — | Поиск по имени, фамилии, email, телефону |
| `status` | `"new" \| "active" \| "vip" \| "archived"` | — | Фильтр по статусу |
| `sortBy` | `"firstName" \| "lastName" \| "createdAt" \| "dateOfBirth"` | `"createdAt"` | Поле сортировки |
| `sortOrder` | `"ASC" \| "DESC"` | `"DESC"` | Направление сортировки |

**Ответ `200 OK`:**
```json
{
  "success": true,
  "data": {
    "data": [ ...пациенты ],
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## GET /patients/:id — Детали пациента

**Запрос:**
```http
GET /patients/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
```

**Ответ `200 OK`:** полный объект пациента (тот же формат что и в POST ответе).

**Ошибки:**
```
404 — пациент не найден или принадлежит другой организации
401 — нет или истёк токен
```

---

## Статусы пациента

| Статус | Описание |
|---|---|
| `new` | Только что добавлен, ещё не был на приёме |
| `active` | Активный пациент |
| `vip` | VIP пациент |
| `archived` | Архивирован (скрыт из основного списка) |

> Статус меняется через `PATCH /patients/:id` — в разработке.
