import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { HostCTA } from '@/components/home/HostCTA'
import { SpaceTeaser } from '@/components/home/SpaceTeaser'

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <UpcomingEvents />
      <HostCTA />
      <SpaceTeaser />
    </>
  )
}
