import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ramesh Patil',
    city: 'Pune',
    content:
      'PG Ease completely transformed how I run my PG. Rent collection used to take days of follow-up. Now it takes a few taps on my phone.',
    rating: 5,
  },
  {
    name: 'Ankit Sharma',
    city: 'Noida',
    content:
      'I manage 3 PGs with 120+ beds. Before PG Ease, it was Excel chaos. Now everything is in one place — tenants, rent, rooms. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Suresh Kulkarni',
    city: 'Bangalore',
    content:
      'The onboarding was incredibly fast. I added all my rooms and tenants in under an hour. The dashboard alone is worth the price.',
    rating: 5,
  },
  {
    name: 'Meera Joshi',
    city: 'Hyderabad',
    content:
      'My tenants love the digital payment tracking. No more arguments about who paid and who didn\'t. PG Ease brings transparency to everything.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Social Proof
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-balance">
            Trusted by PG Owners Across India
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hear from PG owners who switched to PG Ease and never looked back.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl p-7 shadow-soft border border-slate-100 hover:shadow-card transition-shadow"
            >
              <Quote className="h-8 w-8 text-brand-200 mb-4" />

              <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-brand-500 text-brand-500" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-700">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">PG Owner, {t.city}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
