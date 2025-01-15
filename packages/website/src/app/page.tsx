import Container from '@/components/Container';
import StarBackground from '@/components/HomePage/StarBackground';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='relative h-screen w-screen'>
      <div className='absolute inset-0'>
        <StarBackground />
      </div>

      <Container className='absolute px-[20px] inset-0 flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-y-10'>
          <h1 className='text-center text-5xl font-bold md:text-7xl'>Quabos</h1>

          <p className='text-xl font-normal text-center md:text-2xl md:max-w-[75%]'>An entertainment focused Discord bot that uses Markov chains to generate its own messages.</p>

          <div className="flex flex-row gap-x-8">
          <a
            className='rounded-lg border bg-neutral-800 px-5 py-2 font-semibold shadow-md transition-colors duration-300 hover:bg-neutral-900'
            href='https://github.com/ohmrr/quabos-discord'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className="flex flex-row items-center justify-center gap-x-4">
            GitHub
            <Icon icon="mdi:github" height="32px" width="32px" />
            </div>
          </a>

          <Link
            className='rounded-lg border bg-blue-800 px-5 py-2 font-semibold shadow-md transition-colors duration-300 hover:bg-blue-900'
            href='/'
          >
            <div className="flex flex-row items-center justify-center gap-x-4">
            Learn More
            <Icon icon="mdi:external-link" height="32px" width="32px" />
            </div>
          </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}
