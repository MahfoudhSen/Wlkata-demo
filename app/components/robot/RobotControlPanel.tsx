'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  model: string;
  description: string;
  price: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  bestFor: string[];
  features: string[];
  specs: {
    reach: string;
    payload: string;
    accuracy: string;
    axes: number;
  };
}

const products: Product[] = [
  {
    id: 'mirobot',
    name: 'WLKATA Mirobot',
    model: '6-Axis Educational Robot',
    description: 'Perfect entry-level robot for STEM education. Ideal for middle school through undergraduate courses.',
    price: 'Starting at $599',
    image: '',
    level: 'beginner',
    bestFor: ['K-12 Education', 'Robotics Clubs', 'First-time learners', 'STEM Labs'],
    features: [
      'Easy-to-use visual programming',
      'Python & Blockly support',
      'Safe for classroom use',
      'Comprehensive curriculum included',
      'Multiple end-effector options',
      'Cloud-based control available'
    ],
    specs: {
      reach: '220mm',
      payload: '250g',
      accuracy: '±0.2mm',
      axes: 6
    }
  },
  {
    id: 'mirobot-plus',
    name: 'WLKATA Mirobot Plus',
    model: 'Advanced 6-Axis Robot',
    description: 'Enhanced version with higher precision and payload. Great for advanced courses and research projects.',
    price: 'Starting at $899',
    image: '',
    level: 'intermediate',
    bestFor: ['University Labs', 'Research Projects', 'Advanced Programming', 'AI/ML Integration'],
    features: [
      'Higher precision control',
      'Advanced programming APIs',
      'Computer vision integration',
      'ROS compatible',
      'Extended payload capacity',
      'Professional development tools'
    ],
    specs: {
      reach: '280mm',
      payload: '500g',
      accuracy: '±0.05mm',
      axes: 6
    }
  },
  {
    id: 'collaborative',
    name: 'WLKATA Collaborative Kit',
    model: 'Multi-Robot System',
    description: 'Multiple robots working together. Perfect for teaching advanced concepts like swarm robotics and automation.',
    price: 'Starting at $1,799',
    image: '',
    level: 'advanced',
    bestFor: ['University Research', 'Industry Training', 'Automation Labs', 'Capstone Projects'],
    features: [
      'Multi-robot coordination',
      'Advanced AI integration',
      'Industrial protocols',
      'Real-time synchronization',
      'Professional training materials',
      'Industry-standard programming'
    ],
    specs: {
      reach: '300mm',
      payload: '750g',
      accuracy: '±0.02mm',
      axes: 6
    }
  }
];

export default function ProductPanel() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');




  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-500 border border-green-500';
      case 'intermediate': return 'bg-slate-500/20 text-slate-300 border border-slate-500';
      case 'advanced': return 'bg-slate-700/20 text-slate-400 border border-slate-700';
      default: return 'bg-slate-700/20 text-slate-400 border border-slate-700';
    }
  };

  const filteredProducts = filterLevel === 'all'
    ? products
    : products.filter(p => p.level === filterLevel);

  if (selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedProduct(null)}
          className="mb-4 text-green-500 hover:text-green-400 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to all products</span>
        </button>

        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          <div className="bg-black border-b-2 border-green-500 p-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">{selectedProduct.name}</h1>
                <p className="text-xl text-slate-300 mb-4">{selectedProduct.model}</p>
                <p className="text-2xl font-bold text-green-500">{selectedProduct.price}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-medium ${getLevelColor(selectedProduct.level)}`}>
                {selectedProduct.level}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Description
              </h2>
              <p className="text-slate-300 text-lg">
                {selectedProduct.description}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Best For
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.bestFor.map((use, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-500 rounded text-sm"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedProduct.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black border border-slate-700 rounded p-4">
                  <p className="text-xs text-slate-400 mb-1">Working Reach</p>
                  <p className="text-lg font-bold text-white">{selectedProduct.specs.reach}</p>
                </div>
                <div className="bg-black border border-slate-700 rounded p-4">
                  <p className="text-xs text-slate-400 mb-1">Max Payload</p>
                  <p className="text-lg font-bold text-white">{selectedProduct.specs.payload}</p>
                </div>
                <div className="bg-black border border-slate-700 rounded p-4">
                  <p className="text-xs text-slate-400 mb-1">Accuracy</p>
                  <p className="text-lg font-bold text-white">{selectedProduct.specs.accuracy}</p>
                </div>
                <div className="bg-black border border-slate-700 rounded p-4">
                  <p className="text-xs text-slate-400 mb-1">Axes</p>
                  <p className="text-lg font-bold text-white">{selectedProduct.specs.axes}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded font-semibold transition-colors">
                Request Quote
              </button>
              <button className="flex-1 px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black rounded font-semibold transition-colors">
                Download Datasheet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          WLKATA Robotics Products
        </h1>
        <p className="text-slate-400 mb-4">
          Find the perfect robotics kit for your educational needs
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filterLevel === 'all'
                ? 'bg-green-500 text-black'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilterLevel('beginner')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filterLevel === 'beginner'
                ? 'bg-green-500 text-black'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setFilterLevel('intermediate')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filterLevel === 'intermediate'
                ? 'bg-green-500 text-black'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setFilterLevel('advanced')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filterLevel === 'advanced'
                ? 'bg-green-500 text-black'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden hover:border-green-500 transition-colors cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="bg-black p-6 text-center border-b border-slate-700">
              <div className="h-24 flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 border border-green-500 rounded flex items-center justify-center">
                  <span className="text-green-500 font-bold">WLKATA</span>
                </div>
              </div>
              <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getLevelColor(product.level)}`}>
                {product.level}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-slate-400 mb-3">
                {product.model}
              </p>
              <p className="text-slate-400 mb-4 line-clamp-2 text-sm">
                {product.description}
              </p>
              <p className="text-xl font-bold text-green-500 mb-4">
                {product.price}
              </p>
              <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black border-2 border-green-500 rounded-lg p-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-white">Not Sure Which Kit is Right for You?</h2>
          <p className="text-lg text-slate-300 mb-6">
            Our team can help you choose the perfect robotics solution for your classroom, lab, or research project.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-green-500 hover:bg-green-400 text-black rounded font-semibold transition-colors">
              Schedule Consultation
            </button>
            <button className="px-6 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black rounded font-semibold transition-colors">
              Download Comparison Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
