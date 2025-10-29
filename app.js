// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const taskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskPriority = document.getElementById('taskPriority');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterAll = document.getElementById('filterAll');
    const filterActive = document.getElementById('filterActive');
    const filterCompleted = document.getElementById('filterCompleted');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 任务数据存储
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // 初始化应用
    initApp();

    // 初始化函数
    function initApp() {
        renderTasks();
        updateUIState();
        setupEventListeners();
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 添加任务表单提交
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addTask();
        });

        // 清除已完成任务按钮点击
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);

        // 过滤按钮点击事件
        filterAll.addEventListener('click', () => setFilter('all'));
        filterActive.addEventListener('click', () => setFilter('active'));
        filterCompleted.addEventListener('click', () => setFilter('completed'));
    }

    // 添加新任务
    function addTask() {
        const text = taskInput.value.trim();
        const priority = taskPriority.value;

        if (text !== '') {
            const newTask = {
                id: Date.now(),
                text,
                completed: false,
                priority,
                createdAt: new Date().toISOString()
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateUIState();

            // 清空输入框
            taskInput.value = '';
            taskInput.focus();

            // 添加成功动画
            showNotification('任务已添加', 'success');
        }
    }

    // 切换任务完成状态
    function toggleTaskCompleted(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
            updateUIState();
        }
    }

    // 删除任务
    function deleteTask(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            // 获取要删除的任务元素并添加动画
            const taskElement = document.querySelector(`[data-task-id="${id}"]`);
            if (taskElement) {
                taskElement.classList.add('opacity-0', 'translate-x-full');
                setTimeout(() => {
                    tasks.splice(taskIndex, 1);
                    saveTasks();
                    renderTasks();
                    updateUIState();
                    showNotification('任务已删除', 'info');
                }, 300);
            } else {
                tasks.splice(taskIndex, 1);
                saveTasks();
                renderTasks();
                updateUIState();
                showNotification('任务已删除', 'info');
            }
        }
    }

    // 编辑任务
    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task && !task.completed) {
            const newText = prompt('编辑任务:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                saveTasks();
                renderTasks();
                showNotification('任务已更新', 'success');
            }
        }
    }

    // 清除已完成任务
    function clearCompletedTasks() {
        const completedCount = tasks.filter(task => task.completed).length;
        if (completedCount > 0 && confirm(`确定要清除所有 ${completedCount} 个已完成任务吗？`)) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
            updateUIState();
            showNotification('已完成任务已清除', 'success');
        }
    }

    // 设置任务过滤条件
    function setFilter(filter) {
        currentFilter = filter;
        renderTasks();
        updateFilterButtons();
    }

    // 更新过滤按钮状态
    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white', 'active');
            btn.classList.add('bg-gray-100', 'hover:bg-gray-200');
        });

        const activeBtn = document.getElementById(`filter${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'hover:bg-gray-200');
            activeBtn.classList.add('bg-primary', 'text-white', 'active');
        }
    }

    // 保存任务到本地存储
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 渲染任务列表
    function renderTasks() {
        // 根据当前过滤条件过滤任务
        let filteredTasks = [];
        
        switch (currentFilter) {
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }

        // 清空任务列表
        taskList.innerHTML = '';

        // 检查是否显示空状态
        if (tasks.length === 0) {
            taskList.appendChild(emptyState);
            return;
        }

        // 如果过滤后没有任务，显示提示
        if (filteredTasks.length === 0) {
            const emptyFilterState = document.createElement('div');
            emptyFilterState.className = 'text-center py-16';
            emptyFilterState.innerHTML = `
                <div class="mb-4 text-6xl text-gray-300">
                    <i class="fa fa-search"></i>
                </div>
                <h3 class="text-xl font-medium text-gray-500 mb-2">暂无任务</h3>
                <p class="text-gray-400">没有符合当前筛选条件的任务</p>
            `;
            taskList.appendChild(emptyFilterState);
            return;
        }

        // 渲染每个任务
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
            
            // 添加进入动画
            setTimeout(() => {
                taskElement.classList.remove('opacity-0', 'translate-y-2');
            }, 10);
        });
    }

    // 创建单个任务元素
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = 'flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md task-transition opacity-0 translate-y-2';
        taskElement.dataset.taskId = task.id;

        // 根据优先级设置边框颜色
        const priorityColors = {
            'high': 'border-danger/30 bg-danger/5',
            'medium': 'border-warning/30 bg-warning/5',
            'low': 'border-secondary/30 bg-secondary/5'
        };
        
        // 添加优先级样式
        if (priorityColors[task.priority]) {
            taskElement.classList.add(...priorityColors[task.priority].split(' '));
        }

        // 任务内容
        taskElement.innerHTML = `
            <div class="flex items-center flex-grow gap-3">
                <button 
                    class="task-checkbox w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border-2 ${task.completed ? 'border-primary bg-primary' : 'border-gray-300 hover:border-primary'}"
                    data-task-id="${task.id}"
                >
                    ${task.completed ? '<i class="fa fa-check text-white text-xs"></i>' : ''}
                </button>
                <div class="flex-grow min-w-0">
                    <p class="text-sm sm:text-base font-medium truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}">
                        ${escapeHTML(task.text)}
                    </p>
                    <div class="flex items-center mt-1 text-xs text-gray-500">
                        <span class="mr-3">
                            <i class="fa fa-clock-o mr-1"></i>
                            ${formatDate(task.createdAt)}
                        </span>
                        <span class="px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}">
                            ${getPriorityText(task.priority)}
                        </span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                    class="edit-task p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
                    data-task-id="${task.id}"
                >
                    <i class="fa fa-pencil"></i>
                </button>
                <button 
                    class="delete-task p-2 text-gray-500 hover:text-danger rounded-lg hover:bg-danger/10 transition-colors duration-200"
                    data-task-id="${task.id}"
                >
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;

        // 添加鼠标悬停效果
        taskElement.classList.add('group');
        const actionButtons = taskElement.querySelector('.gap-1');
        taskElement.addEventListener('mouseenter', () => {
            actionButtons.classList.remove('opacity-0');
            actionButtons.classList.add('opacity-100');
        });
        taskElement.addEventListener('mouseleave', () => {
            actionButtons.classList.remove('opacity-100');
            actionButtons.classList.add('opacity-0');
        });

        // 添加任务操作按钮的事件监听器
        const checkbox = taskElement.querySelector('.task-checkbox');
        const editBtn = taskElement.querySelector('.edit-task');
        const deleteBtn = taskElement.querySelector('.delete-task');

        checkbox.addEventListener('click', () => toggleTaskCompleted(task.id));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        return taskElement;
    }

    // 更新UI状态
    function updateUIState() {
        // 检查是否有已完成任务，更新清除按钮状态
        const hasCompletedTasks = tasks.some(task => task.completed);
        clearCompletedBtn.disabled = !hasCompletedTasks;
        clearCompletedBtn.classList.toggle('opacity-50', !hasCompletedTasks);
        clearCompletedBtn.classList.toggle('cursor-not-allowed', !hasCompletedTasks);
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        // 检查是否已有通知，如果有则移除
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full opacity-0 transition-all duration-300 z-50 flex items-center gap-2 ${getNotificationClass(type)}`;
        notification.innerHTML = `
            <i class="fa ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 触发动画显示通知
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 10);

        // 3秒后隐藏通知
        setTimeout(() => {
            notification.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes}分钟前`;
        } else if (diffInHours < 24) {
            return `${diffInHours}小时前`;
        } else if (diffInHours < 48) {
            return '昨天';
        } else {
            return date.toLocaleDateString('zh-CN');
        }
    }

    // 获取优先级对应的文本
    function getPriorityText(priority) {
        const priorityTexts = {
            'high': '高优先级',
            'medium': '中优先级',
            'low': '低优先级'
        };
        return priorityTexts[priority] || '普通';
    }

    // 获取优先级对应的样式类
    function getPriorityClass(priority) {
        const priorityClasses = {
            'high': 'bg-danger/20 text-danger',
            'medium': 'bg-warning/20 text-warning',
            'low': 'bg-secondary/20 text-secondary'
        };
        return priorityClasses[priority] || 'bg-gray-200 text-gray-700';
    }

    // 获取通知对应的样式类
    function getNotificationClass(type) {
        const classes = {
            'success': 'bg-secondary text-white',
            'error': 'bg-danger text-white',
            'warning': 'bg-warning text-white',
            'info': 'bg-primary text-white'
        };
        return classes[type] || 'bg-primary text-white';
    }

    // 获取通知对应的图标
    function getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    // HTML转义函数，防止XSS攻击
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 添加键盘快捷键支持
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter 添加任务
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            addTask();
        }
        // Esc 清空输入框
        else if (e.key === 'Escape') {
            taskInput.value = '';
        }
    });

    // 添加初始动画效果
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    
    header.classList.add('opacity-0', 'translate-y-[-20px]');
    main.classList.add('opacity-0', 'translate-y-[20px]');
    footer.classList.add('opacity-0');
    
    setTimeout(() => {
        header.classList.remove('opacity-0', 'translate-y-[-20px]');
        header.classList.add('transition-all', 'duration-500');
        
        setTimeout(() => {
            main.classList.remove('opacity-0', 'translate-y-[20px]');
            main.classList.add('transition-all', 'duration-500');
            
            setTimeout(() => {
                footer.classList.remove('opacity-0');
                footer.classList.add('transition-all', 'duration-500');
            }, 200);
        }, 200);
    }, 100);
});