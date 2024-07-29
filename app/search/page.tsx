"use client";
import { useEffect } from 'react';

export default function Search(props) {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <div>search{JSON.stringify(props.searchParams.query)}</div>
  )
}