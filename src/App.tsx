import { FC, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

import pepe from './pepe.png'
import Pixelit from './pixelit/pixelit'

const Example: FC = () => {
  console.log('Rendered')

  const fromRef = useRef<HTMLImageElement>(null)
  const toRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const pxRef = useRef<Pixelit | null>(null)

  useEffect(() => {
    const listener = (e: Event) => {
      const target = e.target as HTMLInputElement

      const src = target.files && target.files[0] 
        ? URL.createObjectURL(target.files[0])
        : fromRef.current?.src ?? ''

      pxRef.current?.setFromImgSource(src)
    }

    inputRef.current?.addEventListener('change', listener)

    return () => inputRef.current?.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    console.log('rerendering img')
    pxRef.current = new Pixelit({
      from: fromRef.current!,
      to: toRef.current!
    })
  }, [fromRef, toRef])

  useEffect(() => {
    pxRef.current?.pixelate()
  }, [pxRef])

  return (
    <div className="Example">
      <img src={pepe} alt="" ref={fromRef} onLoad={() => pxRef.current?.pixelate()} />
      <div className="canvasBg"><canvas ref={toRef}></canvas></div>
      <input type="file" accept="image/png, image/jpeg" ref={inputRef}></input>
    </div>
  )
}


function App() {

  return (
    <div className="App">
      <Example />
    </div>
  )
}

export default App
