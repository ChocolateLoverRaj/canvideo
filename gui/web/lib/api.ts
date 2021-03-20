import never from 'never'

const api = process.env.NODE_ENV === 'production'
  ? process.env.VERCEL_ENV === 'production'
    ? 'https://canvideo.herokuapp.com'
    : `https://canvideo-br-${process.env.VERCEL_GIT_COMMIT_REF ?? never('No git branch')}.herokuapp.com`
  : 'http://localhost:2990'

export default api