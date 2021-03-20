import { FC, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Menu } from 'antd'
import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import CanvideoIcon from './CanvideoIcon'
import { MainPageProps } from './MainPageProps'

export interface HeaderProps {
  api: MainPageProps
}

const Header: FC<HeaderProps> = props => {
  const { api: { mainPage } } = props

  const router = useRouter()

  const handleClick = useCallback<MenuClickEventHandler>(e => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(e.key as string)
  }, [router])

  return (
    <Menu selectedKeys={[router.route]} mode='horizontal' onClick={handleClick}>
      <Menu.Item key={mainPage} icon={<CanvideoIcon />}>Canvideo</Menu.Item>
      <Menu.Item key='/create' icon={<PlusOutlined />}>Create</Menu.Item>
      <Menu.Item key='/export' icon={<DownloadOutlined />}>Export</Menu.Item>
    </Menu>
  )
}

export default Header
