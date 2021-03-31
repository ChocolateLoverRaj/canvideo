import { FC, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import {
  PlusOutlined,
  DownloadOutlined,
  SettingOutlined,
  GithubOutlined
} from '@ant-design/icons'
import CanvideoIcon from './CanvideoIcon'
import { ImNpm } from 'react-icons/im'

const Header: FC = () => {
  const router = useRouter()

  const handleClick = useCallback<MenuClickEventHandler>(({ key }) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (typeof key === 'string' && key.startsWith('/')) router.replace(key)
  }, [router])

  return (
    <Menu selectedKeys={[router.route]} mode='horizontal' onClick={handleClick}>
      <Menu.Item key='/' icon={<CanvideoIcon />}>Canvideo</Menu.Item>
      <Menu.Item key='/create' icon={<PlusOutlined />}>Create</Menu.Item>
      <Menu.Item key='/export' icon={<DownloadOutlined />}>Export</Menu.Item>
      <Menu.Item key='/settings' icon={<SettingOutlined />}>Settings</Menu.Item>
      <Menu.Item icon={<GithubOutlined />}>
        <a href='https://github.com/ChocolateLoverRaj/canvideo' target='_blank'>GitHub</a>
      </Menu.Item>
      <Menu.Item icon={<ImNpm />}>
        <a href='https://npmjs.com/package/canvideo' target='_blank'>Npm</a>
      </Menu.Item>
    </Menu>
  )
}

export default Header
