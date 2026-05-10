import '../styles/title.css'

export default function Title() {
      return (
    <main className="main">
      <div className="background">
        <div className='blurText'>Jay Blur</div>
        <div className={"boldText"}>JEET BUBNA</div>
      </div>
 
      <div className={'image-wrapper'}>
        <img
          src="/collage.png"
          alt="Jeet Bubna collage"
          className={"collageImage"}
        />
      </div>
    </main>
  );
}
