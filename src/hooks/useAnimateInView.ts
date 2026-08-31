import { useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/**
 * Dit si une section doit animer ou rester figée.
 *
 * Pourquoi : les animations infinies continuent de tourner même quand leur
 * section est loin de l'écran. Mesuré au navigateur, la page en portait une
 * trentaine en permanence, dont dix-huit rien que pour les flammes des neuf
 * bougies, qui brûlaient alors qu'on lisait l'adresse deux écrans plus bas.
 *
 * Renvoie un ref à poser sur la section, et un booléen à utiliser pour couper
 * l'animation. La marge fait démarrer l'animation un peu avant l'entrée à
 * l'écran, pour qu'on ne voie jamais un élément « se réveiller ».
 */
export function useAnimateInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { margin: '150px 0px 150px 0px' })

  return { ref, animate: !reduced && inView, reduced }
}
