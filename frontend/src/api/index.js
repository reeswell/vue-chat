import user from './modules/user'
import friendly from './modules/friendly'
import upload from './modules/upload'
import group from './modules/group'

export default {
  ...user,
  ...friendly,
  ...upload,
  ...group
}
