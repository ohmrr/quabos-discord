import Button from '@/components/Button';
import Container from '@/components/Container';
import StarBackground from '@/components/HomePage/StarBackground';
import { Icon } from '@iconify/react';

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
            <Button
              className='flex items-center'
              href='https://discord.com/oauth2/authorize?client_id=942251323741569024'
              color='blue'
            >
              <Icon icon='mdi:discord' height='24px' width='24px' /> Invite
            </Button>

            <Button
              className='flex items-center'
              href='https://github.com/ohmrr/quabos-discord'
              color='neutral'
            >
              <Icon icon='mdi:github' height='24px' width='24px' />
              GitHub
            </Button>
          </div>

          <div className='flex flex-row gap-x-6'>
            <Button
              className='flex items-center'
              href='/'
              color="green"
            >
              <Icon icon='mdi:external-link' height='24px' width='24px' />
              Guide
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
