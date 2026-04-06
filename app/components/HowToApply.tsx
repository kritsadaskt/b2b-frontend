import { asset } from '../utils/assets';

export default function HowToApply() {
  return (
    <section id="howToApply" className="lg:py-16 py-8 px-2 lg:px-0">
      <div className="max-w-4xl 2xl:max-w-2xl mx-auto">
          <img src={asset('images/asw-partners-steps-header.webp')} alt="How to Apply" className="w-full` mx-auto mt-5 w-10/12" />
          <img src={asset('images/asw-partners-step1.webp')} alt="How to Apply" className="w-full mx-auto" />
          <img src={asset('images/asw-partners-step2.webp')} alt="How to Apply" className="w-full mx-auto" />
      </div>
    </section>
  );
}