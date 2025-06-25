"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowRight, Bot, Network, Workflow, MessageSquare, Sparkles, Code, Globe, Star, Cpu, Rocket } from "lucide-react"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  type Particle = { id: number; x: number; y: number; size: number; speed: number; opacity: number }
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setIsLoaded(true)
    
    // Generate floating particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }))
    setParticles(newParticles)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-400/30 animate-float-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.speed + 10}s`,
              animationDelay: `${particle.id * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Animated Background Grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(rgba(147, 51, 234, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 60px 60px, 120px 120px, 120px 120px",
          animation: "grid-move 20s linear infinite, grid-pulse 4s ease-in-out infinite alternate"
        }}
      />

      {/* Dynamic Gradient Overlay with enhanced effects */}
      <div 
        className="absolute inset-0 opacity-40 transition-all duration-500"
        style={{
          background: `
            radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.3), transparent 50%),
            radial-gradient(800px circle at ${mousePosition.x * 0.8}px ${mousePosition.y * 0.8}px, rgba(147, 51, 234, 0.2), transparent 60%)
          `
        }}
      />

      {/* Enhanced Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float-complex"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed-complex"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-float-slow-complex"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-2xl animate-orbit"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        {/* Enhanced Logo with complex animations */}
        <div className={`flex items-center gap-3 transform transition-all duration-1500 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-75'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-pink-600 rounded-2xl blur-xl opacity-30 animate-rotate-slow"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-glow">
              <Zap className="w-8 h-8 text-white animate-lightning" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent animate-text-shimmer py-10px">
            AgentSymphony
          </h1>
        </div>

        {/* Enhanced Main Heading with typewriter effect */}
        <div className={`max-w-4xl mx-auto my-20 transform transition-all duration-1800 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight animate-text-glow">
            AI Agent Orchestration
          </h2>
          <div className="relative overflow-hidden">
            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium animate-typewriter">
              ONE COMMAND | MULTIPLE ACTIONS | ZERO FRICTION
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-80 animate-expand"></div>
          </div>
        </div>

        {/* Enhanced Feature Badges with wave animation */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-1500 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {[
            { icon: MessageSquare, text: "Natural Language Processing", color: "blue", delay: 0 },
            { icon: Bot, text: "Real-time Orchestration", color: "green", delay: 100 },
            { icon: Network, text: "Multi-Agent Coordination", color: "orange", delay: 200 },
            { icon: Workflow, text: "Automated Workflows", color: "purple", delay: 300 }
          ].map((badge, index) => (
            <Badge 
              key={index}
              className={`bg-${badge.color}-600/20 hover:bg-${badge.color}-600/40 border border-${badge.color}-500/30 text-white px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all duration-500 hover:scale-110 hover:shadow-xl cursor-pointer group animate-bounce-in relative overflow-hidden`}
              style={{ 
                animationDelay: `${badge.delay + 1000}ms`,
                animationDuration: '0.8s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <badge.icon className="w-4 h-4 mr-2 group-hover:rotate-180 group-hover:scale-125 transition-all duration-500" />
              <span className="relative">{badge.text}</span>
            </Badge>
          ))}
        </div>

        {/* Ultra Enhanced CTA Button */}
        <div className={`transform transition-all duration-2000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-all duration-500 animate-pulse-glow"></div>
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 group overflow-hidden transform hover:scale-105 animate-bg-shift"
              onClick={() => window.location.href = '/dashboard'}
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
              <span className="relative flex items-center">
                <Rocket className="w-6 h-6 mr-3 group-hover:animate-spin transition-all duration-300" />
                Get Started
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-3 group-hover:scale-125 transition-all duration-300" />
              </span>
            </Button>
          </div>
        </div>

        {/* Enhanced Features Grid with complex hover effects */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto transform transition-all duration-2000 delay-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          {[
            {
              icon: MessageSquare,
              title: "Natural Commands",
              description: "Simply describe what you want to accomplish in plain English",
              color: "blue",
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              icon: Network,
              title: "Smart Coordination",
              description: "Agents work together seamlessly to execute complex workflows",
              color: "green",
              gradient: "from-green-500 to-emerald-500"
            },
            {
              icon: Workflow,
              title: "Real-time Execution",
              description: "Watch your tasks execute in real-time with live status updates",
              color: "purple",
              gradient: "from-purple-500 to-pink-500"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group text-center p-8 rounded-2xl bg-slate-800/30 backdrop-blur-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-700 hover:transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden animate-slide-up"
              style={{ 
                animationDelay: `${index * 300 + 1500}ms`,
                animationDuration: '1s'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 animate-pulse`}></div>
                <div className={`relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12 animate-float-icon`}>
                  <feature.icon className="w-8 h-8 text-white group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 relative">
                {feature.title}
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 leading-relaxed relative">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Enhanced animated decorative elements */}
        <div className="absolute top-20 right-20 opacity-30">
          <Code className="w-8 h-8 text-blue-400 animate-bounce-complex" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-30">
          <Globe className="w-6 h-6 text-purple-400 animate-ping-slow" />
        </div>
        <div className="absolute top-1/2 right-10 opacity-30">
          <Sparkles className="w-10 h-10 text-green-400 animate-twinkle" />
        </div>
        <div className="absolute top-1/3 left-10 opacity-25">
          <Star className="w-6 h-6 text-yellow-400 animate-star" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 opacity-25">
          <Cpu className="w-8 h-8 text-cyan-400 animate-spin-slow" />
        </div>
      </div>

      {/* Enhanced Animated Footer */}
      <footer className="relative z-10 mt-32 border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-slate-900/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0ms' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-glow">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  AgentSymphony
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Revolutionizing AI agent orchestration with seamless multi-agent coordination and natural language processing.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Globe, href: "#", delay: 100 },
                  { icon: MessageSquare, href: "#", delay: 200 },
                  { icon: Code, href: "#", delay: 300 }
                ].map((social, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 bg-slate-800/50 hover:bg-blue-600/20 border border-slate-700/50 hover:border-blue-500/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group animate-bounce-in"
                    style={{ animationDelay: `${social.delay}ms` }}
                  >
                    <social.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              {[
                { name: "Features", href: "#features" },
                { name: "Pricing", href: "#pricing" },
                { name: "Documentation", href: "#docs" },
                { name: "API Reference", href: "#api" }
              ].map((link, index) => (
                <button
                  key={index}
                  className="block text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-2 transform"
                  style={{ animationDelay: `${index * 50 + 400}ms` }}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Company Links */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              {[
                { name: "About Us", href: "#about" },
                { name: "Careers", href: "#careers" },
                { name: "Blog", href: "#blog" },
                { name: "Press Kit", href: "#press" }
              ].map((link, index) => (
                <button
                  key={index}
                  className="block text-slate-400 hover:text-blue-400 transition-colors duration-300 hover:translate-x-2 transform"
                  style={{ animationDelay: `${index * 50 + 600}ms` }}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4 animate-slide-up" style={{ animationDelay: '600ms' }}>
              <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
              <p className="text-slate-400 text-sm mb-4">
                Get the latest updates on AI agent orchestration and new features.
              </p>
              <div className="space-y-3">
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all duration-300 group-hover:border-slate-600/50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 animate-slide-up" style={{ animationDelay: '800ms' }}>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-400 text-sm">
                © 2025 AgentSymphony. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link, index) => (
                  <button
                    key={index}
                    className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-300"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2 group">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-slate-400 text-sm group-hover:text-green-400 transition-colors">
                All systems operational
              </span>
            </div>
          </div>

          {/* Floating Elements in Footer */}
          <div className="absolute top-4 right-4 opacity-20">
            <Bot className="w-6 h-6 text-purple-400 animate-float-icon" />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Network className="w-5 h-5 text-blue-400 animate-twinkle" />
          </div>
        </div>

        {/* Footer Background Animation */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float-slow-complex"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float-delayed-complex"></div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float-complex {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-30px) translateX(10px) rotate(90deg) scale(1.1); }
          50% { transform: translateY(-20px) translateX(-10px) rotate(180deg) scale(1); }
          75% { transform: translateY(-40px) translateX(5px) rotate(270deg) scale(0.9); }
        }
        
        @keyframes float-delayed-complex {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-40px) translateX(-15px) rotate(-90deg) scale(0.8); }
          50% { transform: translateY(-30px) translateX(15px) rotate(-180deg) scale(1.2); }
          75% { transform: translateY(-50px) translateX(-5px) rotate(-270deg) scale(1); }
        }
        
        @keyframes float-slow-complex {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
          33% { transform: translateY(-25px) translateX(20px) rotate(120deg) scale(1.1); }
          66% { transform: translateY(-15px) translateX(-20px) rotate(240deg) scale(0.9); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
        
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
          50% { transform: translateY(-100px) translateX(50px); opacity: 0.8; }
        }
        
        @keyframes lightning {
          0%, 100% { transform: rotate(0deg) scale(1); }
          10% { transform: rotate(-5deg) scale(1.1); }
          20% { transform: rotate(5deg) scale(0.9); }
          30% { transform: rotate(-3deg) scale(1.05); }
          40% { transform: rotate(3deg) scale(0.95); }
          50% { transform: rotate(0deg) scale(1); }
        }
        
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { text-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 60px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes typewriter {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes expand {
          0% { width: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { width: 128px; opacity: 0.8; }
        }
        
        @keyframes bounce-in {
          0% { transform: translateY(20px) scale(0.8); opacity: 0; }
          50% { transform: translateY(-5px) scale(1.05); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes bg-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide-up {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes bounce-complex {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
          75% { transform: translateY(-15px) rotate(270deg); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }
        
        @keyframes star {
          0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.25; }
          50% { transform: rotate(180deg) scale(1.3); opacity: 0.8; }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6), 0 0 60px rgba(59, 130, 246, 0.4); }
        }
        
        .animate-float-complex {
          animation: float-complex 12s ease-in-out infinite;
        }
        
        .animate-float-delayed-complex {
          animation: float-delayed-complex 15s ease-in-out infinite;
        }
        
        .animate-float-slow-complex {
          animation: float-slow-complex 18s ease-in-out infinite;
        }
        
        .animate-orbit {
          animation: orbit 20s linear infinite;
        }
        
        .animate-float-particle {
          animation: float-particle 8s ease-in-out infinite;
        }
        
        .animate-lightning {
          animation: lightning 2s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 3s linear infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 4s ease-in-out infinite;
        }
        
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40) 1s both;
        }
        
        .animate-expand {
          animation: expand 2s ease-out 2s both;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out both;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .animate-bg-shift {
          background-size: 200% 200%;
          animation: bg-shift 4s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out both;
        }
        
        .animate-float-icon {
          animation: float-icon 3s ease-in-out infinite;
        }
        
        .animate-bounce-complex {
          animation: bounce-complex 3s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-star {
          animation: star 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 10s linear infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}