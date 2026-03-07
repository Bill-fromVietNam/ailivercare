import React, { useState, useEffect } from 'react'

// Project type definition
interface Project {
  id: number
  name: string
  description: string
  status: 'active' | 'completed' | 'on_hold'
  created_at: string
  last_updated: string
  progress: number
  members: number
}

// Mock data for demonstration since we don't have a real API endpoint yet
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Đánh giá sức khỏe gan',
    description: 'Chương trình đánh giá sức khỏe gan toàn diện dựa trên chỉ số xét nghiệm và câu hỏi lâm sàng',
    status: 'active',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 75,
    members: 5
  },
  {
    id: 2,
    name: 'Phân tích dữ liệu xét nghiệm',
    description: 'Phân tích dữ liệu xét nghiệm để phát hiện nguy cơ tiềm ẩn về bệnh gan',
    status: 'active',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 50,
    members: 3
  },
  {
    id: 3,
    name: 'Nghiên cứu chế độ dinh dưỡng',
    description: 'Nghiên cứu về chế độ dinh dưỡng tốt cho sức khỏe gan dựa trên kết quả xét nghiệm',
    status: 'on_hold',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    last_updated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 25,
    members: 2
  },
  {
    id: 4,
    name: 'Tối ưu hóa khuyến nghị sức khỏe',
    description: 'Cải thiện thuật toán đề xuất khuyến nghị sức khỏe dựa trên mức nguy cơ của người dùng',
    status: 'completed',
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    last_updated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
    members: 4
  }
]

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'on_hold' | 'completed'>('all')
  
  // Fetch projects (simulated)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setProjects(MOCK_PROJECTS)
        setError(null)
      } catch (err) {
        setError('Không thể tải danh sách dự án. Vui lòng thử lại sau.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [])
  
  // Format date to local
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Get status text
  const getStatusText = (status: string): string => {
    switch(status) {
      case 'active': return 'Đang hoạt động'
      case 'completed': return 'Hoàn thành' 
      case 'on_hold': return 'Tạm ngừng'
      default: return status
    }
  }
  
  // Get CSS class for status badge
  const getStatusClass = (status: string): string => {
    switch(status) {
      case 'active': return 'primary'
      case 'completed': return 'success'
      case 'on_hold': return 'warning'
      default: return ''
    }
  }
  
  // Filter projects based on status
  const filteredProjects = filter === 'all' ? 
    projects : 
    projects.filter(project => project.status === filter)

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dự án sức khỏe gan</h2>
          <p className="card-subtitle">Quản lý các dự án nghiên cứu và phát triển liên quan đến sức khỏe gan</p>
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
                className={`btn ${filter === 'active' ? 'primary' : ''}`}
                onClick={() => setFilter('active')}
              >
                Đang hoạt động
              </button>
              <button 
                className={`btn ${filter === 'on_hold' ? 'warning' : ''}`}
                onClick={() => setFilter('on_hold')}
              >
                Tạm ngừng
              </button>
              <button 
                className={`btn ${filter === 'completed' ? 'success' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Hoàn thành
              </button>
            </div>
          </div>
          
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
          
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Không có dự án nào {filter !== 'all' && `trong trạng thái đã chọn`}</p>
            </div>
          )}
          
          {!loading && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="card">
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      <span className={`badge ${getStatusClass(project.status)}`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {project.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tiến độ</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-primary" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Ngày tạo:</span> {formatDate(project.created_at)}
                      </div>
                      <div>
                        <span className="font-medium">Thành viên:</span> {project.members}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <span className="text-xs text-gray-500">Cập nhật: {formatDate(project.last_updated)}</span>
                      <button className="btn-sm primary">Xem chi tiết</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects 