export default function Home() {
  return (
    <div className="flex items-center justify-center font-sans min-h-screen">
      <main className="flex w-full max-w-3xl flex-col items-center sm:items-start">
        <h1 className="text-5xl font-bold mb-8 text-center sm:text-left">
          Welcome to <span className="text-purple-400">Soldex!</span>
        </h1>
        <p className="text-3xl text-center sm:text-left mb-16">
          A really smart solana indexer.
        </p>
      </main>
    </div>
  );
}
