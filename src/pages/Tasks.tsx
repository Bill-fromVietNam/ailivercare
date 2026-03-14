import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'

// Task type definition
interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  created_at: string
}

// Mock data for demonstration since we don't have a real API endpoint yet
const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Xét nghiệm AST/ALT',
    description: 'Đến phòng khám để thực hiện xét nghiệm máu',
    status: 'pending',
    priority: 'high',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Hoàn thành bảng câu hỏi sức khỏe',
    description: 'Điền thông tin vào bảng câu hỏi về lối sống và tiền sử',
    status: 'completed',
    priority: 'medium',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: 'Đặt lịch tái khám',
    description: 'Liên hệ với bác sĩ để đặt lịch khám theo dõi',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    title: 'Tham khảo chế độ ăn uống',
    description: 'Tìm hiểu về chế độ ăn tốt cho sức khỏe gan',
    status: 'pending',
    priority: 'low',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Form validation schema
const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .required('Tiêu đề là bắt buộc')
    .min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  description: Yup.string(),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Mức độ ưu tiên không hợp lệ')
    .required('Mức độ ưu tiên là bắt buộc'),
  due_date: Yup.date().nullable()
})

// Form values interface
interface TaskFormValues {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

// Initial form values type
type TaskInitialValues = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  due_date: string
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formVisible, setFormVisible] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')

  // Fetch tasks (simulated)
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setTasks(MOCK_TASKS)
        setError(null)
      } catch (err) {
        setError('Không thể tải danh sách công việc. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTasks()
  }, [])

  // Handle form submission
  const handleSubmit = async (values: TaskFormValues, { resetForm }: FormikHelpers<TaskFormValues>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create a new task with default values + form values
      const newTask: Task = {
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        title: values.title,
        description: values.description,
        priority: values.priority,
        status: 'pending',
        due_date: values.due_date || undefined,
        created_at: new Date().toISOString()
      }
      
      // Add new task to the list
      setTasks(prevTasks => [newTask, ...prevTasks])
      
      // Reset form and hide it
      resetForm()
      setFormVisible(false)
    } catch (err) {
      setError('Không thể tạo công việc mới. Vui lòng thử lại sau.')
    }
  }

  // Update task status
  const updateTaskStatus = (taskId: number, newStatus: 'pending' | 'in_progress' | 'completed') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  // Filter tasks based on status
  const filteredTasks = filter === 'all' ? 
    tasks : 
    tasks.filter(task => task.status === filter)

  // Initial form values
  const initialValues: TaskInitialValues = {
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quản lý công việc</h2>
          <p className="card-subtitle">Theo dõi các công việc liên quan đến sức khỏe gan</p>
        </div>

        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button 
                className={`btn ${filter === 'all' ? 'primary' : ''}`}
                onClick={() => setFilter('all')}
              >
                Tất cả
              </button>
              <button 
                className={`btn ${filter === 'pending' ? 'warning' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Chưa thực hiện
              </button>
              <button 
                className={`btn ${filter === 'in_progress' ? 'info' : ''}`}
                onClick={() => setFilter('in_progress')}
              >
                Đang thực hiện
              </button>
              <button 
                className={`btn ${filter === 'completed' ? 'success' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Hoàn thành
              </button>
            </div>
            
            <button 
              className="btn primary"
              onClick={() => setFormVisible(!formVisible)}
            >
              {formVisible ? 'Hủy' : '+ Thêm công việc'}
            </button>
          </div>

          {formVisible && (
            <div className="card mb-6">
              <div className="card-body">
                <h3 className="text-lg font-medium mb-4">Thêm công việc mới</h3>
                
                <Formik<TaskFormValues>
                  initialValues={initialValues}
                  validationSchema={TaskSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="title" className="label">Tiêu đề</label>
                        <Field
                          id="title"
                          name="title"
                          type="text"
                          className="input"
                          placeholder="Nhập tiêu đề công việc"
                        />
                        <ErrorMessage name="title" component="div" className="text-xs text-red-600 mt-1" />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="label">Mô tả</label>
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          className="input"
                          placeholder="Mô tả chi tiết công việc"
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="priority" className="label">Mức độ ưu tiên</label>
                          <Field as="select" id="priority" name="priority" className="input">
                            <option value="low">Thấp</option>
                            <option value="medium">Trung bình</option>
                            <option value="high">Cao</option>
                          </Field>
                        </div>
                        
                        <div>
                          <label htmlFor="due_date" className="label">Hạn chót</label>
                          <Field
                            id="due_date"
                            name="due_date"
                            type="date"
                            className="input"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="btn"
                          onClick={() => setFormVisible(false)}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="btn primary ml-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Không có công việc nào {filter !== 'all' && `trong trạng thái đã chọn`}</p>
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <ul className="list">
              {filteredTasks.map((task) => (
                <li key={task.id} className="list-item">
                  <div className="list-content">
                    <div className="list-left">
                      <div className={`list-avatar ${
                        task.priority === 'high' ? 'red' : 
                        task.priority === 'medium' ? 'yellow' : 'blue'
                      }`}>
                        {task.priority === 'high' ? 'H' : 
                         task.priority === 'medium' ? 'M' : 'L'}
                      </div>
                      <div className="list-info">
                        <h4>{task.title}</h4>
                        <p className="text-sm text-gray-600">{task.description}</p>
                        {task.due_date && (
                          <p className="text-xs mt-1">
                            <span className="font-medium">Hạn chót:</span> {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="list-right">
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`badge ${
                          task.status === 'completed' ? 'success' :
                          task.status === 'in_progress' ? 'primary' : 'warning'
                        }`}>
                          {task.status === 'completed' ? 'Hoàn thành' :
                           task.status === 'in_progress' ? 'Đang thực hiện' : 'Chưa thực hiện'}
                        </span>
                        
                        <div className="flex gap-2">
                          {task.status !== 'pending' && (
                            <button 
                              className="btn-sm"
                              onClick={() => updateTaskStatus(task.id, 'pending')}
                            >
                              Đặt thành chưa làm
                            </button>
                          )}
                          
                          {task.status !== 'in_progress' && (
                            <button 
                              className="btn-sm primary"
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                            >
                              Đang làm
                            </button>
                          )}
                          
                          {task.status !== 'completed' && (
                            <button 
                              className="btn-sm success"
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks 