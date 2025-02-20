import build from '../build/build.js'

build<HTMLFormElement>('#modal form', async form => (await import('./modal.js')).default(form))
