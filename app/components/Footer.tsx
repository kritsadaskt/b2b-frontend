const footerMenus = {
    "menu1": [
      {
        "id": 1,
        "name": "คอนโดมิเนียม",
        "link": "https://assetwise.co.th/th/condominium"
      },
      {
        "id": 2,
        "name": "บ้านและทาวน์โฮม",
        "link": "https://assetwise.co.th/th/house"
      },
      {
        "id": 3,
        "name": "โปรโมชั่น",
        "link": "https://assetwise.co.th/th/house"
      },
      {
        "id": 4,
        "name": "รู้จักแอสเซทไวส์",
        "link": "https://assetwise.co.th/th/about-us"
      },
      {
        "id": 5,
        "name": "นักลงทุนสัมพันธ์",
        "link": "https://investor.assetwise.co.th/th/home"
      },
      {
        "id": 6,
        "name": "แอสเซทไวส์คลับ",
        "link": "https://assetwise.co.th/th/club"
      },
      {
        "id": 7,
        "name": "ข่าวสาร",
        "link": "https://assetwise.co.th/th/news"
      },
      {
        "id": 8,
        "name": "บล็อก",
        "link": "https://assetwise.co.th/th/blog"
      }
    ],
    "menu2": [
      {
        "id": 1,
        "name": "Bank Matching",
        "link": "https://aswinno.assetwise.co.th/bankmatching"
      }
    ],
    "menu3": [
      {
        "id": 1,
        "name": "เสนอขายที่ดิน",
        "link": "https://aswland.assetwise.co.th/"
      },
      {
        "id": 2,
        "name": "ฝากขาย-ฝากเช่า",
        "link": "https://www.assetaplus.com/"
      },
      {
        "id": 3,
        "name": "ร่วมงานกับเรา",
        "link": "https://careers.assetwise.co.th/"
      },
      {
        "id": 4,
        "name": "สมัครและขึ้นทะเบียนคู่ค้า",
        "link": "https://aswinno.assetwise.co.th/VendorPortal/Vendor/Verify"
      }
    ],
    "menu4": [
      {
        "id": 1,
        "name": "ติดต่อเรา",
        "link": "https://assetwise.co.th/th/contact"
      },
      {
        "id": 2,
        "name": "ร้องเรียนธรรมาภิบาล",
        "link": "https://assetwise.co.th/th/appeal-form"
      },
      {
        "id": 3,
        "name": "ติดต่อผู้คุ้มครองข้อมูลส่วนบุคคล",
        "link": "https://services.assetwise.co.th/DSRM/DSRForm"
      },
      {
        "id": 4,
        "name": "นโยบายข้อมูลส่วนบุคคล",
        "link": "https://assetwise.co.th/privacy-policy/"
      }
    ],
}

function Footer() {
    return (
      <footer className="bg-[#031121] pt-9 pb-4">
        <div className="container px-4 md:px-0 mx-auto">
          <div className="w-full flex flex-col md:flex-row">
            <div className="w-full md:w-4/12 flex flex-col gap-3 mb-5 md:mb-0">
              <img src='https://assetwise.co.th/wp-content/themes/seed-spring/img/th/logo-asw.png' alt="" width={160} height={35} className="object-contain" />
              <h4 className="text-white text-[24px] lg:text-[26px]">ติดตามแอสเซทไวส์</h4>
              <div className="social-listed flex w-2/3 gap-3">
                <a href="https://th-th.facebook.com/AssetWiseThailand/" title="Facebook">
                  <img src="/images/fb-o.png" alt="Facbook" className="object-contain w-14 h-14" />
                </a>
                <a href="https://page.line.me/assetwise" title="Line">
                  <img src="/images/line-o.png" alt="Line" className="object-contain w-14 h-14" />
                </a>
                <a href="https://www.instagram.com/assetwisethailand" title="Instagram">
                  <img src="/images/ig-o.png" alt="Instagram" className="object-contain w-14 h-14" />
                </a>
                <a href="https://www.youtube.com/c/AssetwiseChannel" title="Youtube">
                  <img src="/images/yt-o.png" alt="Youtube" className="object-contain w-14 h-14" />
                </a>
                <a href="https://www.tiktok.com/@assetwise" title="Tiktok">
                  <img src="/images/tt-o.png" alt="Tiktok" className="object-contain w-14 h-14" />
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-0 md:flex-row justify-between">
              <div className="menu">
                <h4 className="text-white text-[20px] mb-2">แอสเซทไวส์</h4>
                <ul className="flex flex-col gap-1">
                  {footerMenus.menu1.map((menu, key) => (
                    <li key={key}>
                      <a href={menu.link} className="text-neutral-400 font-light text-[14px] hover:text-white transition">{menu.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="menu">
                <h4 className="text-white text-[20px] mb-2">บริการ</h4>
                <ul className="flex flex-col gap-1">
                  {footerMenus.menu2.map((menu, key) => (
                    <li key={key}>
                      <a href={menu.link} className="text-neutral-400 font-light text-[14px] hover:text-white transition">{menu.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="menu">
                <h4 className="text-white text-[20px] mb-2">สนใจทำธุรกิจกับเรา</h4>
                <ul className="flex flex-col gap-1">
                  {footerMenus.menu3.map((menu, key) => (
                    <li key={key}>
                      <a href={menu.link} className="text-neutral-400 font-light text-[14px] hover:text-white transition">{menu.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="menu">
                <h4 className="text-white text-[20px] mb-2">ติดต่อ</h4>
                <ul className="flex flex-col gap-1">
                  {footerMenus.menu4.map((menu, key) => (
                    <li key={key}>
                      <a href={menu.link} className="text-neutral-400 font-light text-[14px] hover:text-white transition">{menu.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <p className="text-neutral-400 text-sm text-center pt-4 mt-4 border-t border-t-neutral-400">© สงวนลิขสิทธิ์ พ.ศ. 2568 บริษัท แอสเซทไวส์ จำกัด (มหาชน)</p>
        </div>
      </footer>
    );
}

export default Footer;