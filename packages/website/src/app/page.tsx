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

          <p className='max-w-3xl text-lg text-gray-300 md:text-xl'>
            An entertainment focused Discord bot that uses Markov chains to generate its own
            messages.
          </p>

          <div className='mt-6 flex flex-row gap-x-6'>
            <a
              className='flex items-center gap-x-3 rounded-lg border border-blue-700 bg-blue-800 px-6 py-3 text-base font-semibold shadow-md transition duration-300 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500'
              href='https://discord.com/oauth2/authorize?client_id=942251323741569024'
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon='mdi:discord' height='24px' width='24px' /> Invite
            </a>

            <a
              className='flex items-center gap-x-3 rounded-lg border border-neutral-700 bg-neutral-800 px-6 py-3 text-base font-semibold shadow-md transition duration-300 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-500'
              href='https://github.com/ohmrr/quabos-discord'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Icon icon='mdi:github' height='24px' width='24px' />
              GitHub
            </a>
          </div>

          <div className='flex flex-row gap-x-6'>
            <Link
              className='flex items-center gap-x-3 rounded-lg border border-green-700 bg-green-800 px-6 py-3 text-base font-semibold shadow-md transition duration-300 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500'
              href='/'
            >
              <Icon icon='mdi:external-link' height='24px' width='24px' />
              Guide
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
