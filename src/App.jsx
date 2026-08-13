import Hero from './Hero'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <Hero />
      <Analytics />
    </>
  )
}