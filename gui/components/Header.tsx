import { FC, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Menu, MenuProps } from 'antd'
import { PlusOutlined, DownloadOutlined, SettingOutlined, GithubOutlined } from '@ant-design/icons'
import CanvideoIcon from './CanvideoIcon'

const Header: FC = () => {
  const router = useRouter()

  const handleClick = useCallback<Exclude<MenuProps['onClick'], undefined>>(e => {
    if (e.key.startsWith('/')) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(new URL(e.key, window.location.origin))
    }
  }, [router])

  return (
    <Menu selectedKeys={[router.route]} mode='horizontal' onClick={handleClick}>
      <Menu.Item key='/' icon={<CanvideoIcon />}>Canvideo</Menu.Item>
      <Menu.Item key='/create' icon={<PlusOutlined />}>Create</Menu.Item>
      <Menu.Item key='/export' icon={<DownloadOutlined />}>Export</Menu.Item>
      <Menu.Item key='/settings' icon={<SettingOutlined />}>Settings</Menu.Item>
      <Menu.Item key='github' icon={<GithubOutlined />}>
        <a href='https://github.com/ChocolateLoverRaj/canvideo/tree/better'>GitHub</a>
      </Menu.Item>
    </Menu>
  )
}

export default Header
