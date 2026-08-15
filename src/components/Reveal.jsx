import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, y = 26, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 0.84, 0.44, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function RevealStagger({ children, className = '', stagger = 0.1 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 0.84, 0.44, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
