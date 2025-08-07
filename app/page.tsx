'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, Phone, Mail, MapPin, ExternalLink, ChevronDown, Star, Award, Users, Clock, Target, Zap, Shield } from 'lucide-react'

export default function AlltechSolutions() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const [counters, setCounters] = useState({ projects: 0, clients: 0, experience: 0 })
  const [typedText, setTypedText] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)

  const fullText = "Fabrication Experts – Coimbatore"

  // Typing animation effect
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 150) // Slower typing for better performance

    return () => clearInterval(timer)
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.15, rootMargin: '100px' } // Better trigger points for smoother animations
    )

    // Use refs instead of querySelectorAll for better performance
    const sections = ['home', 'about', 'services', 'clients', 'projects', 'contact']
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Counter animation with better performance
  useEffect(() => {
    if (isVisible.about) {
      const animateCounter = (target: number, key: keyof typeof counters) => {
        let current = 0
        const increment = target / 30 // Fewer steps
        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }))
        }, 80) // Slower interval for better performance
      }

      // Stagger the animations
      setTimeout(() => animateCounter(500, 'projects'), 100)
      setTimeout(() => animateCounter(50, 'clients'), 200)
      setTimeout(() => animateCounter(15, 'experience'), 300)
    }
  }, [isVisible.about])

  // Scroll handling with throttling
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = ['home', 'about', 'services', 'clients', 'projects', 'contact']
          const scrollPosition = window.scrollY + 100

          for (const section of sections) {
            const element = document.getElementById(section)
            if (element) {
              const offsetTop = element.offsetTop
              const offsetHeight = element.offsetHeight
              
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section)
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setFormStatus('loading')
    
    try {
      // API call to send contact form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      console.log('API Response:', result)
      
      if (response.ok && result.success) {
        setFormStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setFormStatus('idle')
        }, 5000)
      } else {
        console.error('API Error:', result)
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setFormStatus('error')
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle')
      }, 5000)
    }
  }

  const services = [
    { name: 'Pre-Engineered Structures', icon: '🏗️', description: 'Custom steel structures designed for durability and efficiency' },
    { name: 'Roofing Solutions', icon: '🏠', description: 'Weather-resistant roofing systems for all building types' },
    { name: 'Car Parking Solutions', icon: '🚗', description: 'Modern parking structures with optimal space utilization' },
    { name: 'Steel Doors & Windows', icon: '🚪', description: 'High-quality steel doors and windows for security and style' },
    { name: 'Fire Rated Doors', icon: '🔥', description: 'Safety-compliant fire-resistant door solutions' },
    { name: 'Chemical Anchoring', icon: '⚗️', description: 'Professional chemical anchoring for structural connections' },
    { name: 'Floating Canopies', icon: '☂️', description: 'Elegant canopy solutions for outdoor spaces' },
    { name: 'Hand Railings – SS & MS', icon: '🛡️', description: 'Stainless steel and mild steel railing systems' },
    { name: 'Interiors & Steel Framings', icon: '🏢', description: 'Interior steel frameworks and structural solutions' }
  ]

  const clients = [
    { name: 'Walkaroo India Ltd', logo: '/logos/walkaroo-logo.png' },
    { name: 'Chennai Silks', logo: '/logos/chennai-silks-logo.png' },
    { name: 'Propel Industries', logo: '/logos/propel-industries-logo.png' },
    { name: 'Elgi Equipments Ltd', logo: '/logos/elgi-equipments-logo.png' },
    { name: 'Ravilla Aerospace', logo: '/logos/ravilla-aerospace-logo.png' },
    { name: 'L&T MFFK', logo: '/logos/lt-mffk-logo.png' },
    { name: 'NEXG Space Creators', logo: '/logos/nexg-space-logo.png' },
    { name: 'Lennox Technologies', logo: '/logos/lennox-technologies-logo.png' },
    { name: 'Aglysis Technologies', logo: '/logos/aglysis-technologies-logo.png' }
  ]

  const stats = [
    { icon: Award, label: 'Projects Completed', value: counters.projects, suffix: '+' },
    { icon: Users, label: 'Happy Clients', value: counters.clients, suffix: '+' },
    { icon: Clock, label: 'Years Experience', value: counters.experience, suffix: '+' },
    { icon: Star, label: 'Quality Rating', value: 5, suffix: '/5' }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Fixed Navbar with blur effect */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                Alltech Solutions
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About' },
                  { id: 'services', label: 'Services' },
                  { id: 'clients', label: 'Clients' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'contact', label: 'Contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-blue-600 hover:scale-105 ${
                      activeSection === item.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-110"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation with slide animation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white border-t`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              { id: 'services', label: 'Services' },
              { id: 'clients', label: 'Clients' },
              { id: 'projects', label: 'Projects' },
              { id: 'contact', label: 'Contact' }
            ].map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 transform hover:translate-x-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section with parallax effect */}
      <section id="home" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: 'url(/hero-welding.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 animate-slide-up">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Alltech Solutions
            </span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 font-light h-10 flex items-center justify-center">
            <span className="border-r-2 border-white animate-pulse pr-1">{typedText}</span>
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-base transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
            >
              Request a Quote
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-6 rounded-lg text-base transition-all duration-300 transform hover:scale-105"
            >
              Our Services
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white" />
        </div>
      </section>

      {/* About Section with animated stats */}
      <section id="about" ref={aboutRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed mb-12">
                Alltech Solutions is a fabrication company based in Coimbatore, delivering precision 
                structural and architectural fabrication solutions. With a skilled team and years of 
                experience, we specialize in pre-engineered structures, roofing, steel framings, and more. 
                Reliability, quality, and client satisfaction are at the core of what we do.
              </p>
            </div>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with hover animations */}
      <section id="services" ref={servicesRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive fabrication solutions with cutting-edge technology and expert craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 ${
                  isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section with floating animation */}
      <section id="clients" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.clients ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Clients</h2>
            <p className="text-lg text-gray-600">Trusted by leading companies across industries</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 text-center border border-gray-100 transform hover:scale-105 hover:rotate-1 relative ${
                  isVisible.clients ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 0.1}s`,
                  animation: isVisible.clients ? `float ${3 + (index % 3)}s ease-in-out infinite ${index * 0.5}s` : 'none'
                }}
              >
                <div className="h-32 flex items-center justify-center">
                  <img 
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-h-28 max-w-full object-contain hover:scale-110 transition-transform duration-300 filter hover:brightness-110"
                    onError={(e) => {
                      // Fallback to initials if logo fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="text-4xl font-bold text-blue-600 bg-blue-50 px-6 py-5 rounded-lg hidden items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    {client.name.split(' ').map(word => word[0]).join('')}
                  </div>
                </div>
                
                {/* Hover tooltip */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                  {client.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section with 3D rotating carousel */}
      <section id="projects" className="pt-10 pb-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-0 transition-all duration-1000 ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0">Our Projects</h2>
            <p className="text-lg text-gray-600 mb-0">Showcasing our expertise in fabrication and construction</p>
          </div>
          
          {/* 3D Rotating Carousel with Base */}
          <div className="flex justify-center items-center h-[800px] relative">
            {/* Base Platform */}
            <div 
              className="absolute bottom-32 bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl"
              style={{
                width: '300px',
                height: '15px',
                borderRadius: '50%',
                transform: 'perspective(800px) rotateX(75deg)',
                opacity: '0.8'
              }}
            ></div>
            
            {/* Carousel Container */}
            <div 
              className={`slider transition-opacity duration-1000 ${
                isVisible.projects ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                width: '250px',
                height: '180px',
                transformStyle: 'preserve-3d',
                transform: 'perspective(800px)',
                animation: isVisible.projects ? 'autoRun 60s linear infinite' : 'none',
                position: 'relative',
                marginBottom: '120px'
              }}
            >
              {[
                { id: 1, title: "Steel Structure Complex", image: "1.jpg" },
                { id: 2, title: "Pre-Engineered Building", image: "2.jpg" },
                { id: 3, title: "Advanced Roofing System", image: "3.jpg" },
                { id: 4, title: "Multi-Level Parking", image: "4.jpg" },
                { id: 5, title: "Fire Safety Solutions", image: "5.jpg" },
                { id: 6, title: "Architectural Railings", image: "6.jpg" },
                { id: 7, title: "Chemical Anchoring", image: "7.jpg" },
                { id: 8, title: "Floating Canopy", image: "8.jpg" },
                { id: 9, title: "Interior Frameworks", image: "9.jpg" },
                { id: 10, title: "Custom Fabrication", image: "10.jpg" }
              ].map((project, index) => (
                <div
                  key={project.id}
                  className="absolute inset-0"
                  style={{
                    transform: `rotateY(${(index) * (360 / 10)}deg) translateZ(400px)`
                  }}
                >
                  <img 
                    src={`/projects/${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-lg shadow-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Statistics Section */}
      <section id="projects" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ease-out transform will-change-transform ${isVisible.projects ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
            {/* Precision Engineering */}
            <div className={`group text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: isVisible.projects ? '0.1s' : '0s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  99%
                </div>
                <div className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  Precision Engineering
                </div>
                <div className="mt-4 w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 rounded-full mx-auto"></div>
              </div>
            </div>

            {/* Faster Delivery */}
            <div className={`group text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: isVisible.projects ? '0.2s' : '0s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                  30%
                </div>
                <div className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  Faster Delivery
                </div>
                <div className="mt-4 w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-700 rounded-full mx-auto"></div>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className={`group text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 relative overflow-hidden ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: isVisible.projects ? '0.3s' : '0s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  100%
                </div>
                <div className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  Quality Assurance
                </div>
                <div className="mt-4 w-0 group-hover:w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-700 rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with form animations */}
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-lg text-gray-600">Ready to start your next project? Get in touch with us today!</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">Sundarapuram, Coimbatore 641024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`bg-white p-8 rounded-xl shadow-xl transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              
              {/* Form Status Messages */}
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Message sent successfully! We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Failed to send message. Please try again or contact us directly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 ${
                      formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Your Name"
                    disabled={formStatus === 'loading'}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 ${
                      formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                    disabled={formStatus === 'loading'}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 ${
                      formErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Your Phone Number"
                    disabled={formStatus === 'loading'}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>
                
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none hover:border-blue-300 ${
                      formErrors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Tell us about your project requirements..."
                    disabled={formStatus === 'loading'}
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 ${
                    formStatus === 'loading'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  }`}
                >
                  {formStatus === 'loading' ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with gradient */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">Alltech Solutions</h3>
              <p className="text-gray-300">Fabrication Experts – Coimbatore</p>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400">
                © 2025 Alltech Solutions. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
