import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { invitation } from '../data/invitation'

/**
 * Barre d'action fixe en bas, mobile uniquement.
 * Elle n'apparaît qu'une fois le hero dépassé, et disparaît quand le formulaire
 * de réponse est à l'écran : à ce moment-là elle recouvrirait le vrai bouton.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false)
  const [rsvpVisible, setRsvpVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = document.getElementById('rsvp')
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setRsvpVisible(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const show = pastHero && !rsvpVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-night/90 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:hidden"
        >
          <a
            href="#rsvp"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-neon to-violet px-8 font-body text-base font-semibold text-white shadow-[0_0_30px_rgba(217,70,239,.4)] active:scale-[0.98]"
          >
            {invitation.copy.heroPrimary}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
