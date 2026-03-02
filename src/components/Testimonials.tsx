import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Ramesh Patil',
    role: 'PG Owner, Pune',
    content: 'PG Ease made rent collection and complaints effortless. Tenants love it.',
    rating: 5,
  },
  {
    name: 'Ankit Sharma',
    role: 'PG Owner, Wakad',
    content: 'Earlier everything was manual. Now my entire PG runs on PG Ease.',
    rating: 5,
  },
  {
    name: 'Suresh Kulkarni',
    role: 'PG Owner, Baner',
    content: 'Best PG management app I\'ve seen. Highly recommended for Pune PGs.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            PG Owners Love PG Ease
          </h2>
          <p className="text-lg text-gray-600">
            Real feedback from PG owners across India
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#008080] text-[#008080]" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
