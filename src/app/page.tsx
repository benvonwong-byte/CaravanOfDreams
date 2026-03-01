export default function Home() {
  return (
    <main className="min-h-screen p-12">
      <h1 className="font-serif text-5xl text-terracotta-500 mb-4">
        Caravan of Dreams
      </h1>
      <p className="text-lg text-charcoal-700 mb-8">
        Another world is possible. We&apos;re building it over dinner.
      </p>
      <div className="flex gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-card bg-terracotta-500" />
        <div className="w-16 h-16 rounded-card bg-sage-500" />
        <div className="w-16 h-16 rounded-card bg-mustard-400" />
        <div className="w-16 h-16 rounded-card bg-charcoal-700" />
        <div className="w-16 h-16 rounded-card bg-cream-200 border border-charcoal-200" />
        <div className="w-16 h-16 rounded-card bg-teal-500" />
      </div>
    </main>
  )
}
