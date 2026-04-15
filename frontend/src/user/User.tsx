import { Outlet } from 'react-router-dom'

export default function User() {
  return (
    <>
      <p>user page</p>
      <Outlet />
    </>
  );
}
