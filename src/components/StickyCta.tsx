import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { copy } from '../config'

/**
 * Barre d'action fixe en bas, mobile uniquement.
 *
 * Elle n'apparaît qu'une fois le hero dépassé, et disparaît quand le bloc du
 * lieu est à l'écran : à ce moment-là elle recouvrirait le vrai bouton.
 *
 * Fond entièrement opaque : sans flou d'arrière-plan, retiré pour la
 * performance, le texte de la page transparaissait derrière la barre.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false)
  const [locationVisible, setLocationVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = document.getElementById('location')
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => setLocationVisible(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  const show = pastHero && !locationVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-night px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:hidden"
        >
          <a
            href="#location"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-gold px-8 font-body text-base font-semibold text-[#1f0b3a] transition-opacity duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            {copy.heroPrimary}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
