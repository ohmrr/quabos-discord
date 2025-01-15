import Container from '@/components/Container';
import StarBackground from '@/components/HomePage/StarBackground';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='main relative h-screen w-screen'>
      <div className='absolute inset-0'>
        <StarBackground />
      </div>

      <Container className='absolute inset-0 flex items-center justify-center px-4 md:px-10'>
        <div className='flex flex-col items-center justify-center gap-y-8 text-center'>
          <h1 className='text-center text-6xl font-bold tracking-tight md:text-8xl'>Quabos</h1>

          <p className='text-lg text-gray-300 md:text-xl max-w-3xl'>An entertainment focused Discord bot that uses Markov chains to generate its own messages.</p>

          <div className="flex flex-row gap-x-6 mt-6">
            <Link className="text-base flex items-center gap-x-3 rounded-lg shadow-md border transition duration-300 hover:bg-blue-900 border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-800 px-6 py-3 font-semibold" href="/"><Icon icon="mdi:external-link" height="24px" width="24px" /> Guide</Link>
            <a className="text-base flex items-center gap-x-3 rounded-lg shadow-md border transition duration-300 hover:bg-neutral-900 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-neutral-800 px-6 py-3 font-semibold" href="https://github.com/ohmrr/quabos-discord" target="_blank" rel="noopener noreferrer"> <Icon icon="mdi:external-link" height="24px" width="24px" />GitHub</a>
          </div>

        </div>
      </Container>
    </div>
  );
}
