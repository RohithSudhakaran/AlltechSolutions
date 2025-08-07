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
  const [scrollY, setScrollY] = useState(0)
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
      setTimeout(() => animateCounter(300, 'projects'), 100)
      setTimeout(() => animateCounter(50, 'clients'), 200)
      setTimeout(() => animateCounter(15, 'experience'), 300)
    }
  }, [isVisible.about])

  // Scroll handling with throttling and parallax
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY
          setScrollY(scrollPosition)
          
          const sections = ['home', 'about', 'services', 'clients', 'projects', 'contact']
          const adjustedScrollPosition = scrollPosition + 100

          for (const section of sections) {
            const element = document.getElementById(section)
            if (element) {
              const offsetTop = element.offsetTop
              const offsetHeight = element.offsetHeight
              
              if (adjustedScrollPosition >= offsetTop && adjustedScrollPosition < offsetTop + offsetHeight) {
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
    { name: 'Interiors & Steel Framings', icon: '🏢', description: 'Interior steel frameworks and structural solutions' },
    { name: 'EOT Cranes', icon: '🏗️', description: 'Electric Overhead Traveling cranes for heavy lifting operations' },
    { name: 'Gantry Cranes', icon: '🏗️', description: 'Robust gantry crane systems for industrial applications' }
  ]

  const clients = [
    { name: 'L&T MFFK', logo: '/logos/lt-mffk-logo.png' },
    { name: 'Elgi Equipments Ltd', logo: '/logos/elgi-equipments-logo.png' },
    { name: 'NEXG Space Creators', logo: '/logos/nexg-space-logo.png' },
    { name: 'Aglysis Technologies', logo: '/logos/aglysis-technologies-logo.png' },
    { name: 'ARS Steels and Alloys', logo: '/logos/ARS Steels and Alloys.png' },
    { name: 'Lennox Technologies', logo: '/logos/lennox-technologies-logo.png' },
    { name: 'Propel Industries', logo: '/logos/propel-industries-logo.png' },
    { name: 'Teemage Builders', logo: '/logos/TEEMAGE BUILDERS.png' },
    { name: 'Ravilla Aerospace', logo: '/logos/ravilla-aerospace-logo.png' },
    { name: 'AMSAK Cranes', logo: '/logos/AMSAK CRANES.png' },
    { name: 'Walkaroo India Ltd', logo: '/logos/walkaroo-logo.png' },
    { name: 'Chennai Silks', logo: '/logos/chennai-silks-logo.png' }
  ]

  const stats = [
    { icon: Award, label: 'Projects Completed', value: counters.projects, suffix: '+' },
    { icon: Shield, label: 'Safety Standards Met', value: counters.clients, suffix: '+' },
    { icon: Clock, label: 'Years Experience', value: counters.experience, suffix: '+' },
    { icon: Star, label: 'Quality Rating', value: 5, suffix: '/5' }
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      {/* Fixed Navbar with blur effect */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-black text-gray-900 hover:text-blue-600 transition-colors cursor-pointer tracking-tight">
                ALLTECH SOLUTIONS
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
                    className={`px-3 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-300 hover:text-blue-600 hover:scale-105 ${
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

      {/* Hero Section with modern dark design */}
      <section id="home" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
            style={{
              transform: `translate3d(${scrollY * 0.1}px, ${scrollY * -0.05}px, 0)`,
              willChange: 'transform'
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
            style={{
              transform: `translate3d(${scrollY * -0.08}px, ${scrollY * 0.03}px, 0)`,
              willChange: 'transform'
            }}
          ></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div 
            className="text-white space-y-8"
            style={{
              transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
              willChange: 'transform'
            }}
          >
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                ALLTECH
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                SOLUTIONS
              </span>
            </h1>
            
            <div className="space-y-3 text-lg sm:text-xl font-medium">
              <p className="text-gray-300 tracking-wide">
                FABRICATION EXPERTS – COIMBATORE
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-full text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 border border-purple-500/20"
              >
                GET QUOTE
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="border-2 border-gray-500 text-gray-300 hover:bg-gray-300 hover:text-black font-bold py-4 px-8 rounded-full text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
              >
                OUR SERVICES
              </button>
            </div>
          </div>
          
          {/* Right Content - Welding Helmet */}
          <div 
            className="flex justify-center items-center lg:justify-end"
            style={{
              transform: `translate3d(0, ${scrollY * 0.1}px, 0)`,
              willChange: 'transform'
            }}
          >
            <div className="relative">
              {/* Main welding helmet container */}
              <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                {/* Helmet base */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-t-full border-2 border-gray-700/50 shadow-2xl">
                  {/* Helmet visor */}
                  <div className="absolute top-16 left-8 right-8 h-32 bg-gradient-to-b from-gray-900 to-black rounded-lg border border-gray-600/50">
                    {/* Visor reflection */}
                    <div className="absolute inset-2 bg-gradient-to-br from-blue-900/20 to-transparent rounded"></div>
                  </div>
                  
                  {/* Side vents */}
                  <div className="absolute left-4 top-32 space-y-2">
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                  </div>
                  <div className="absolute right-4 top-32 space-y-2">
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                    <div className="w-8 h-1 bg-gray-600 rounded"></div>
                  </div>
                  
                  {/* Orange accent details */}
                  <div className="absolute bottom-16 left-12 w-6 h-6 bg-orange-500 rounded-full shadow-lg"></div>
                  <div className="absolute bottom-20 right-16 w-4 h-4 bg-orange-400 rounded-full shadow-lg"></div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-t-full blur-2xl scale-110"></div>
                
                {/* Animated particles around helmet */}
                <div className="absolute -top-4 -left-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-4 -right-4 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-6 w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top navigation hint */}
        <div className="absolute top-8 right-8 hidden lg:block">
          <button
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            CONTACT ME
          </button>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={{
            transform: `translate(-50%, ${scrollY * 0.2}px)`,
            opacity: Math.max(0, 1 - scrollY / 400)
          }}
        >
          <ChevronDown className="h-8 w-8 text-gray-500" />
        </div>
      </section>

      {/* Parallax Transition Section */}
      <section className="h-40 relative overflow-hidden bg-gradient-to-b from-black/10 to-gray-50">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent"
          style={{
            transform: `translate3d(0, ${scrollY * 0.2}px, 0)`,
            willChange: 'transform'
          }}
        ></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-10 left-1/4 w-16 h-16 border-2 border-blue-300/30 rotate-45"
            style={{
              transform: `translate3d(${scrollY * 0.1}px, ${scrollY * -0.05}px, 0) rotate(${45 + scrollY * 0.1}deg)`,
              willChange: 'transform'
            }}
          ></div>
          <div 
            className="absolute top-20 right-1/3 w-12 h-12 bg-blue-200/20 rounded-full"
            style={{
              transform: `translate3d(${scrollY * -0.08}px, ${scrollY * 0.03}px, 0)`,
              willChange: 'transform'
            }}
          ></div>
          <div 
            className="absolute bottom-10 left-1/2 w-8 h-20 bg-gradient-to-t from-blue-300/20 to-transparent rounded-full"
            style={{
              transform: `translate3d(${scrollY * 0.05}px, ${scrollY * -0.02}px, 0)`,
              willChange: 'transform'
            }}
          ></div>
        </div>
      </section>

      {/* About Section with animated stats */}
      <section 
        id="about" 
        ref={aboutRef} 
        className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
        style={{
          transform: `translate3d(0, ${Math.max(0, scrollY - (typeof window !== 'undefined' ? window.innerHeight : 800)) * 0.1}px, 0)`,
          willChange: 'transform'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Parallax background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
              className="absolute top-10 left-10 w-32 h-32 bg-blue-100/30 rounded-full blur-xl"
              style={{
                transform: `translate3d(${scrollY * 0.15}px, ${scrollY * 0.1}px, 0)`,
                willChange: 'transform'
              }}
            ></div>
            <div 
              className="absolute top-20 right-20 w-48 h-48 bg-purple-100/20 rounded-full blur-2xl"
              style={{
                transform: `translate3d(${scrollY * -0.1}px, ${scrollY * 0.05}px, 0)`,
                willChange: 'transform'
              }}
            ></div>
            <div 
              className="absolute bottom-10 left-1/3 w-24 h-24 bg-green-100/25 rounded-full blur-lg"
              style={{
                transform: `translate3d(${scrollY * 0.08}px, ${scrollY * -0.12}px, 0)`,
                willChange: 'transform'
              }}
            ></div>
          </div>

          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">ABOUT US</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 leading-relaxed mb-12 font-medium">
                ALLTECH SOLUTIONS is a fabrication company based in Coimbatore, delivering precision 
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
                <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-600 font-bold uppercase tracking-wide text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section with hover animations */}
      <section id="services" ref={servicesRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">OUR SERVICES</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              WE PROVIDE COMPREHENSIVE FABRICATION SOLUTIONS WITH CUTTING-EDGE TECHNOLOGY AND EXPERT CRAFTSMANSHIP
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
                <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-wide">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {service.description}
                </p>
                <div className="mt-4 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section with sliding animation */}
      <section id="clients" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-100 translate-y-0 transition-all duration-1000">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Clients</h2>
            <p className="text-lg text-gray-600">Trusted by leading companies across industries</p>
          </div>
          
          {/* Sliding Logos Container */}
          <div 
            className="relative overflow-hidden"
            style={{
              padding: '60px 0',
              whiteSpace: 'nowrap',
              position: 'relative',
              isolation: 'isolate' // Create new stacking context
            }}
          >
            {/* Left Gradient Fade */}
            <div 
              className="absolute top-0 left-0 h-full z-10 pointer-events-none"
              style={{
                width: '200px',
                background: 'linear-gradient(to right, rgba(249, 250, 251, 1), rgba(249, 250, 251, 0))'
              }}
            ></div>
            
            {/* Right Gradient Fade */}
            <div 
              className="absolute top-0 right-0 h-full z-10 pointer-events-none"
              style={{
                width: '200px',
                background: 'linear-gradient(to left, rgba(249, 250, 251, 1), rgba(249, 250, 251, 0))'
              }}
            ></div>
            
            {/* Sliding logos wrapper - ENDLESS SMOOTH ANIMATION */}
            <div 
              className="flex animate-infinite-slide"
              style={{
                width: '200%', // Double width for seamless loop
                willChange: 'transform',
                backfaceVisibility: 'hidden', // Optimize for smooth animation
                transform: 'translateZ(0)' // Force GPU acceleration
              }}
            >
              {/* First set of logos */}
              {clients.map((client, index) => (
                <img
                  key={`first-${index}`}
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="flex-shrink-0 object-contain hover:scale-110 transition-transform duration-300 filter hover:brightness-110"
                  style={{
                    height: client.name === 'ARS Steels and Alloys' || client.name === 'Teemage Builders' ? '72px' : '120px',
                    width: client.name === 'ARS Steels and Alloys' || client.name === 'Teemage Builders' ? '115px' : '192px',
                    objectFit: 'contain',
                    margin: '0 48px',
                    alignSelf: 'center'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ))}
              
              {/* Second set (duplicate for seamless loop) */}
              {clients.map((client, index) => (
                <img
                  key={`second-${index}`}
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="flex-shrink-0 object-contain hover:scale-110 transition-transform duration-300 filter hover:brightness-110"
                  style={{
                    height: client.name === 'ARS Steels and Alloys' || client.name === 'Teemage Builders' ? '72px' : '120px',
                    width: client.name === 'ARS Steels and Alloys' || client.name === 'Teemage Builders' ? '115px' : '192px',
                    objectFit: 'contain',
                    margin: '0 48px',
                    alignSelf: 'center'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* CSS Keyframes for ENDLESS SMOOTH Animation */}
        <style jsx>{`
          @keyframes infiniteSlide {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          
          .animate-infinite-slide {
            animation: infiniteSlide 30s linear infinite;
            will-change: transform;
            backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Ensure no animation delays or interruptions */
          .animate-infinite-slide * {
            pointer-events: auto;
            transform: translateZ(0);
          }
        `}</style>
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

      {/* Footer with comprehensive layout */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Company Section */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wide">COMPANY</h3>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">About Us</button></li>
                <li><button onClick={() => scrollToSection('about')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Our Team</button></li>
                <li><button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Quality Assurance</button></li>
                <li><button onClick={() => scrollToSection('clients')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Our Clients</button></li>
              </ul>
            </div>

            {/* Services Section */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wide">SERVICES</h3>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Pre-Engineered Structures</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Roofing Solutions</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Steel Doors & Windows</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Fire Rated Doors</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Chemical Anchoring</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Hand Railings</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">EOT Cranes</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Gantry Cranes</button></li>
              </ul>
            </div>

            {/* Projects & Support */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wide">PROJECTS</h3>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Our Projects</button></li>
                <li><button onClick={() => scrollToSection('projects')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Project Gallery</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Get Quote</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Technical Support</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer font-medium">Contact Us</button></li>
              </ul>
            </div>

            {/* Contact & Company Info */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">ALLTECH SOLUTIONS</h2>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed font-medium">FABRICATION EXPERTS – COIMBATORE</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-blue-400 font-black text-sm uppercase tracking-wide mb-2">PHONE (INDIA)</p>
                  <a href="tel:+919677879427" className="text-white text-xl font-black hover:text-blue-400 transition-colors duration-300">
                    +91 9677879427
                  </a>
                </div>
                
                <div>
                  <p className="text-blue-400 font-black text-sm uppercase tracking-wide mb-2">EMAIL</p>
                  <a href="mailto:altechsolutionscoimbatore@gmail.com" className="text-white hover:text-blue-400 transition-colors duration-300 font-medium text-sm leading-tight">
                    altechsolutionscoimbatore@gmail.com
                  </a>
                </div>
                
                <div>
                  <p className="text-blue-400 font-black text-sm uppercase tracking-wide mb-2">LOCATION</p>
                  <p className="text-gray-300 font-medium">Sundarapuram, Coimbatore 641024</p>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex space-x-4 mt-8">
                <div className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <span className="text-white text-lg font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <span className="text-white text-lg font-bold">▶</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110">
                  <span className="text-white text-lg font-bold">in</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400 text-sm font-medium">
                  © 2025 Alltech Solutions. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300 font-medium">Privacy Policy</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300 font-medium">Terms of Service</button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-400 hover:text-blue-400 text-sm transition-colors duration-300 font-medium">Contact</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
