-- Truy vấn tasks của một project
CREATE INDEX idx_tasks_project ON tasks(project_id);

-- tasks giao cho một user
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);

-- tasks theo trạng thái (hiển thị theo dạng cột Kanban)
CREATE INDEX idx_tasks_status ON tasks(status);

-- projects của một owner
CREATE INDEX idx_projects_owner ON projects(owner_id);

-- task_labels:
-- PK (task_id, label_id) đã hỗ trợ truy vấn theo task → label.
-- Tạo thêm index label_id để hỗ trợ truy vấn ngược label → task.
CREATE INDEX idx_task_labels_label ON task_labels(label_id);

-- tạo index để truy vấn kết hợp "task của project x, status Y"
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);