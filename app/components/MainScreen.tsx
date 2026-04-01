import { myCustomFont } from "../fonts"

function MainScreen() {
  const customFont = myCustomFont
  return (
    <div className='relative flex items-center justify-center h-screen'>
        <div className={`absolute text-[225px] text-gray-400 text-bold ${customFont.className}`}>
        Jay <br />Blur
        </div>
        <div className="absolute text-9xl font-name-bold tracking-[35px] text-center text-gray-600">
        Jeet <br/>Bubna
        </div>
    </div>
  )
}

export default MainScreen