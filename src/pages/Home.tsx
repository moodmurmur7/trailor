import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Award, Clock, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function Home() {
  const featuredFabrics = [
    {
      id: 1,
      name: 'Premium Silk',
      image: 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg',
      price: '₹2,500/meter'
    },
    {
      id: 2,
      name: 'Italian Wool',
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
      price: '₹3,200/meter'
    },
    {
      id: 3,
      name: 'Egyptian Cotton',
      image: 'https://images.pexels.com/photos/6069102/pexels-photo-6069102.jpeg',
      price: '₹1,800/meter'
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      rating: 5,
      text: 'Exceptional quality and perfect fit. The craftsmanship is unmatched.',
      garment: 'Wedding Sherwani'
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      text: 'Beautiful saree blouse with intricate embroidery. Highly recommended!',
      garment: 'Saree Blouse'
    },
    {
      name: 'Amit Patel',
      rating: 5,
      text: 'Professional service and timely delivery. Will definitely order again.',
      garment: 'Business Suit'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#1A1D23] via-[#2A2D33] to-[#1A1D23]">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg)'
          }}
        ></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center text-white px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Crafted to <span className="text-[#C8A951]">Perfection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            Bespoke tailoring with 75 years of excellence
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-x-4"
          >
            <Link to="/customize">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Custom Order
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                View Collections
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Fabrics */}
      <section className="py-16 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1A1D23] mb-4">
              Premium Fabric Collection
            </h2>
            <p className="text-gray-600 text-lg">
              Carefully curated materials from around the world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredFabrics.map((fabric, index) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold">{fabric.name}</h3>
                      <p className="text-[#C8A951]">{fabric.price}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/fabrics">
              <Button variant="outline" size="lg">
                View All Fabrics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1A1D23] mb-4">
              Why Royal Tailors?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: '75 Years of Excellence',
                description: 'Three generations of master craftsmen delivering unparalleled quality.'
              },
              {
                icon: Sparkles,
                title: 'Premium Materials',
                description: 'Only the finest fabrics sourced from renowned mills worldwide.'
              },
              {
                icon: Clock,
                title: 'Timely Delivery',
                description: 'Precise scheduling and commitment to delivery dates you can rely on.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="text-center p-8">
                  <div className="bg-[#C8A951] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1A1D23] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-[#F8F5F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#1A1D23] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real reviews from satisfied customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#C8A951] fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-[#1A1D23]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.garment}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1A1D23]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready for Your Perfect Fit?
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Start your custom order today and experience the Royal Tailors difference
            </p>
            <Link to="/customize">
              <Button size="lg" className="text-lg px-8 py-4">
                Begin Custom Order
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}