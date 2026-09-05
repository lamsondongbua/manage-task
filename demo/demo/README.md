HỆ THỐNG QUẢN LÝ CÔNG VIỆC

Define: Người dùng tạo các dự án. Mỗi dự án chứa nhiều công việc. Mỗi công việc được giao cho một người dùng, có trạng thái và độ ưu tiên. Công việc có thể gắn nhiều nhãn

Entity: User, Project, Task, Label
Relational: 
    - User tạo Project (User 1 - n Project)
    - Project chứa Task (Project 1 - n Task)
    - Task giao cho User (Task n - 1 User)
    - Task gắn Label (Task n - n Label)



Sơ đồ quan hệ (ERD)

┌─────────┐        ┌──────────┐        ┌────────┐
│  users  │ 1    n │ projects │ 1    n │ tasks  │
│─────────│───────<│──────────│───────<│────────│
│ id      │  owns  │ id       │ has    │ id     │
│ username│        │ name     │        │ title  │
│ email   │        │ owner_id │        │ status │
└─────────┘        └──────────┘        │ ...    │
^                                 └───┬────┘
│ 1                                   │ n
│ giao cho (assignee)                 │ n-n
└─────────────────────────────────>   │
┌───────┴──────┐
task_labels    labels
(task_id,      (id, name)
label_id)



Tài khoản test: admin@example.com / Admin@123 