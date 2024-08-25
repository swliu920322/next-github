import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { GithubOutlined } from '@ant-design/icons';
import './globals.css';
import { SearchBar } from '@/components/layout/SearchBar';
import { HeaderAvatar } from '@/components/layout/Avatar';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          {/*<PageLoading />*/}
          <Layout className="h-screen">
            <Header className="flex justify-between items-center ">
              <div className="flex gap-8 h-full">
                <div className="flex items-center">
                  <Link href="/" className="h-full">
                    <GithubOutlined className="text-3xl h-full" style={{ color: 'white' }} />
                  </Link>
                </div>
                <div className="h-full flex flex-col justify-center">
                  <SearchBar />
                </div>
              </div>
              <div className="py-4">
                <HeaderAvatar />
              </div>
            </Header>
            <Content className="overflow-auto bg-white">{children}</Content>
            <Footer className="flex justify-center">
              Developed by
              <Link href="https://github.com/swliu920322" className="ml-2">
                Max
              </Link>
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
