"use client"

import type React from "react"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "@stackframe/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Palette,
  MousePointer,
  Heart,
  Star,
  ArrowRight,
  Globe,
} from "lucide-react"
import { motion, useScroll, useTransform } from "motion/react"


const LandingPage: React.FC = () => {
  const user = useUser()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard")
    } else {
      navigate("/handler/sign")
    }
  }

  const features = [
    {
      icon: <MousePointer className="w-6 h-6" />,
      title: "Interactive Storytelling",
      description:
        "Transform static screenshots into living, breathing narratives that guide users through your product's magic.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Visual Poetry",
      description:
        "Craft beautiful annotations and highlights that dance across your interface, making every feature shine.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast Creation",
      description: "From concept to captivating demo in minutes, not hours. Your ideas deserve to be shared instantly.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Audience Enchantment",
      description:
        "Turn passive viewers into active participants. Every click tells a story, every step builds excitement.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Conversion Alchemy",
      description: "Watch as confusion transforms into clarity, and curiosity blossoms into conversion.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Universal Reach",
      description:
        "Share your vision across every device, every platform. Your story travels wherever your audience goes.",
      color: "from-teal-500 to-blue-500",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager at TechFlow",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "Tourify transformed how we showcase our product. Our demo engagement increased by 340% in just two weeks.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Growth Lead at StartupX",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The poetry of product storytelling. Our conversion rates have never been higher since we started using Tourify.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "UX Designer at InnovateCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "Creating beautiful product tours used to take days. Now it takes minutes. Tourify is pure magic.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "10M+", label: "Tours Created" },
    { number: "500K+", label: "Happy Users" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "5x", label: "Faster Creation" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background text-foreground overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30 dark:opacity-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-chart-2/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-chart-1/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div style={{ y }} className="text-center max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-muted/50 backdrop-blur-sm border-border">
              <Sparkles className="w-4 h-4 mr-2" />
              Where Stories Come Alive
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              Craft Product Tours
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-chart-1 to-primary bg-clip-text text-transparent">
              Like Poetry in Motion
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-4xl mx-auto leading-relaxed"
          >
            Transform your product into an enchanting narrative. Every click whispers a story, every interaction paints
            a picture, every tour becomes a journey that captivates hearts and converts minds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground px-8 py-4 rounded-full text-md font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              Begin Your Story
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted/50 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm bg-transparent"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch the Magic
            </Button>
          </motion.div>

          {/* Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Features That
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Inspire Wonder
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every feature is crafted with love, designed to turn your product showcase into an unforgettable
              experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/20 transition-all duration-300 h-full hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Love Letters From
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Our Community
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/20 transition-all duration-300 h-full hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-chart-4 text-chart-4" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Your Story
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
                Awaits Its Author
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of creators who have discovered the art of product storytelling. Your masterpiece is just
              one click away.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground px-12 py-6 rounded-full text-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 group"
            >
              <Heart className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              Start Creating Magic
              <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            Tourify
          </div>
          <p className="text-muted-foreground mb-8">Where every product becomes a story worth telling.</p>
          <div className="flex justify-center space-x-8 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
