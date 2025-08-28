import Footer from "./Footer"
import Header from "./Header"
import RegisterLeadForm from "./RegisterLeadForm"

function SubmitLeadForm() {
  return (
    <>
        <Header />
        <section id="leadRegisterForm" className="py-10 bg-gray-100">
            <div className="container mx-auto">
              <h1 className="text-3xl font-medium text-center mb-7">กรอกข้อมูลเพื่อรับสิทธิ์</h1>
              <p className="text-red-500 text-center mb-10">ข้อมูลการขอรับสิทธิ์จะสมบูรณ์ก็ต่อเมื่อแนบกับใบจอง<br/>กรุณาดำเนินการที่สำนักงานขายเท่านั้น</p>
              <RegisterLeadForm />
            </div>
        </section>
        <Footer />
    </>
  )
}

export default SubmitLeadForm