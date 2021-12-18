import { FC, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Menu, MenuProps } from 'antd'
import { PlusOutlined, DownloadOutlined, SettingOutlined } from '@ant-design/icons'
import CanvideoIcon from './CanvideoIcon'

const Header: FC = () => {
  const router = useRouter()

  const handleClick = useCallback<Exclude<MenuProps['onClick'], undefined>>(e => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(e.key)
  }, [router])

  return (
    <Menu selectedKeys={[router.route]} mode='horizontal' onClick={handleClick}>
      <Menu.Item key='/' icon={<CanvideoIcon />}>Canvideo</Menu.Item>
      <Menu.Item key='/create' icon={<PlusOutlined />}>Create</Menu.Item>
      <Menu.Item key='/export' icon={<DownloadOutlined />}>Export</Menu.Item>
      <Menu.Item key='/settings' icon={<SettingOutlined />}>Settings</Menu.Item>
    </Menu>
  )
}

export default Header
