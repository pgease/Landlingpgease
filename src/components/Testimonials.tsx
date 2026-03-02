import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ramesh Patil',
    role: 'PG Owner, Pune',
    content: 'PG Ease made rent collection and complaints effortless. Tenants love it. Best PG management system I have used.',
    rating: 5,
  },
  {
    name: 'Ankit Sharma',
    role: 'PG Owner, Noida',
    content: 'Earlier everything was manual. Now my entire PG runs on PG Ease. Automated rent and complaint tracking saved hours every month.',
    rating: 5,
  },
  {
    name: 'Suresh Kulkarni',
    role: 'PG Owner, Bangalore',
    content: "Most trusted PG management app I've seen. Highly recommended for any PG or co-living owner in India.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Most Trusted PG Management App
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real feedback from PG owners and co-living operators across India
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-teal-200 mb-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-teal-500 text-teal-500" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
              <div className="border-t border-slate-100 pt-4">
                <p className="font-semibold text-slate-900">{t.name}</p>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
