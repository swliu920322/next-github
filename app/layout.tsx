import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Avatar } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import './globals.css';
import { SearchBar } from '@/components/SearchBar';
import { Container } from '@/components/Container';
import StoreProvider from '@/app/StoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreProvider>
      <html lang="en">
      <body className={inter.className}>
      <AntdRegistry>
        <Layout className="h-screen">
          <Header className="flex justify-between items-center ">
            <div className="flex gap-8">
              <div className="flex items-center">
                <GithubOutlined className="text-3xl" style={{ color: 'white' }} />
              </div>
              <div className="h-full flex flex-col justify-center">
                <SearchBar />
              </div>
            </div>
            <div className="py-8">
              <Avatar size={64} icon={<UserOutlined />} />
            </div>
          </Header>
          <Content className="overflow-auto">
            <Container>
              {children}
            </Container>
          </Content>
          <Footer>
            Developed by Max
          </Footer>
        </Layout>
      </AntdRegistry>
      </body>
      </html>
    </StoreProvider>
  );
}
