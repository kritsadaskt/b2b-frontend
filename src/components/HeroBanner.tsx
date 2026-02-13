import { asset } from '../utils/assets';

function HeroBanner() {
  return (
    <section id="heroBanners">
      <img src={asset('images/ASW-Partners_banner_d.webp')} alt="" className="hidden md:block"/>
      <img src={asset('images/ASW-Partners_banner_m.webp')} alt="" className="block md:hidden"/>
    </section>
  );
}

export default HeroBanner;