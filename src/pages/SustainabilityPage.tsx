import { Leaf, Recycle, Heart, Globe } from 'lucide-react';

const SustainabilityPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
          Sustainable Fashion for a Better Future
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          We're committed to making fashion that looks good and does good. 
          Discover our journey towards sustainability and how we're making a difference.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Recycle className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">85%</div>
          <p className="text-neutral-600">Recycled Materials Used</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
          <p className="text-neutral-600">Organic Cotton</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">50k+</div>
          <p className="text-neutral-600">Happy Customers</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-primary-600" />
          </div>
          <div className="text-3xl font-bold text-primary-600 mb-2">-30%</div>
          <p className="text-neutral-600">Carbon Footprint Reduction</p>
        </div>
      </div>

      {/* Initiatives Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-4">Our Sustainability Initiatives</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Sustainable Materials</h3>
                <p className="text-neutral-600">
                  We use organic, recycled, and innovative sustainable materials in all our products.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Recycle className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Zero Waste Production</h3>
                <p className="text-neutral-600">
                  Our manufacturing process is designed to minimize waste and maximize resource efficiency.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium mb-2">Fair Labor Practices</h3>
                <p className="text-neutral-600">
                  We ensure fair wages and safe working conditions throughout our supply chain.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <img
            src="https://images.pexels.com/photos/5699514/pexels-photo-5699514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Sustainable Fashion Production"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Certification Section */}
      <div className="bg-neutral-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-serif font-bold mb-6 text-center">Our Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg text-center">
            <img
              src="https://images.pexels.com/photos/5699496/pexels-photo-5699496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="GOTS Certified"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h3 className="font-medium mb-2">GOTS Certified</h3>
            <p className="text-sm text-neutral-600">
              Global Organic Textile Standard certification for organic materials
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg text-center">
            <img
              src="https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Fair Trade Certified"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h3 className="font-medium mb-2">Fair Trade Certified</h3>
            <p className="text-sm text-neutral-600">
              Ensuring fair wages and good working conditions
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg text-center">
            <img
              src="https://images.pexels.com/photos/5699467/pexels-photo-5699467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Carbon Neutral"
              className="w-16 h-16 object-contain mx-auto mb-4"
            />
            <h3 className="font-medium mb-2">Carbon Neutral</h3>
            <p className="text-sm text-neutral-600">
              Committed to reducing and offsetting our carbon emissions
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Join Our Sustainable Journey</h2>
        <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
          Every purchase you make is a vote for sustainable fashion. Together, we can make a difference.
        </p>
        <button className="bg-primary-600 text-white px-8 py-3 rounded-md hover:bg-primary-700 transition-colors">
          Shop Sustainable Collection
        </button>
      </div>
    </div>
  );
};

export default SustainabilityPage;