### Шедулеры (cron задачи)

Шедулеры запускаются при старте приложения в `startCronJobs()` и работают на базе cron-выражений (node-cron).

- Логи запусков/ошибок: `logs/YYYY-MM-DD/YYYY-MM-DD_scheduler.log`
- Логи отправки пушей: `logs/YYYY-MM-DD/YYYY-MM-DD_push.log`
- Созданные записи для отправки (уведомления): таблица `Notifications`

Важно: в текущей конфигурации все шедулеры переопределяют расписание одной и той же переменной окружения `TEST_SCHEDULE_COUNTERS_REMIDNER`. Если вам нужно разнести расписания, заведите отдельные переменные для каждого (см. ниже).

## Список шедулеров

### 1) Проверка истекающих контрактов аренды
- Расписание (по умолчанию): `0 12 * * *` (каждый день в 12:00)
- Переменная для переопределения: `TEST_SCHEDULE_COUNTERS_REMIDNER`
- Действия:
  - Получает список контрактов, истекающих через 5 дней.
  - Для каждого пользователя и его устройства создаёт запись в `Notifications` с ключом вида `expiredContracts_<contractId>_<deviceId>`.
- Ожидаемый результат:
  - В БД появляются новые уведомления на отправку.
  - В логе `..._scheduler.log` запись `[SCHEDULER] start`/`[SCHEDULER] error` с `jobName=expiredContracts`.

### 2) Напоминание о подаче счётчиков и выставлении счетов
- Расписание (по умолчанию): `* 11 * * *` (каждую минуту в 11-м часу дня)
- Переменная для переопределения: `TEST_SCHEDULE_COUNTERS_REMIDNER`
- Действия:
  - Получает контракты, по которым пора запрашивать показания счётчиков/выставлять счета.
  - Создаёт записи в `Notifications` с ключом вида `invoicingTrigger_<contractId>_<deviceId>` (только если у устройства есть `token`).
- Ожидаемый результат:
  - В БД появляются уведомления на отправку.
  - В логе `..._scheduler.log` запись `[SCHEDULER] start`/`[SCHEDULER] error` с `jobName=invoicingTrigger`.

### 3) Отправка пуш-уведомлений из очереди (таблица Notifications)
- Расписание (по умолчанию): `1 * * * *` (каждый час в 01-ю минуту)
- Переменная для переопределения: `TEST_SCHEDULE_COUNTERS_REMIDNER`
- Действия:
  - Получает все неисполненные записи из `Notifications` (с фильтрацией по настройкам пользователя).
  - Отправляет уведомления через Firebase по `token` устройства.
  - При успехе помечает запись как `isExecuted=true`.
  - При ошибке помечает запись как `isExecuted=true` и `isError=true`.
- Ожидаемый результат:
  - В логе `..._push.log` строки вида `[PUSH] send.success` / `[PUSH] send.error` с `notificationId` и `deviceId`.
  - В логе `..._scheduler.log` строки `[SCHEDULER] start`/`[SCHEDULER] error` с `jobName=push_notifications_sender`.
  - Записи в БД получают флаги исполнения.

### 4) Закрытие просроченных контрактов аренды
- Расписание (по умолчанию): `16 0 * * *` (каждый день в 00:16)
- Переменная для переопределения: `TEST_SCHEDULE_COUNTERS_REMIDNER`
- Действия:
  - Выполняет сервисную процедуру актуализации активных контрактов (деактивация просроченных).
- Ожидаемый результат:
  - Контракты с истёкшим сроком становятся неактивными (по логике сервиса).
  - В логе `..._scheduler.log` строки `[SCHEDULER] start`/`[SCHEDULER] error` с `jobName=deactivate_expired_contracts`.

## Как изменить расписание

Сейчас все четыре задачи читают одну переменную `TEST_SCHEDULE_COUNTERS_REMIDNER`. Вы можете задать её в `.env` для быстрой проверки:

```
TEST_SCHEDULE_COUNTERS_REMIDNER=* * * * *
```

- Ожидаемый результат: все задачи будут пытаться запускаться каждую минуту (только если их код не имеет дополнительных условий).

Рекомендовано разнести переменные по задачам (пример):

```
SCHEDULE_EXPIRED_CONTRACTS=0 12 * * *
SCHEDULE_INVOICING_TRIGGER=* 11 * * *
SCHEDULE_NOTIFICATION_SERVICE=1 * * * *
SCHEDULE_DEACTIVATE_CONTRACT=16 0 * * *
```

и использовать их в соответствующих шедулерах.

## Логи

- Старт/ошибки задач: `logs/YYYY-MM-DD/YYYY-MM-DD_scheduler.log`
- Отправка пушей: `logs/YYYY-MM-DD/YYYY-MM-DD_push.log`
- Формат строк: `YYYY-MM-DD HH:mm:ss [level] [PREFIX] message key=value ...`

Примеры ожидаемых записей:

```
2025-09-12 12:00:00 [info] [SCHEDULER] start jobName="expiredContracts" cron="0 12 * * *"
2025-09-12 12:00:01 [info] [PUSH] send.success deviceId="abcd1234" notificationId="42" messageId="..."
```


