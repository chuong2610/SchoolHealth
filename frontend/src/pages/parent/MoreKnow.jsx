import React from 'react'
import { Link } from 'react-router-dom'

const MoreKnow = () => {
  return (
    <div>
      {/*Banner Section */}
      <section className='banner position-relative py-5 bg-light'>
        <div className='container'>
          <h1 className='display-4 fw-bold mb-4'>Tìm hiểu thêm về chăm sóc sức khỏe học đường</h1>
          <p className='lead mb-4'>
            Chúng tôi cung cấp các dịch vụ y tế học đường chuyên nghiệp để đảm bảo sức khỏe cho học sinh.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className='py-5'>
        <div className='container'>
          <h2 className='mb-4'>Dịch vụ y tế học đường</h2>
          <p className='mb-4'>Trường học của chúng tôi có đội ngũ y tế chuyên nghiệp, cung cấp các dịch vụ như:</p>
          <ul className='list-group list-group-flush mb-4'>
            <li className='list-group-item'>Kiểm tra sức khỏe định kỳ cho học sinh.</li>
            <li className='list-group-item'>Hỗ trợ sơ cứu và xử lý tình huống khẩn cấp.</li>
            <li className='list-group-item'>Tư vấn dinh dưỡng và sức khỏe tinh thần.</li>
            <li className='list-group-item'>Hướng dẫn phòng ngừa bệnh truyền nhiễm.</li>
          </ul>
          <p>
            Liên hệ với chúng tôi qua email: <a href='mailto:health@school.com'>health@school.com</a> để biết thêm chi
            tiết.
          </p>
        </div>
        <Link style={{ }} to='/parent' className='btn btn-secondary mt-7'>
          Quay lại Trang chính
        </Link>
      </section>
    </div>
  )
}

export default MoreKnow
