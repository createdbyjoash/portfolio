"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/api"

interface SocialLink {
  platform: string
  url: string
  icon: string
}

export default function SocialSidebar() {
  const [socials, setSocials] = useState<SocialLink[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const fallbackSocials = [
      { platform: 'upwork', url: 'https://www.upwork.com/freelancers/joasha3', icon: 'upwork' },
      { platform: 'linkedin', url: 'https://www.linkedin.com/in/joash01/', icon: 'linkedin' },
      { platform: 'github', url: 'https://www.github.com/createdbyjoash', icon: 'github' },
      { platform: 'email', url: 'mailto:joashadeoye@gmail.com', icon: 'email' },
    ]

    fetch(`${API_BASE_URL}/socials`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((body) => {
        const data = Array.isArray(body) ? body : body?.socials
        if (Array.isArray(data) && data.length > 0) {
          setSocials(data)
        } else {
          setSocials(fallbackSocials)
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching socials:", err.message)
        }
        setSocials(fallbackSocials)
      })
      .finally(() => {
        clearTimeout(timeoutId)
      })

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [])

  // Only show sidebar when specific sections are in view
  useEffect(() => {
    // Don't show sidebar on admin routes
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      setVisible(false)
      return
    }

    const ids = ['hero', 'about', 'technologies']
    const findElements = () => ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    const setupObserver = (elements: HTMLElement[]) => {
      // Immediate check using bounding rect so sidebar appears right after mount if a section is in view
      const isElementVisible = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect()
        const height = rect.height || 1
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
        const visibleRatio = visibleHeight / height
        return visibleHeight > 0 && visibleRatio >= 0.25
      }

      const initialAnyVisible = elements.some(isElementVisible)
      if (initialAnyVisible) {
        setVisible(true)
      } else {
        if (typeof window !== 'undefined' && window.location.pathname === '/' && window.scrollY <= window.innerHeight * 0.5) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      }

      const obs = new IntersectionObserver(
        (entries) => {
          const anyVisible = entries.some((e) => e.isIntersecting)
          setVisible(anyVisible)
        },
        { root: null, threshold: 0.25 }
      )

      elements.forEach((el) => obs.observe(el))

      return () => obs.disconnect()
    }

    let elements = findElements()
    if (elements.length === 0) {
      // If sections are not yet in the DOM (race/hydration), poll briefly for them (2s)
      const start = Date.now()
      const interval = window.setInterval(() => {
        elements = findElements()
        if (elements.length > 0) {
          clearInterval(interval)
          const cleanup = setupObserver(elements)
          return
        }
        if (Date.now() - start > 2000) {
          // Give up after 2s
          clearInterval(interval)
          setVisible(false)
        }
      }, 200)

      return () => clearInterval(interval)
    }

    const cleanup = setupObserver(elements)
    return cleanup
  }, [])

  const getIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "github":
        return <Github size={20} />
      case "linkedin":
        return <Linkedin size={20} />
      case "twitter":
        return <Twitter size={20} />
      case "email":
        return <Mail size={20} />
      case "upwork":
        // more detailed Upwork mark for clarity
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="24" height="24" rx="4" fill="#fff" opacity="0" />
            <path d="M6.5 12.2c0-1.3 1-2.3 2.3-2.3 1.3 0 2.3 1 2.3 2.3 0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3zm6.2 0c0-3 2.3-5.2 5.1-5.2 2.8 0 5.1 2.2 5.1 5.2v.8h-3.2v-.8c0-1.2-1-1.8-2.2-1.8-1.2 0-2.2.6-2.2 1.8v.8h-2.6v-.8z" fill="currentColor" />
          </svg>
        )
      default:
        return <Github size={20} />
    }
  }

  if (!visible) return null

  // Ensure order: upwork, linkedin, github, email
  const order = ['upwork', 'linkedin', 'github', 'email']
  const ordered = order.map((p) => socials.find((s) => s.platform.toLowerCase() === p)).filter(Boolean) as SocialLink[]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed left-8 bottom-0 z-50"
    >
      <div className="flex flex-col items-center space-y-6">
        {ordered.map((social, index) => {
          const key = social.platform || `${social.url}-${index}`
          const ariaLabel = `${social.platform} link`
          const isIconUrl = social.icon && (social.icon.startsWith('http') || social.icon.startsWith('/'))
          return (
            <motion.a
              key={key}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className="text-slate-400 hover:text-brand-light transition-colors"
              aria-label={ariaLabel}
            >
              {isIconUrl ? (
                <img src={social.icon} alt={social.platform} className="w-5 h-5" />
              ) : (
                getIcon(social.platform)
              )}
            </motion.a>
          )
        })}
        <div className="w-px h-24 bg-slate-700"></div>
      </div>
    </motion.div>
  )
}
