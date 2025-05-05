import React from 'react'
import { RouterProvider } from 'react-router-dom';
import Approute from './route/Approute';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <>
    <ToastContainer/>
    <RouterProvider router={Approute}/>
    </>
  )
}

export default App;
