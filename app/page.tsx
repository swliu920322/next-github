import { LoginButton, TabSelect } from '@/app/page.components';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import Image from 'next/image';

export default async function Page({ searchParams }) {
  let userInfo: Record<string, any> = {};
  const userInfoCookie = cookies().get('userInfo')?.value;
  if (userInfoCookie) {
    userInfo = JSON.parse(userInfoCookie);
  }
  if (!userInfo.avatar_url) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          {searchParams.error ? (
            <div className="p-10 flex justify-center">登录失败：{searchParams.error}</div>
          ) : (
            <span>亲，你还没有登录哦</span>
          )}
          <Suspense>
            <LoginButton />
          </Suspense>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full flex  p-6 gap-32 overflow-hidden">
        <div className="flex flex-col gap-1">
          {userInfo?.avatar_url && (
            <Image
              width={240}
              height={240}
              priority={true}
              src={userInfo?.avatar_url}
              className="w-60 rounded-full"
              alt="user avatar"
            />
          )}
          <span className="text-3xl font-bold">{userInfo.name}</span>
          <span>{userInfo.login}</span>
          <span>{userInfo.bio}</span>
          <span>{userInfo.location}</span>
          <span>{userInfo.company}</span>
          <p className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
            >
              <path
                d="M880.64 204.8h-737.28A61.44 61.44 0 0 0 81.92 265.0112v493.9776a61.44 61.44 0 0 0 18.0224 43.4176 59.8016 59.8016 0 0 0 41.7792 16.7936h737.28a61.44 61.44 0 0 0 61.44-61.44v-491.52A61.44 61.44 0 0 0 880.64 204.8z m0 573.44h-737.28a20.8896 20.8896 0 0 1-20.48-20.48V341.1968l358.8096 206.848a58.9824 58.9824 0 0 0 61.44 0L901.12 341.1968v417.792a20.48 20.48 0 0 1-20.48 19.2512zM901.12 294.0928l-378.88 218.7264a20.48 20.48 0 0 1-20.48 0L122.88 294.0928v-29.0816A20.48 20.48 0 0 1 143.36 245.76h737.28a20.48 20.48 0 0 1 20.48 20.48v26.624z"
                fill="#515151"
              />
            </svg>
            <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <Suspense>
            <TabSelect />
          </Suspense>
        </div>
      </div>
    );
  }
}
