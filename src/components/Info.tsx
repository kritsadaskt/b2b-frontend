function Info() {
  return (
    <section id="info" className="py-16 min-h-[500px]">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-7 items-center">
          <div className="w-full md:w-1/2">
            <img src="images/b2b-info-headline.webp" alt="Info" className="w-11/12 md:w-full mx-auto" />
          </div>
          <div className="w-full md:w-1/2 h-full">
            <div className="info-detail-box bg-white p-8 shadow-lg w-full md:w-4/5 mx-auto">
              <h3 className="text-2xl lg:text-3xl font-medium text-navyblue">โดยได้รับสิทธิร่วมโปรโมชั่นปกติ<br/>
              ของแต่ละโครงการตามช่วงเวลา</h3>
              <p className="text-base lg:text-lg font-light mt-4">AssetWise คัดสรรโครงการคุณภาพ - ทั้งโครงการ Presale และโครงการพร้อมอยู่ บนทำเลศักยภาพ สะดวกต่อการเดินทาง ใกล้รถไฟฟ้า ใกล้ที่ทำงาน ส่งเสริมการเข้าถึงที่อยู่อาศัยในราคาพิเศษ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Info