import Container from '@/components/Container';
import StarBackground from '@/components/HomePage/StarBackground';

export default function Home() {
  return (
    <div className='relative h-screen w-screen'>
      <div className='absolute inset-0'>
        <StarBackground />
      </div>

      <Container className='absolute inset-0 flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-y-10'>
          <h1 className='text-6xl font-bold text-center'>Quabos</h1>

          <p className='text-2xl text-gray-300 font-norma'>Discord Bot from Hell.</p>

          <a
            className='border px-5 py-2 font-semibold bg-neutral-800 hover:bg-neutral-900 transition-colors duration-300 rounded-lg shadow-md'
            href='https://github.com/ohmrr/quabos-discord'
            target='_blank'
            rel='noopener noreferrer'
          >
            GitHub
          </a>
        </div>
      </Container>
    </div>
  );
}
